import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';

import {
  Link,
} from 'react-router-dom'

import { Layout, Col, Row, Menu, Icon } from 'antd';

import * as SpaceActions from '../../actions/spaces';
import CreateNewSpaceModal from '../../components/CreateNewSpaceModal';

const Header = Layout.Header;
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

const actions = {
  createNewSpace: SpaceActions.createNewSpace,
  populateSpaceWithTemplate: SpaceActions.populateSpaceWithTemplate,
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(actions, dispatch);
};

class AppHeader extends Component {

  static propTypes = {
    userOrganizations: PropTypes.array,
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
      const { createNewSpace } = this.props;
      debugger;
      createNewSpace(values.name, { organizationId: values.organization, defaultLocale: values.defaultLocale })
      .then(response => {
        form.resetFields();
        this.setState({ showCreateSpaceModal: false });

        console.log('createNewSpace', response);
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


  renderLeftMenu = () => {

    const { userOrganizations } = this.props;
    return (
      <Menu
        theme="dark"
        mode="horizontal"
        style={{ lineHeight: '64px' }}
        onClick={this.handleClickMenu}
      >
        <SubMenu title={'Spaces'}>
          {
            userOrganizations.map(org =>
              <MenuItemGroup key={org._id} title={org.name}>
                {
                  _.map(_.compact(org.spaces), space =>
                    <Menu.Item key={space._id}>
                      <Link to={`/spaces/${space._id}/content_types`}>{space.name || 'No name'}</Link>
                    </Menu.Item>
                  )
                }
              </MenuItemGroup>
            )
          }
          <Menu.Item key="add-new-space">
            <Icon type="plus" /> Add new Space
          </Menu.Item>
        </SubMenu>
      </Menu>
    );
  }

  handleClickUserMenu = (e) => {
    const key = e.key;
    switch (key) {
      case 'logout': this.props.onLogout(); break;
      default: break;
    }

  }

  renderUserMenu = (userProfile) => {
    return (
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={['1']}
        style={{ lineHeight: '64px' }}
        onClick={this.handleClickUserMenu}
      >
        <SubMenu title={<span><img src={userProfile.picture} alt="Profile" width="32" height="32" style={{ position: 'relative', top: 4, marginBottom: -8, left: -4 }} /> {userProfile.email}</span>}>
          <Menu.Item key="organization"><Link to="/account/profile/organization">Organizatoin</Link></Menu.Item>
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

  render () {

    const { userProfile, userOrganizations } = this.props;
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
          userOrganizations={userOrganizations}
          visible={this.state.showCreateSpaceModal}
          onSubmit={this.handleCreateNewSpace}
          onCancel={this.closeCreateNewSpaceModal}
        />
      </Header>
    );
  }
}

export default connect(undefined, mapDispatchToProps)(AppHeader);
