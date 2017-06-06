import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Layout, LocaleProvider } from 'antd';

import _ from 'lodash';

import {
  BrowserRouter as Router,
  Route,
  Redirect,
} from 'react-router-dom'

import enUS from 'antd/lib/locale-provider/en_US';

import 'antd/dist/antd.css';
import './App.css';

import * as Actions from './actions/application';

import AppHeader from './containers/AppHeader';
import HomeContainer from './containers/Home';
import WelcomeContainer from './containers/Welcome';
import SpaceContainer from './containers/Space';

import { getUserSpaces, getUserOrganizationsWithSpaces } from './selectors';

import AuthService from './modules/auth/AuthService';

const { Content } = Layout;

const AUTH0_CLIENT_ID = process.env.REACT_APP_AUTH0_CLIENT_ID;
const AUTH0_DOMAIN = process.env.REACT_APP_AUTH0_DOMAIN;
const auth = new AuthService(AUTH0_CLIENT_ID, AUTH0_DOMAIN);

const PrivateRoute = ({ component: Component, ...rest }) => {

  return (<Route {...rest} render={props => (
    auth.loggedIn() ? (
      <Component {...props}/>
    ) : (
      <Redirect to={{
        pathname: '/',
        state: { from: props.location }
      }}/>
    )
  )}/>);
}

const mapStateToProps = (state, ownProps) => {

  const userOrganizations = getUserOrganizationsWithSpaces(state);

  return {
    userOrganizations,
  }
};

const actions = {
  initWithUser: Actions.initWithUser,
};

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(actions, dispatch) };
}

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      userProfile: auth.getProfile(),
    }

    // On Login Success
    auth.on('login_success', (authResult) => {
      console.log('Login success', authResult);
    });

    // On Receive Profile
    auth.on('profile_updated', (newProfile) => {
      this.setState({ userProfile: newProfile });

      const { actions } = this.props;
      actions.initWithUser(newProfile.sub);
    });

    // On Logout Success
    auth.on('logout_success', () => {
      this.setState({ userProfile: undefined });
    });

  }

  componentDidMount() {
    const { actions } = this.props;
    if (!_.isEmpty(_.get(this.state, 'userProfile.sub'))) {
      actions.initWithUser(this.state.userProfile.sub);
    }
  }

  handleLogin = () => {
    auth.login();
  }

  handleLogout = () => {
    auth.logout();
  }

  render() {
    const { userSpaces, userOrganizations } = this.props;
    const { userProfile } = this.state;
    return (
      <LocaleProvider locale={enUS}>
        <Router>
          <Layout>
            <AppHeader
              userProfile={userProfile}
              userOrganizations={userOrganizations}
              onLogin={this.handleLogin}
              onLogout={this.handleLogout}
            />
            <Content>
              <Route key="home" path="/" exact render={(routeProps) => <HomeContainer {...routeProps} auth={auth} userProfile={userProfile} userSpaces={userSpaces} />} />
              <PrivateRoute key="welcome" path="/welcome" exact component={WelcomeContainer} />
              <PrivateRoute
                key="space"
                path="/spaces/:spaceId"
                component={SpaceContainer}
              />
            </Content>
          </Layout>
        </Router>
      </LocaleProvider>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
