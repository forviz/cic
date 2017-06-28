import React, { Component } from 'react';
import { Button, Modal, Form, Input, Checkbox, Icon } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as MyApplicationActions from '../../../../actions/myApplication';

const FormItem = Form.Item;

const CollectionCreateForm = Form.create()(
  (props) => {
    const { visible, onCancel, onCreate, form } = props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        visible={visible}
        title="Create a new application"
        okText="Create"
        onCancel={onCancel}
        onOk={onCreate}
      >
        <Form onSubmit={this.handleSubmit} >
          <FormItem label="Name">
            {getFieldDecorator('name', {
              rules: [{ required: true, message: 'Please input the name of application!' }],
            })(
              <Input />,
            )}
          </FormItem>
          <FormItem label="Description">
            {getFieldDecorator('description', {
              rules: [{ required: false, message: 'Please input the description of application!' }],
            })(
              <Input />,
            )}
          </FormItem>
          <FormItem label="Redirect URI">
            {getFieldDecorator('redirectURL', {
              rules: [{ required: false, message: 'Please input the Redirect URI of application!' }],
            })(
              <Input />,
            )}
          </FormItem>

          <FormItem label="">
            {getFieldDecorator('read', {
              rules: [{ required: false, message: 'Please check the read of application!' }],
              valuePropName: 'checked',
            })(
              <Checkbox >Content management read</Checkbox>,
            )}
          </FormItem>

          <FormItem label="">
            {getFieldDecorator('write', {
              rules: [{ required: false, message: 'Please check the write of application!' }],
              valuePropName: 'checked',
            })(
              <Checkbox >Content management manage</Checkbox>,
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
      const { createApplication } = this.props.actions;
      createApplication(values);

      // form.resetFields();
      form.setFields({
        name: '',
        description: '',
        redirectURL: '',
        read: false,
        write: false,
      });

      this.setState({ visible: false });
    });
  }
  saveFormRef = (form) => {
    this.form = form;
  }

  render() {
    return (
      <div>
        <Button type="primary" onClick={this.showModal}><Icon type="plus" />Add New Application</Button>
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

const mapStateToProps = (state) => {
  console.log('mapStateToProps', state);
  return {
    applications: state.entities.application.entities,
  };
};

const actions = {
  fetchApplication: MyApplicationActions.fetchApplication,
  createApplication: MyApplicationActions.createApplication,
};

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(actions, dispatch) };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalNewApplication);
