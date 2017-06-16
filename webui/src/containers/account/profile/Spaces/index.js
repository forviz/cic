import _ from 'lodash';
import React, { Component } from 'react';
import T from 'prop-types';
import { Table, Popconfirm } from 'antd';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getUserOrganizationsWithSpaces } from '../../../../selectors';

class AccountSpacesPage extends Component {
  static propTypes = {
    userOrganizations: T.arrayOf(T.shape({
      _id: T.string,
      name: T.string,
    })),
    actions: T.shape({
      leaveSpace: T.func,
    }).isRequired,
  }

  static defaultProps = {
    userOrganizations: [],
  }

  render() {
    const { userOrganizations, actions } = this.props;

    const spaces = _.flatten(_.map(userOrganizations, (org) => {
      return _.map(org.spaces, (space) => {
        return {
          ...space,
          organization: { _id: org._id, name: org.name },
        };
      });
    }));

    const dataSource = _.map(spaces, (space) => {
      return {
        _id: space._id,
        name: space.name,
        organization: _.get(space, 'organization.name'),
        created: space.createdAt,
      };
    });

    const columns = [{
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: 'Organization',
      dataIndex: 'organization',
      key: 'organization',
    }, {
      title: 'Created At',
      dataIndex: 'created',
      key: 'created',
    }, {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      render: (text, record) => (
        <span>
          <Popconfirm
            title="Confirm leaving this space?"
            onConfirm={() => actions.leaveSpace(record._id)}
            onCancel={this.cancel}
            okText="Yes"
            cancelText="No"
          >
            <a href="#">Leave</a>
          </Popconfirm>
        </span>
      ),
    }];

    return (
      <div>
        <Table dataSource={dataSource} columns={columns} />
      </div>
    );
  }
}

const mapStateToProps = (state) => { // map dataManager
  const userOrganizations = getUserOrganizationsWithSpaces(state);
  return {
    userOrganizations,
  };
};

const actions = {
  leaveSpace: (spaceId) => {
    console.log('leaveSpace', spaceId);
    return { type: 'TEMP' };
  },
};

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(actions, dispatch) };
};

export default connect(mapStateToProps, mapDispatchToProps)(AccountSpacesPage);
