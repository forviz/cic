import React, { Component } from 'react';
import T from 'prop-types';
import { Modal, Form, Input, Row, Col } from 'antd';

class CreateNewOrganizationModal extends Component {

  static propTypes = {
    form: T.object.isRequired,
    visible: T.bool.isRequired,
    onSubmit: T.func.isRequired,
    onCancel: T.func.isRequired,
  }

  static defaultProps = {
  }

  render() {
    const { visible, onCancel, onSubmit, form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        visible={visible}
        title="Create an organization"
        okText="Create Organization"
        cancelText="Cancel"
        onCancel={onCancel}
        onOk={onSubmit}
      >
        <Form layout="vertical">
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="Name">
                {getFieldDecorator('name', {
                  rules: [{ required: true, message: 'Please input the name of organization!' }],
                })(<Input placeholder="Client name, project name, etc." />)}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(CreateNewOrganizationModal);
