import React, { Component } from 'react';
import T from 'prop-types';
import { Modal, Form, Input, Radio } from 'antd';

const RadioGroup = Radio.Group;

class InviteUserToOrganizationModal extends Component {
  static propTypes = {
    form: T.object.isRequired,
    visible: T.bool.isRequired,
    onSubmit: T.func.isRequired,
    onCancel: T.func.isRequired,
  }

  render() {
    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    };

    const { visible, onCancel, onSubmit, form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        visible={visible}
        title="Invite User to organization"
        okText="Send Invitation"
        cancelText="Cancel"
        onCancel={onCancel}
        onOk={onSubmit}
      >
        <Form layout="vertical">
          <h3>General Information</h3>
          <Form.Item label="Email Address">
            {getFieldDecorator('email', {
              rules: [{ required: true, message: 'Please input email' }],
            })(<Input />)}
          </Form.Item>
          <Form.Item label="Organization role">
            {getFieldDecorator('role', {
            })(
              <RadioGroup>
                <Radio style={radioStyle} value="owner">Owner</Radio>
                <Radio style={radioStyle} value="admin">Admin</Radio>
                <Radio style={radioStyle} value="member">Member</Radio>
              </RadioGroup>
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(InviteUserToOrganizationModal);
