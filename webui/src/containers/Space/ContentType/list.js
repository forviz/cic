import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router-dom';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as Actions from './actions';
import _ from 'lodash';

import { Popconfirm, message, Button, Table, Icon, Col, Row } from 'antd';

import { getActiveSpace } from '../../../selectors';

import ContentTypeCreateForm from '../../../components/ContentTypeCreateForm';

class ContentTypeList extends Component {

  static propTypes = {
    space: PropTypes.object,
  }

  displayName = 'ContentTypeList';

  state = {
    modalVisible: false,
  }

  confirmDeleteContentType = (typeId) => {
    const { deleteContentType } = this.props.actions;
    const { space } = this.props;
    deleteContentType(space._id, typeId)
    .then(response => {
      message.success('ContentType deleted');

    });
  }

  cancel = (e) => {
    console.log(e);
    message.error('Click on No');
  }

  handleSelectAddContentType = () => {
    // const { space } = this.props;
    // const { createContentType } = this.props.actions;
    // createContentType(space._id);

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

      console.log('Received values of form: ', values);

      const { createContentType } = this.props.actions;
      const { space } = this.props;
      createContentType(space._id, values)
      .then(response => {
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
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
      },
      {
        title: 'Action',
        key: 'action',
        render: (text, record) => (
          <span>
            <Popconfirm
              title="Are you sure delete this content Type?"
              onConfirm={e => this.confirmDeleteContentType(record._id)}
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

    return (
      <div>
        <div>
          <div style={{ marginBottom: 20 }}>
            <Button type="primary" onClick={this.handleSelectAddContentType}><Icon type="plus" /> Add Content Type</Button>
          </div>
        </div>
        <Row>
          <Col>
            <Table columns={columns} dataSource={data} />
          </Col>
        </Row>

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

ContentTypeList.propTypes = {
  items: PropTypes.array,
};

const mapStateToProps = (state, ownProps) => {
  return {
    space: getActiveSpace(state, ownProps),
  }
}

const actions = {
  createContentType: Actions.createContentType,
  deleteContentType: Actions.deleteContentType,
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(ContentTypeList);
