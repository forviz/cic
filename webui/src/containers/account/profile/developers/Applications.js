import _ from 'lodash';
import React, { Component } from 'react';
import T from 'prop-types';
import { Table, Row, Col, Button, Icon } from 'antd';
import {
  Link,
} from 'react-router-dom';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class DeveloperApplicationsPage extends Component {

  static propTypes = {
    applications: T.arrayOf(T.shape({
      _id: T.string,
      name: T.string,
    })),
  }

  static defaultProps = {
    applications: [],
  }

  render() {
    const { applications } = this.props;
    const dataSource = _.map(applications, (app) => {
      return {
        name: app.name,
        read: app.read,
        write: app.write,
        created: app.createdAt,
      };
    });

    const columns = [{
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: 'Read',
      dataIndex: 'read',
      key: 'read',
      render: value => (value ? <Icon type="check" /> : <Icon type="close" />),
    }, {
      title: 'Write',
      dataIndex: 'write',
      key: 'write',
      render: value => (value ? <Icon type="check" /> : <Icon type="close" />),
    }, {
      title: 'Created At',
      dataIndex: 'created',
      key: 'created',
    }];

    return (
      <div>
        <Row>
          <Col span={12} style={{ marginBottom: 20 }}>
            <Link to="/account/profile/deveopers/applications/new">
              <Button type="primary"><Icon type="plus" /> Add New Application</Button>
            </Link>
          </Col>
        </Row>
        <Table dataSource={dataSource} columns={columns} />
      </div>
    );
  }
}

/* eslint-disable no-unused-vars */
const mapStateToProps = (state) => {
  return {
    applications: [
      {
        name: 'cicapp',
        read: true,
        write: true,
        createdAt: '2017-02-01T10:50:40',
      },
    ],
  };
};

const actions = {};

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(actions, dispatch) };
};

export default connect(mapStateToProps, mapDispatchToProps)(DeveloperApplicationsPage);
