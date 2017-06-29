import React, { Component } from 'react';
import { Button, Modal, Form, Input, Checkbox, Icon, notification } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import T from 'prop-types';

import { getApplication, createApplicationSuccess } from '../../../../actions/users';
import { fetchCreateApplication } from '../../../../api/cic/user';

const FormItem = Form.Item;

const CollectionCreateForm = Form.create()(
  (props) => {
    const { visible, onCancel, onCreate, form, checkControl } = props;
    const { getFieldDecorator } = form;
    return (
      <Modal visible={visible} title="Create a new application" okText="Create" onCancel={onCancel} onOk={onCreate}>
        <Form onSubmit={this.handleSubmit} >
          <FormItem label="Name">
            {getFieldDecorator('name', { rules: [{ required: true, message: 'Please input the name of application!' }],
            })(<Input />)}
          </FormItem>
          <FormItem label="Description">
            {getFieldDecorator('description', {
              rules: [{ required: false, message: 'Please input the description of application!' }],
            })(<Input />)}
          </FormItem>
          <FormItem label="Redirect URI">
            {getFieldDecorator('redirectURL', {
              rules: [{ required: false, message: 'Please input the Redirect URI of application!' }],
            })(<Input />)}
          </FormItem>
          <FormItem label="">
            {getFieldDecorator('read', {
              rules: [{ required: false, message: 'Please check the read of application!' }], valuePropName: 'checked',
            })(<Checkbox>Content management read</Checkbox>)}
          </FormItem>
          <FormItem label="">
            {getFieldDecorator('write', {
              rules: [{ required: false, message: 'Please check the write of application!' }], valuePropName: 'checked',
            })(<Checkbox onChange={checkControl}>Content management manage</Checkbox>)}
          </FormItem>
        </Form>
      </Modal>
    );
  },
);

class ModalNewApplication extends Component {

  static propTypes = {
    actions: T.shape({
      createApplication: T.func,
    }).isRequired,
  }

  state = {
    visible: false,
    checkRead: false,
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

      form.resetFields();

      this.setState({ visible: false });
    });
  }
  saveFormRef = (form) => {
    this.form = form;
  }

  handleCheckRead = (e) => {
    const form = this.form;
    form.setFieldsValue({
      read: e.target.checked,
    });
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
          checkControl={this.handleCheckRead}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    applications: state.entities.application.entities,
  };
};

const actions = {
  createApplication: (application) => {
    return (dispatch) => {
      return fetchCreateApplication(application)
      .then((result) => {
        if (result.status === 'ERROR') notification.error({ message: result.status, description: result.message });

        dispatch(createApplicationSuccess(result));
        dispatch(getApplication());
      });
    };
  },

};

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(actions, dispatch) };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalNewApplication);
