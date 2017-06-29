import React, { Component } from 'react';
import T from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Form, Input, Button, Popconfirm } from 'antd';

import SubHeader from '../../../components/SubHeader';
import { getActiveSpace, getSpaceId } from '../../../selectors';
import * as SpaceActions from '../../../actions/spaces';

const mapStateToProps = (state, ownProps) => {
  return {
    spaceId: getSpaceId(ownProps),
    space: getActiveSpace(state, ownProps),
  };
};

const actions = {
  updateSpace: SpaceActions.updateSpace,
  deleteSpace: SpaceActions.deleteSpace,
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
};

class Setting extends Component {

  static propTypes = {
    form: T.shape({
      validateFieldsAndScroll: T.func,
    }).isRequired,
    actions: T.shape({
      updateSpace: T.func,
      deleteSpace: T.func,
    }).isRequired,
    space: T.shape({
      _id: T.string,
      name: T.string,
    }),
  }

  static defaultProps = {
    space: {},
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

  confirmDeleteSpace = () => {
    const { spaceId, history } = this.props;
    const { deleteSpace } = this.props.actions;
    deleteSpace(spaceId, history);
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
        <SubHeader title="Setting" />
        <Form layout="vertical" onSubmit={this.handleSubmit}>
          <Form.Item label="Space ID" {...formItemLayout}>
            {getFieldDecorator('_id', {
              initialValue: space._id,
            })(<Input disabled />)}
          </Form.Item>
          <Form.Item label="Space Name" {...formItemLayout}>
            {getFieldDecorator('name', {
              initialValue: space.name,
              rules: [{ required: true, message: 'Please input the name of collection!' }],
            })(<Input placeholder="Product, Blog, Post, etc..." />)}
          </Form.Item>
          <Form.Item label="Locale" {...formItemLayout}>
            {getFieldDecorator('defaultLocale', {
              initialValue: space.defaultLocale,
            })(<Input />)}
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" size="large">Save</Button>
          </Form.Item>
        </Form>

        <SubHeader title="Danger" />
        <div>
          <Popconfirm
            title="Are you sure delete this space and all its content?"
            onConfirm={this.confirmDeleteSpace}
            okText="Yes, delete this space"
            cancelText="Cancel"
          >
            <Button type="danger">Remove Space and all its content</Button>
          </Popconfirm>
        </div>
      </div>

    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Setting));
