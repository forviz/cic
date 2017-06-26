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
      spaces: organization.spaces,
    };
  }
  return {
    spaces: [],
  };
};
const actions = {};

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(actions, dispatch) };
};

class OrganizationSpacePage extends Component {

  static propTypes = {
    spaces: T.arrayOf(T.shape({
      _id: T.string,
      name: T.string,
    })),
  }

  static defaultProps = {
    spaces: [],
  }

  render() {
    const { spaces } = this.props;
    const dataSource = _.map(spaces, (space) => {
      return {
        _id: space._id,
        name: space.name,
        countContentTypes: _.get(space, 'stats.contentTypes', 0),
        countEntries: _.get(space, 'stats.entries', 0),
        createdAt: space.createdAt,
      };
    });

    const columns = [{
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: 'Content Types',
      dataIndex: 'countContentTypes',
      key: 'contentTypes',
    }, {
      title: 'Entries',
      dataIndex: 'countEntries',
      key: 'entries',
    }, {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
    }];

    return (
      <div>
        <Table dataSource={dataSource} columns={columns} />
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrganizationSpacePage);
