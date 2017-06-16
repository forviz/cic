import React, { Component } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Card, Menu, Icon } from 'antd';
import { Link, Route } from 'react-router-dom';

import { fetchOrganization, fetchOrganizationMembers } from '../../../api/cic/organizations';
import OrganizationSettingPage from './setting';
import OrganizationSubscriptionPage from './subscription';
import OrganizationUsersPage from './users';
import OrganizationSpacesPage from './spaces/index';

import { receiveOrganization, receiveOrganizationMembers } from '../../../actions/organizations';

class AccountOrganization extends Component {

  static propTypes = {
    pathname: T.string.isRequired,
    organizationId: T.string.isRequired,
    actions: T.shape({
      initOrganization: T.func.isRequired,
    }).isRequired,
  }

  componentDidMount() {
    const { organizationId, actions } = this.props;
    const { initOrganization } = actions;
    initOrganization(organizationId);
  }

  render() {
    const { pathname, organizationId } = this.props;
    return (
      <div>
        <Card>
          <h1>Organizations &amp; Billing</h1>
          <Menu
            style={{ marginBottom: 20 }}
            mode="horizontal"
            selectedKeys={[pathname]}
          >
            <Menu.Item key={`/account/organizations/${organizationId}/edit`}>
              <Link to={`/account/organizations/${organizationId}/edit`}><Icon type="user" />Setting</Link>
            </Menu.Item>
            <Menu.Item key={`/account/organizations/${organizationId}/subscription`}>
              <Link to={`/account/organizations/${organizationId}/subscription`}><Icon type="book" />Subscription</Link>
            </Menu.Item>
            <Menu.Item key={`/account/organizations/${organizationId}/users`}>
              <Link to={`/account/organizations/${organizationId}/users`}><Icon type="team" />Users</Link>
            </Menu.Item>
            <Menu.Item key={`/account/organizations/${organizationId}/spaces`}>
              <Link to={`/account/organizations/${organizationId}/spaces`}><Icon type="solution" />Spaces</Link>
            </Menu.Item>
          </Menu>

          <Route
            key="setting"
            path="/account/organizations/:organizationId/edit"
            component={OrganizationSettingPage}
          />
          <Route
            key="subscription"
            path="/account/organizations/:organizationId/subscription"
            component={OrganizationSubscriptionPage}
          />
          <Route
            key="users"
            path="/account/organizations/:organizationId/users"
            component={OrganizationUsersPage}
          />
          <Route
            key="spaces"
            path="/account/organizations/:organizationId/spaces"
            component={OrganizationSpacesPage}
          />
        </Card>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    pathname: ownProps.location.pathname,
    organizationId: ownProps.match.params.organizationId,
  };
};

const actions = {
  initOrganization: (orgId) => {
    return (dispatch) => {
      fetchOrganization(orgId)
      .then((organization) => {
        dispatch(receiveOrganization(orgId, organization));

        fetchOrganizationMembers(orgId)
        .then((response) => {
          dispatch(receiveOrganizationMembers(orgId, response.items));
        });
      });
    };
  },
};

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(actions, dispatch) };
};

export default connect(mapStateToProps, mapDispatchToProps)(AccountOrganization);
