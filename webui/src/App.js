import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';

import {
  BrowserRouter as Router,
  Route,
  Link,
} from 'react-router-dom'

import { LocaleProvider } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

import 'antd/dist/antd.css';
import './App.css';

import { Layout, Menu, Icon, Dropdown } from 'antd';
const { Header, Content } = Layout;

import * as Actions from './actions/application';
import SpaceContainer from './containers/Space';
import LoginContainer from './containers/Login';

import { getUserSpaces } from './selectors';

const mapStateToProps = (state) => {
  return {
    user: state.user,
    userSpaces: getUserSpaces(state),
  }
};

const actions = {
  initApplication: Actions.initApplication,
};

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(actions, dispatch) };
}

class App extends Component {

  componentDidMount() {
    const { actions } = this.props;
    actions.initApplication();
  }

  render() {

    const { userSpaces } = this.props;

    const menu = (
      <Menu>
        {
          userSpaces.map(space =>
            <Menu.Item key={space._id}>
              <Link to={`/spaces/${space._id}/content_types`}>{space.name || 'No name'}</Link>
            </Menu.Item>
          )
        }
        <Menu.Divider />
      </Menu>
    );

    return (
      <LocaleProvider locale={enUS}>
        <Router>
          <Layout>
            <Header className="header">
              <div className="logo" />
              <Dropdown overlay={menu} trigger={['click']}>
                <a className="ant-dropdown-link" href="#">
                  Spaces <Icon type="down" />
                </a>
              </Dropdown>
            </Header>
            <Content>
              <Route key="login" path="/login" component={LoginContainer} />
              <Route
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
