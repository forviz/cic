import React, { Component } from 'react';
import _ from 'lodash';

import { Form, Input, Button } from 'antd';

// import Uploader from '../Uploader';
import PicturesWall from '../Uploader/PicturesWall';

import mapImageInfoToFile from '../../helpers/mapImageInfoToFile';

const hasErrors = (fieldsError) => {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class AssetEditorForm extends Component {

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
          })(
            <Input />
          )}
        </Form.Item>
        <Form.Item label="Description">
          {getFieldDecorator('description', {
          })(
            <Input />
          )}
        </Form.Item>
        <Form.Item label="File">
          {getFieldDecorator('file', {
            valuePropName: 'file',
            getValueFromEvent: mapImageInfoToFile
          })(
            <PicturesWall multiple={false} />
          )}
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

/*<Upload.Dragger name="files" action="http://localhost:4000/v1/media/upload">
  <p className="ant-upload-drag-icon">
    <Icon type="inbox" />
  </p>
  <p className="ant-upload-text">Click or drag file to this area to upload</p>
  <p className="ant-upload-hint">Support for a single or bulk upload. Strictly prohibit from uploading company data or other band files</p>
</Upload.Dragger> */

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
  }
}

export default Form.create({
  mapPropsToFields
})(AssetEditorForm);
