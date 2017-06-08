import React, { Component } from 'react';
import T from 'prop-types';
import _ from 'lodash';

import { Modal, Form, Input } from 'antd';

class ContentTypeCreateForm extends Component {

  static propTypes = {
    form: T.object.isRequired,
    visible: T.bool.isRequired,
    onCreate: T.func.isRequired,
    onCancel: T.func.isRequired,
  }

  static defaultProps = {
  }

  handleInputNameChange = (value) => {
    this.props.form.setFieldsValue({
      identifier: _.kebabCase(value),
    });
  }

  render() {
    const { visible, onCancel, onCreate, form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        visible={visible}
        title="Create a new collection"
        okText="Create"
        cancelText="Cancel"
        onCancel={onCancel}
        onOk={onCreate}
      >
        <Form layout="vertical">
          <Form.Item label="Name">
            {getFieldDecorator('name', {
              rules: [{ required: true, message: 'Please input the name of collection!' }],
              onChange: e => this.handleInputNameChange(e.target.value),
            })(<Input placeholder="Product, Blog, Post, etc..." />)}
          </Form.Item>
          <Form.Item label="API Identifier">
            {getFieldDecorator('identifier', {
              rules: [{ required: true, message: 'required' }],
            })(<Input />)}
          </Form.Item>
          <Form.Item label="Description">
            {getFieldDecorator('description', {
              rules: [],
            })(<Input type="textarea" rows={4} />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(ContentTypeCreateForm);
