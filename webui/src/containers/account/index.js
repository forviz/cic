import React, {Component} from 'react';
import { Tabs, Card, Menu, Icon } from 'antd';
import {
  Link, Route
} from 'react-router-dom'

import SettingPage from './setting';
import OrganizationPage from './organization';
import newAddPage from './organization/addnew';
import '../../styles/style.css';

const TabPane = Tabs.TabPane;


class AccountIndex extends Component{



	render(){
		return(
			<div>
        <Card>
          <Menu
            mode="horizontal"
          >
            <Menu.Item className = "pin-btnmainProfile" key="setting">
              <Link to="/account/profile/user"><Icon type="user" />Setting</Link>
            </Menu.Item>
            <Menu.Item className = "pin-btnmainProfile" key="organization">
              <Link to="/account/profile/organization"><Icon type="team" />Organization</Link>
            </Menu.Item>
          </Menu>

          <Route
            key="setting"
            path="/account/profile/user"
            component={SettingPage}
          />
          <Route
            key="organization"
            path="/account/profile/organization"
            component={OrganizationPage}
          />
          <Route
            key="btnNewOrganiztion"
            path="/account/profile/addnew"
            component={newAddPage}
          />

        </Card>
      </div>
		)
	}
}

export default AccountIndex;