import React, { Component } from 'react';
import T from 'prop-types';
import _ from 'lodash';
import { Link } from 'react-router-dom';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Row, Col, Icon, Table, Popconfirm } from 'antd';

import * as Actions from './actions';
import { getActiveSpace } from '../../../selectors';

class ApiKeyList extends Component {

  static propTypes = {
    space: T.shape({
      _id: T.string,
      name: T.string,
    }).isRequired,
    actions: T.shape({
      createApiKey: T.func,
      deleteApiKey: T.func,
    }).isRequired,
  }

  static defaultProps = {}

  displayName = 'ApiKeys';

  state = {
    modalVisible: false,
  }

  handleClickAdd = () => {
    const { space } = this.props;
    const { createApiKey } = this.props.actions;
    createApiKey(space._id);
  }

  confirmDeleteApiKey = (keyId) => {
    const { deleteApiKey } = this.props.actions;
    const { space } = this.props;
    deleteApiKey(space._id, keyId);
  }


  createFormRef = (form) => {
    this.form = form;
  }

  render() {
    const { space } = this.props;
    if (!space) return (<div />);

    const { apiKeys } = space;

    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: (text, record) => <Link to={`/spaces/${space._id}/api/keys/${record._id}`}>{text}</Link>,
      },
      {
        title: 'Action',
        key: 'action',
        render: (text, record) => (
          <span>
            <Popconfirm
              title="Are you sure delete this key?"
              onConfirm={e => this.confirmDeleteApiKey(record._id, e)}
              onCancel={this.cancel}
              okText="Yes"
              cancelText="No"
            >
              <a href="#">Delete</a>
            </Popconfirm>
          </span>
        ),
      },
    ];

    const data = _.map(apiKeys, apiKey => ({ _id: apiKey._id, name: apiKey.name }));

    return (
      <div>
        <div>
          <div style={{ marginBottom: 20 }}>
            <Button type="primary" onClick={this.handleClickAdd}><Icon type="plus" /> Add API Key</Button>
          </div>
        </div>
        <Row>
          <Col>
            <Table columns={columns} dataSource={data} />
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    space: getActiveSpace(state, ownProps),
  };
};

const actions = {
  createApiKey: Actions.createApiKey,
  deleteApiKey: Actions.deleteApiKey,
};

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(actions, dispatch) };
};

export default connect(mapStateToProps, mapDispatchToProps)(ApiKeyList);
