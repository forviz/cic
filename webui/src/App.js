import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';

import {
  BrowserRouter as Router,
  Route,
  Link,
} from 'react-router-dom'

import 'antd/dist/antd.css';
import './App.css';

import { Layout, Menu, Icon, Dropdown } from 'antd';
const { Header } = Layout;

import * as Actions from './actions/application';
import SpaceContainer from './containers/Space';

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
      <Router>
        <Layout>
          <Header className="header">
            <div className="logo" />
            <Dropdown overlay={menu} trigger={['click']}>
              <a className="ant-dropdown-link" href="#">
                Spaces <Icon type="down" />
              </a>
            </Dropdown>
            <Menu
              theme="dark"
              mode="horizontal"
              defaultSelectedKeys={['2']}
              style={{ lineHeight: '64px' }}
            >
              <Menu.Item key="1">nav 1</Menu.Item>
            </Menu>
          </Header>
          <div>
            <Route
              key="space"
              path="/spaces/:spaceId"
              component={SpaceContainer}
            />
          </div>
        </Layout>
      </Router>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
