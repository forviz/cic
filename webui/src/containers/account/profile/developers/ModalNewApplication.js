import React, { Component } from 'react';
import { Button, Modal, Form, Input, Checkbox, Icon } from 'antd';
const FormItem = Form.Item;

const CollectionCreateForm = Form.create()(
  (props) => {
    const { visible, onCancel, onCreate, form } = props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        visible={visible}
        title="Create a new collection"
        okText="Create"
        onCancel={onCancel}
        onOk={onCreate}
      >
        <Form onSubmit={this.handleSubmit} >
          <FormItem label="Name">
            {getFieldDecorator('name', {
              rules: [{ required: true, message: 'Please input the name of collection!' }],
            })(
              <Input />,
            )}
          </FormItem>
          <FormItem label="Description">
            {getFieldDecorator('description', {
              rules: [{ required: false, message: 'Please input the description of collection!' }],
            })(
              <Input />,
            )}
          </FormItem>
          <FormItem label="Redirect URI">
            {getFieldDecorator('redirectURL', {
              rules: [{ required: false, message: 'Please input the Redirect URI of collection!' }],
            })(
              <Input />,
            )}
          </FormItem>

          <FormItem label="">
            {getFieldDecorator('read', {
              rules: [{ required: false, message: 'Please check the read of collection!' }],
            })(
              <Checkbox>Content management read</Checkbox>,
            )}
          </FormItem>

          <FormItem label="">
            {getFieldDecorator('write', {
              rules: [{ required: false, message: 'Please check the write of collection!' }],
            })(
              <Checkbox>Content management manage</Checkbox>,
            )}
          </FormItem>

        </Form>
      </Modal>
    );
  },
);

class ModalNewApplication extends Component {
  state = {
    visible: false,
  };

  showModal = () => {
    this.setState({ visible: true });
  }
  handleCancel = () => {
    this.setState({ visible: false });
  }
  handleCreate = () => {
    const form = this.form;

    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      fetch('http://localhost:4000/v1/application', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: values.name,
          description: values.description,
          redirectURL: values.redirectURL,
          read: (values.read !== undefined),
          write: (values.read !== undefined),
        }),
      })
      .then(response => response.json())
      .then((response) => {
        console.log('your response here', response);
        this.props.onUpdate();
      }).catch((e) => {
        console.log('error', e);
      });

      form.resetFields();
      this.setState({ visible: false });
    });
  }
  saveFormRef = (form) => {
    this.form = form;
  }

  render() {
    return (
      <div>
        <Button type="primary" onClick={this.showModal}><Icon type="plus" /> Add New Collection</Button>
        <CollectionCreateForm
          ref={this.saveFormRef}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
        />
      </div>
    );
  }
}

export default ModalNewApplication;
