import _ from 'lodash';
import React, { Component } from 'react';
import T from 'prop-types';
import { Table } from 'antd';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getOrganizationEntity } from '../../../../selectors/organizations';

const mapStateToProps = (state, ownProps) => {
  const organization = getOrganizationEntity(state, ownProps.match.params.organizationId);
  if (organization) {
    return {
      users: organization.members,
    };
  }
  return {
    users: [],
  };
};
const actions = {};

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(actions, dispatch) };
};

class OrganizationUserPage extends Component {

  static propTypes = {
    users: T.arrayOf(T.shape({
      email: T.string,
      name: T.string,
    })),
  }

  static defaultProps = {
    users: {
      email: '',
      name: '',
    },
  }

  render() {
    const { users } = this.props;
    const dataSource = _.map(users, (user) => {
      return {
        _id: user._id,
        name: user.name,
        role: user.role,
        invitedAt: user.createdAt,
      };
    });

    const columns = [{
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    }, {
      title: 'Organization role',
      dataIndex: 'role',
      key: 'role',
    }, {
      title: 'Invited At',
      dataIndex: 'invitedAt',
      key: 'invitedAt',
    }];

    return (
      <div>
        <Table dataSource={dataSource} columns={columns} />
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrganizationUserPage);
