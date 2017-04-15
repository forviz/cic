import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';

import {
  BrowserRouter as Router,
  Link,
  withRouter,
} from 'react-router-dom'

import { Layout, Col, Row, Menu, Dropdown, Icon } from 'antd';
const Header = Layout.Header;

import AuthService from '../../modules/auth/AuthService';
import * as SpaceActions from '../../actions/spaces';
import CreateNewSpaceModal from '../../components/CreateNewSpaceModal';


const mapStateToProps = (state) => {
  return {};
};

const actions = {
  createNewSpace: SpaceActions.createNewSpace,
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(actions, dispatch);
};

class AppHeader extends Component {

  static propTypes = {
    // auth: PropTypes.instanceOf(AuthService),
    onLogin: PropTypes.func,
    onLogout: PropTypes.func,
  }

  state = {
    showCreateSpaceModal: false,
  }

  createSpaceFormRef = (form) => {
    this.form = form;
  }

  handleCreateNewSpace = (e) => {
    const form = this.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      const { createNewSpace } = this.props.actions;
      createNewSpace(values.name, { defaultLocale: values.defaultLocale })
      .then(response => {
        form.resetFields();
        this.setState({ showCreateSpaceModal: false });
      });
    });
  }

  handleClickMenu = ({ key }) => {
    switch (key) {

      case 'add-new-space':
        this.setState({
          showCreateSpaceModal: true,
        });
        break;
    }

  }

  closeCreateNewSpaceModal = () => {
    this.setState({
      showCreateSpaceModal: false,
    });
  }

  renderLeftMenu = () => {

    const userSpaces = [];

    const spaceMenu = (
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
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={['2']}
        style={{ lineHeight: '64px' }}
      >
        <Menu.Item key="1">
          <Dropdown overlay={spaceMenu} trigger={['click']}>
            <a className="ant-dropdown-link" href="#">
              Spaces <Icon type="down" />
            </a>
          </Dropdown>
        </Menu.Item>
      </Menu>
    );
  }

  renderUserMenu = (userProfile) => {

    const userDropdownMenu = (
      <Menu onClick={this.props.onLogout}>
        <Menu.Item key="logout">Logout</Menu.Item>
      </Menu>
    );

    return (
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={['1']}
        style={{ lineHeight: '64px' }}
      >
        <Menu.Item key="1">
          <Dropdown overlay={userDropdownMenu} trigger={['click']}>
            <a className="ant-dropdown-link" href="#">{userProfile.name} <Icon type="down" /></a>
          </Dropdown>
        </Menu.Item>
      </Menu>
    );
  }

  renderGuestMenu = () => {
    return (
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={['1']}
        style={{ lineHeight: '64px' }}
        onClick={this.props.onLogin}
      >
        <Menu.Item key="login">Login</Menu.Item>
      </Menu>
    );
  }

  render () {

    const { userProfile } = this.props;
    console.log('userProfile', userProfile);
    return (
      <Header className="header">
        <div className="logo" />
        <Row type="flex" justify="space-between">
          <Col span={20}>
            {this.renderLeftMenu()}
          </Col>
          <Col span={4}>
            {!_.isEmpty(userProfile) ? this.renderUserMenu(userProfile) : this.renderGuestMenu()}
          </Col>
        </Row>

        <CreateNewSpaceModal
          ref={this.createSpaceFormRef}
          visible={this.state.showCreateSpaceModal}
          onSubmit={this.handleCreateNewSpace}
          onCancel={this.closeCreateNewSpaceModal}
        />
      </Header>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AppHeader);
