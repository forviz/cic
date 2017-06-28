import React, { Component } from 'react';
import T from 'prop-types';
import { Card, Menu, Icon } from 'antd';
import { Link, Route } from 'react-router-dom';

import UserProfileSettingPage from './setting';
import UserSpacesPage from './Spaces';
import UserOrganizationsPage from './organization';
import newAddPage from './organization/addnew';
import UserOAuthTokenPage from './tokens';
import UserApplication from './developers/Applications';

class AccountIndex extends Component {

  static propTypes = {
    location: T.shape({
      pathname: T.string,
    }),
  }

  static defaultProps = {
    location: { pathname: '' },
  }

  render() {
    return (
      <div>
        <Card>
          <h1>User Profile</h1>
          <Menu
            style={{ marginBottom: 20 }}
            mode="horizontal"
            selectedKeys={[this.props.location.pathname]}
          >
            <Menu.Item key="/account/profile/user">
              <Link to="/account/profile/user"><Icon type="user" />Setting</Link>
            </Menu.Item>
            <Menu.Item key="/account/profile/spaces">
              <Link to="/account/profile/spaces"><Icon type="solution" />Spaces</Link>
            </Menu.Item>
            <Menu.Item key="/account/profile/organizations">
              <Link to="/account/profile/organizations"><Icon type="team" />Organization</Link>
            </Menu.Item>
            <Menu.Item key="/account/profile/access_grants">
              <Link to="/account/profile/access_grants"><Icon type="api" />OAuth Tokens</Link>
            </Menu.Item>
            <Menu.Item key="/account/profile/developers/applications">
              <Link to="/account/profile/developers/applications"><Icon type="appstore" />Applications</Link>
            </Menu.Item>
          </Menu>

          <Route
            key="setting"
            path="/account/profile/user"
            component={UserProfileSettingPage}
          />
          <Route
            key="spaces"
            path="/account/profile/spaces"
            component={UserSpacesPage}
          />
          <Route
            key="organization"
            path="/account/profile/organizations"
            component={UserOrganizationsPage}
          />
          <Route
            key="btnNewOrganiztion"
            path="/account/profile/addnew"
            component={newAddPage}
          />
          <Route
            key="oauthToken"
            path="/account/profile/access_grants"
            component={UserOAuthTokenPage}
          />
          <Route
            key="applications"
            exact
            path="/account/profile/developers/applications"
            component={UserApplication}
          />

        </Card>
      </div>
    );
  }
}

export default AccountIndex;
