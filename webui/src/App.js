import React, { Component } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Layout, LocaleProvider, Spin } from 'antd';

import _ from 'lodash';

import {
  BrowserRouter as Router,
  Route,
  Redirect,
} from 'react-router-dom';

import enUS from 'antd/lib/locale-provider/en_US';

import 'antd/dist/antd.css';
import './App.css';

import * as Actions from './actions/application';

import AppHeader from './containers/AppHeader';
import HomeContainer from './containers/Home';
import SpaceContainer from './containers/Space';
import AccountProfileContainer from './containers/account/profile';
import AccountOrganizationContainer from './containers/account/organizations';

import { getUser, getUserOrganizationsWithSpaces } from './selectors';

import AuthService from './modules/auth/AuthService';

import CICJS from './modules/cic';

const { Content } = Layout;

const AUTH0_CLIENT_ID = process.env.REACT_APP_AUTH0_CLIENT_ID;
const AUTH0_DOMAIN = process.env.REACT_APP_AUTH0_DOMAIN;
const auth = new AuthService(AUTH0_CLIENT_ID, AUTH0_DOMAIN);


const accessToken = localStorage.getItem('access_token');
export const cic = new CICJS();
cic.createClient({
  secure: false,
  host: 'localhost:4000/v1',
  accessToken,
});

const PrivateRoute = ({ component: RouteComponent, ...rest }) => {
  return (
    <Route
      {...rest}
      render={
        props => (
        auth.loggedIn() ? (
          <RouteComponent {...props} />
        ) : (
          <Redirect to={{ pathname: '/', state: { from: _.get(props, 'location') } }} />
        )
      )}
    />
  );
};

PrivateRoute.propTypes = {
  component: T.node,
};

PrivateRoute.defaultProps = {
  component: Spin,
};

const mapStateToProps = (state) => {
  const userProfile = getUser(state);
  const userOrganizations = getUserOrganizationsWithSpaces(state);
  return {
    userProfile,
    userOrganizations,
  };
};

const appActions = {
  initWithUser: Actions.initWithUser,
  updateUserProfile: Actions.updateUserProfile,
  clearUserProfile: Actions.clearUserProfile,
};

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(appActions, dispatch),
});

class App extends Component {

  static propTypes = {
    actions: T.shape({
      initWithUser: T.func.isRequired,
    }).isRequired,
  }

  constructor(props) {
    super(props);
    const { initWithUser, updateUserProfile, clearUserProfile } = props.actions;

    const userProfile = auth.getProfile();
    if (!_.isEmpty(_.get(userProfile, 'sub'))) {
      updateUserProfile(userProfile);
      initWithUser(userProfile.sub, auth);
    }


    // On Login Success
    auth.on('login_success', (authResult, profile) => {
      console.log('auth.login_success', authResult, profile);
    });

    // On Receive Profile
    auth.on('profile_updated', (newProfile) => {
      console.log('auth.profile_updated', newProfile);
      updateUserProfile(newProfile);
      initWithUser(userProfile.sub, auth);
    });

    // On Logout Success
    auth.on('logout_success', () => {
      console.log('auth.logout_success');
      clearUserProfile(null);
    });
  }

  componentDidMount() {
    if (!auth.loggedIn) auth.login();
  }

  handleLogin = () => {
    auth.login();
  }

  handleLogout = () => {
    auth.logout();
  }

  render() {
    return (
      <LocaleProvider locale={enUS}>
        <Router>
          <Layout>
            <AppHeader
              onLogin={this.handleLogin}
              onLogout={this.handleLogout}
            />
            <Content>
              <Route key="home" path="/" exact render={routeProps => <HomeContainer {...routeProps} auth={auth} />} />
              <PrivateRoute
                key="space"
                path="/spaces/:spaceId"
                component={SpaceContainer}
              />
              <PrivateRoute
                key="account_user"
                path="/account/profile"
                component={AccountProfileContainer}
              />
              <PrivateRoute
                key="account_organization"
                path="/account/organizations/:organizationId"
                component={AccountOrganizationContainer}
              />
            </Content>
          </Layout>
        </Router>
      </LocaleProvider>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
