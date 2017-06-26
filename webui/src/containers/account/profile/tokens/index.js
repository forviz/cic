import _ from 'lodash';
import React, { Component } from 'react';
import T from 'prop-types';
import { Table, Row, Col, Button, Icon } from 'antd';
import {
  Link,
} from 'react-router-dom';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class OauthTokensPage extends Component {

  static propTypes = {
    tokens: T.arrayOf(T.shape({
      name: T.string,
    })),
  }

  static defaultProps = {
    tokens: [],
  }

  render() {
    const { tokens } = this.props;
    const dataSource = _.map(tokens, (app) => {
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
    }, {
      title: 'Write',
      dataIndex: 'write',
      key: 'write',
    }, {
      title: 'Created At',
      dataIndex: 'created',
      key: 'created',
    }];

    return (
      <div>
        <div><h2>Tokens</h2></div>
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
    tokens: [
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

export default connect(mapStateToProps, mapDispatchToProps)(OauthTokensPage);
