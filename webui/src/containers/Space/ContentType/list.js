import React, { Component } from 'react';
import T from 'prop-types';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { Popconfirm, Button, Table, Icon, Col, Row, Dropdown, Menu } from 'antd';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as Actions from './actions';

import { getActiveSpace } from '../../../selectors';
import ContentTypeCreateForm from '../../../components/ContentTypeCreateForm';

const API_PATH = process.env.REACT_APP_API_PATH;

class ContentTypeList extends Component {

  static propTypes = {
    space: T.shape({
      _id: T.string,
    }).isRequired,
    actions: T.shape({
      deleteContentType: T.func,
      createContentType: T.func,
    }).isRequired,
  }

  static defaultProps = {
    space: {
      _id: '',
    },
  }

  displayName = 'ContentTypeList';

  state = {
    modalVisible: false,
  }

  confirmDeleteContentType = (typeId) => {
    const { deleteContentType } = this.props.actions;
    const { space } = this.props;
    deleteContentType(space._id, typeId);
  }

  cancel = (e) => {
    console.log(e);
  }

  handleSelectAddContentType = () => {
    this.setState({
      modalVisible: true,
    });
  }

  handleSubmitContentTypeCreate = () => {
    const form = this.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      const { createContentType } = this.props.actions;
      const { space } = this.props;
      createContentType(space._id, values)
      .then(() => {
        form.resetFields();
        this.setState({ modalVisible: false });
      });
    });
  }

  handleCancel = () => {
    this.setState({
      modalVisible: false,
    });
  }

  createFormRef = (form) => {
    this.form = form;
  }

  render() {
    const { space } = this.props;
    if (!space) return (<div />);

    const { contentTypes } = space;
    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: (text, record) => <Link to={`/spaces/${space._id}/content_types/${record._id}`}>{text}</Link>,
      },
      {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
      },
      {
        title: 'Fields',
        dataIndex: 'fields',
        key: 'fields',
      },
      {
        title: 'Updated',
        dataIndex: 'updated',
        key: 'updated',
      },
      {
        title: 'By',
        dataIndex: 'by',
        key: 'by',
      },
      {
        title: 'Action',
        key: 'action',
        render: (text, record) => (
          <span>
            <Popconfirm
              title="Are you sure delete this content Type?"
              onConfirm={e => this.confirmDeleteContentType(record._id, e)}
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

    const data = _.map(contentTypes, (type, i) => ({
      _id: type._id,
      key: i,
      name: type.name,
      description: '',
      fields: _.size(type.fields),
      updated: '',
      by: '',
      status: '',
    }));

    const deliveryKey = _.get(space, 'apiKeys.0.deliveryKey');
    const actionMenus = (
      <Menu>
        <Menu.Item key="export">
          <a
            href={`${API_PATH}/spaces/${space._id}/content_types?access_token=${deliveryKey}`}
            target="_blank"
            rel="noopener noreferrer"
          >Preview JSON</a>
        </Menu.Item>
      </Menu>
    );

    return (
      <div>
        <Row>
          <Col span={12} style={{ marginBottom: 20 }}>
            <Button type="primary" onClick={this.handleSelectAddContentType}><Icon type="plus" /> Add Content Type</Button>
          </Col>
          <Col span={12} style={{ textAlign: 'right' }}>
            <Dropdown overlay={actionMenus}>
              <Button className="ant-dropdown-link">
                Actions <Icon type="down" />
              </Button>
            </Dropdown>
          </Col>
        </Row>
        <Row><Col><Table columns={columns} dataSource={data} /></Col></Row>
        <ContentTypeCreateForm
          ref={this.createFormRef}
          visible={this.state.modalVisible}
          onCancel={this.handleCancel}
          onCreate={this.handleSubmitContentTypeCreate}
        />

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
  createContentType: Actions.createContentType,
  deleteContentType: Actions.deleteContentType,
};

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(actions, dispatch) };
};

export default connect(mapStateToProps, mapDispatchToProps)(ContentTypeList);
