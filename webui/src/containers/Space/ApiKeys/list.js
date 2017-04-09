import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router-dom';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as Actions from './actions';
import _ from 'lodash';

import { Button, Row, Col, Icon, Table, Popconfirm, message } from 'antd';

import { getActiveSpace } from '../../../selectors';

class ContentTypeList extends Component {

  static propTypes = {
    space: PropTypes.object,
  }

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
    deleteApiKey(space._id, keyId)
    .then(response => {
      message.success('ApiKey deleted');
    });
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
              onConfirm={e => this.confirmDeleteApiKey(record._id)}
              onCancel={this.cancel}
              okText="Yes"
              cancelText="No"
            >
              <a href="#">Delete</a>
            </Popconfirm>
          </span>
        ),
      }
    ];

    const data = _.map(apiKeys, (apiKey, i) => ({
      _id: apiKey._id,
      name: apiKey.name,
    }));


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

ContentTypeList.propTypes = {
  items: PropTypes.array,
};

const mapStateToProps = (state, ownProps) => {
  return {
    space: getActiveSpace(state, ownProps),
  }
}

const actions = {
  createApiKey: Actions.createApiKey,
  deleteApiKey: Actions.deleteApiKey,
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(ContentTypeList);
