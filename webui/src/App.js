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
import * as SpaceActions from './actions/spaces';
import SpaceContainer from './containers/Space';
import LoginContainer from './containers/Login';

import CreateNewSpaceModal from './components/CreateNewSpaceModal';
import { getUserSpaces } from './selectors';

const mapStateToProps = (state) => {
  return {
    user: state.user,
    userSpaces: getUserSpaces(state),
  }
};

const actions = {
  initApplication: Actions.initApplication,
  createNewSpace: SpaceActions.createNewSpace,
};

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(actions, dispatch) };
}

class App extends Component {

  state = {
    showCreateSpaceModal: false,
  }

  componentDidMount() {
    const { actions } = this.props;
    actions.initApplication();
  }

  handleCreateNewSpace = (e) => {
    const form = this.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      console.log('Received values of form: ', values);

      const { createNewSpace } = this.props.actions;
      createNewSpace(values.name, { defaultLocale: values.defaultLocale })
      .then(response => {
        form.resetFields();
        this.setState({ showCreateSpaceModal: false });
      });
    });
  }

  handleClickMenu = ({ key }) => {
    if (key === 'add-new-space') {
      this.setState({
        showCreateSpaceModal: true,
      });
    }
  }

  closeCreateNewSpaceModal = () => {
    this.setState({
      showCreateSpaceModal: false,
    });
  }

  createSpaceFormRef = (form) => {
    this.form = form;
  }

  render() {

    const { userSpaces } = this.props;

    const menu = (
      <Menu onClick={this.handleClickMenu}>
        {
          userSpaces.map(space =>
            <Menu.Item key={space._id}>
              <Link to={`/spaces/${space._id}/content_types`}>{space.name || 'No name'}</Link>
            </Menu.Item>
          )
        }
        <Menu.Divider />
        <Menu.Item key="add-new-space">
          <Icon type="plus" /> Add new Space
        </Menu.Item>
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
              <CreateNewSpaceModal
                ref={this.createSpaceFormRef}
                visible={this.state.showCreateSpaceModal}
                onSubmit={this.handleCreateNewSpace}
                onCancel={this.closeCreateNewSpaceModal}
              />
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
