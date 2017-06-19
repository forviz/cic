import React, { Component } from 'react';
import T from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';

import {
  Link,
} from 'react-router-dom';

import { Layout, Col, Row, Menu, Icon } from 'antd';

import { getUser, getUserOrganizationsWithSpaces } from '../../selectors';

import * as SpaceActions from '../../actions/spaces';
import CreateNewSpaceModal from '../../components/CreateNewSpaceModal';

const Header = Layout.Header;
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

const mapStateToProps = (state) => {
  const userProfile = getUser(state);
  const userOrganizations = getUserOrganizationsWithSpaces(state);
  return {
    userProfile,
    userOrganizations,
  };
};

const actions = {
  createNewSpace: SpaceActions.createNewSpace,
  populateSpaceWithTemplate: SpaceActions.populateSpaceWithTemplate,
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(actions, dispatch);
};

class AppHeader extends Component {

  static propTypes = {
    userProfile: T.object,
    userOrganizations: T.array,
    onLogin: T.func.isRequired,
    onLogout: T.func.isRequired,
    createNewSpace: T.func.isRequired,
    populateSpaceWithTemplate: T.func.isRequired,
  }

  static defaultProps = {
    userProfile: {},
    userOrganizations: [],
  }

  state = {
    showCreateSpaceModal: false,
  }

  createSpaceFormRef = (form) => {
    this.form = form;
  }

  handleCreateNewSpace = () => {
    const form = this.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      const { createNewSpace } = this.props;
      createNewSpace(values.name, {
        organizationId: values.organization,
        defaultLocale: values.defaultLocale,
      })
      .then((response) => {
        form.resetFields();
        this.setState({ showCreateSpaceModal: false });

        const spaceId = response.space._id;
        if (!_.isEmpty(values.template)) {
          // Create with template
          const { populateSpaceWithTemplate } = this.props;
          populateSpaceWithTemplate(spaceId, values.template);
        }
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
      default: break;
    }
  }

  closeCreateNewSpaceModal = () => {
    this.setState({
      showCreateSpaceModal: false,
    });
  }

  handleClickUserMenu = (e) => {
    const key = e.key;
    switch (key) {
      case 'logout': this.props.onLogout(); break;
      default: break;
    }
  }

  renderLeftMenu = () => {
    const { userOrganizations } = this.props;
    console.log('userOrganizations', userOrganizations);

    const organizations = _.map(userOrganizations, (org) => {
      return (
        <MenuItemGroup key={org._id} title={org.name}>
          {
            _.map(_.compact(org.spaces), (space) => {
              return (
                <Menu.Item key={space._id}>
                  <Link to={`/spaces/${space._id}/content_types`}>{space.name || 'No name'}</Link>
                </Menu.Item>
              );
            })
          }
        </MenuItemGroup>
      );
    });

    return (
      <Menu
        theme="dark"
        mode="horizontal"
        style={{ lineHeight: '64px' }}
        onClick={this.handleClickMenu}
      >
        <SubMenu title={'Spaces'}>
          {organizations}
          <Menu.Item key="add-new-space">
            <Icon type="plus" /> Add new Space
          </Menu.Item>
        </SubMenu>
      </Menu>
    );
  }

  renderUserMenu = (userProfile) => {
    const imgStyle = { position: 'relative', top: 4, marginBottom: -8, left: -4 };
    const userTitle = (
      <span>
        <img src={userProfile.picture} alt="Profile" width="32" height="32" style={imgStyle} /> {userProfile.email}
      </span>);

    return (
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={['1']}
        style={{ lineHeight: '64px' }}
        onClick={this.handleClickUserMenu}
      >
        <SubMenu title={userTitle}>
          <Menu.Item key="profile"><Link to="/account/profile/user">User profile</Link></Menu.Item>
          <Menu.Item key="organizations"><Link to="/account/profile/organizations">Organizations</Link></Menu.Item>
          <Menu.Item key="logout">Logout</Menu.Item>
        </SubMenu>
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

  render() {
    const { userProfile, userOrganizations } = this.props;
    return (
      <Header className="header">
        <div className="logo" />
        <Row type="flex" justify="space-between">
          <Col span={20}>
            {this.renderLeftMenu()}
          </Col>
          <Col span={4}>
            {userProfile.isAuthenticated ? this.renderUserMenu(userProfile) : this.renderGuestMenu()}
          </Col>
        </Row>

        <CreateNewSpaceModal
          ref={this.createSpaceFormRef}
          userOrganizations={userOrganizations}
          visible={this.state.showCreateSpaceModal}
          onSubmit={this.handleCreateNewSpace}
          onCancel={this.closeCreateNewSpaceModal}
        />
      </Header>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AppHeader);
