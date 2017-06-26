import React, { Component } from 'react';
import T from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Form, Input, Button } from 'antd';
import { getOrganizationEntity } from '../../../../selectors/organizations';

const mapStateToProps = (state, ownProps) => {
  return {
    organization: getOrganizationEntity(state, ownProps.match.params.organizationId),
  };
};

const mapActions = {};

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(mapActions, dispatch) };
};

class OrganizationSetting extends Component {

  static propTypes = {
    form: T.shape({
      validateFieldsAndScroll: T.func,
    }).isRequired,
    actions: T.shape({
      updateSpace: T.func,
    }).isRequired,
    space: T.shape({
      _id: T.string,
      name: T.string,
    }),
    organization: T.shape({
      _id: T.string,
      name: T.string,
    }),
  }

  static defaultProps = {
    organization: {},
    space: {
      _id: '',
      name: '',
    },
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
    });
  }

  render() {
    const { form, organization } = this.props;
    if (!organization) return (<div />);

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
        <Form layout="vertical" onSubmit={this.handleSubmit}>
          <Form.Item label="Organization ID" {...formItemLayout}>
            {getFieldDecorator('_id', {
              initialValue: organization._id,
            })(<Input disabled />)}
          </Form.Item>
          <Form.Item label="Organization Name" {...formItemLayout}>
            {getFieldDecorator('name', {
              initialValue: organization.name,
              rules: [{ required: true, message: 'Please input the name of collection!' }],
            })(<Input placeholder="Product, Blog, Post, etc..." />)}
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" size="large">Save</Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(OrganizationSetting));
