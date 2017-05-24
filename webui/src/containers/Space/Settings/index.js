import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { getActiveSpace } from '../../../selectors';
import { updateSpace } from '../../../actions/spaces';

import { Form, Input, Button, message } from 'antd';

const mapStateToProps = (state, ownProps) => {
  return {
    space: getActiveSpace(state, ownProps),
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({
      updateSpace,
    }, dispatch),
  }
}

class Setting extends Component {

  static propTypes = {

  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }

      const { actions, space } = this.props;
      actions.updateSpace(space._id, {
        name: values.name,
        defaultLocale: 'en',
      });

      message.success('Space updated');
    });
  }

  render() {

    const { form, space } = this.props;
    if (!space) return (<div />);

    const { getFieldDecorator } = form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    };

    return (
      <div>
        <h1>Setting</h1>
        <Form layout="vertical" onSubmit={this.handleSubmit}>
          <Form.Item label="Space ID" {...formItemLayout}>
            {getFieldDecorator('_id', {
              initialValue: space._id,
            })(
              <Input disabled />
            )}
          </Form.Item>
          <Form.Item label="Space Name" {...formItemLayout}>
            {getFieldDecorator('name', {
              initialValue: space.name,
              rules: [{ required: true, message: 'Please input the name of collection!' }],
            })(
              <Input placeholder="Product, Blog, Post, etc..." />
            )}
          </Form.Item>
          <Form.Item label="Locale" {...formItemLayout}>
            {getFieldDecorator('defaultLocale', {
              initialValue: space.defaultLocale,
            })(
              <Input />
            )}
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" size="large">Save</Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Setting));
