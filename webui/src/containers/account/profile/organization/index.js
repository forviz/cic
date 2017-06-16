import _ from 'lodash';
import React, { Component } from 'react';
import T from 'prop-types';
import { Table, Button } from 'antd';
import {
  Link,
} from 'react-router-dom';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as Actions from './actions';
import { getUserOrganizations } from '../../../../selectors';

class UserOrganizationsPage extends Component {

  static propTypes = {
    organizations: T.arrayOf(T.shape({
      _id: T.string,
      name: T.string,
    })),
    actions: T.shape({
      createNewOrganization: T.func,
      leaveOrganization: T.func,
    }).isRequired,
  }

  static defaultProps = {
    organizations: [],
  }
  render() {
    const { organizations, actions } = this.props;

    const dataSource = _.map(organizations, (org) => {
      return {
        _id: org._id,
        name: org.name,
        invited: 'Today',
      };
    });

    const columns = [{
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, org) => <Link to={`/account/organizations/${org._id}/subscription`}>{text}</Link>,
    }, {
      title: 'Invited At',
      dataIndex: 'invited',
      key: 'invitedA',
    }, {
      title: 'Action',
      dataIndex: 'action',
      key: 'actionA',
    }];

    return (
      <div>
        <div><h2>Organization</h2></div>
        <Table dataSource={dataSource} columns={columns} />
        <Link to="/account/profile/addnew">New Organization</Link>
        <Button type="danger" onClick={actions.leaveOrganization}>Delete Organization</Button>
      </div>
    );
  }
}

const mapStateToProps = (state) => { // map dataManager
  return {
    organizations: getUserOrganizations(state),
  };
};

const actions = {  // all action that involved
  createNewOrganization: Actions.createNewOrganization,
  leaveOrganization: Actions.leaveOrganization,
};

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(actions, dispatch) };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserOrganizationsPage);
