import React, { Component } from 'react';
import T from 'prop-types';
import _ from 'lodash';

import { Form, Input, Button } from 'antd';

import PicturesWall from '../Uploader/PicturesWall';

const hasErrors = fieldsError => Object.keys(fieldsError).some(field => fieldsError[field]);

class AssetEditorForm extends Component {

  static propTypes = {
    form: T.object.isRequired,
    onSubmit: T.func.isRequired,
  }

  static defaultProps = {
  }

  componentDidMount() {
    // To disabled submit button at the beginning.
    this.props.form.validateFields();
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Form values', values);
        const { onSubmit } = this.props;
        onSubmit(values);
      }
    });
  }

  render() {
    const { getFieldDecorator, getFieldsError } = this.props.form;

    return (
      <Form layout="horizontal" onSubmit={this.handleSubmit}>
        <Form.Item label="Title">
          {getFieldDecorator('title', {
            rules: [{ required: true, message: 'Required' }],
          })(<Input />)}
        </Form.Item>
        <Form.Item label="Description">
          {getFieldDecorator('description', {
          })(<Input />)}
        </Form.Item>
        <Form.Item label="File">
          {getFieldDecorator('file', {
            valuePropName: 'file',
          })(<PicturesWall multiple={false} />)}
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            disabled={hasErrors(getFieldsError())}
          >
            Save
          </Button>
        </Form.Item>
      </Form>
    );
  }
}


const mapPropsToFields = (props) => {
  const asset = _.get(props, 'asset');
  return {
    title: {
      value: _.get(asset, 'fields.title'),
    },
    description: {
      value: _.get(asset, 'fields.description'),
    },
    file: {
      value: _.get(asset, 'fields.file'),
    },
  };
};

export default Form.create({
  mapPropsToFields,
})(AssetEditorForm);
