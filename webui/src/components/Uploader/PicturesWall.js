import React, { Component } from 'react';
import T from 'prop-types';
import _ from 'lodash';
import { Upload, Icon, Modal, message } from 'antd';

const parseFileInfo = file => ({
  uid: file.uid,
  publicId: file.publicId,
  name: file.fileName,
  status: 'done',
  url: file.url,
});

const mapFilelistToData = file => ({
  uid: _.get(file, 'uid'),
  publicId: _.get(file, 'response.public_id'),
  fileName: _.get(file, 'name'),
  contentType: _.get(file, 'type'),
  url: _.get(file, 'response.url'),
  details: {
    image: {
      width: _.get(file, 'response.width'),
      height: _.get(file, 'response.height'),
    },
    size: _.get(file, 'size'),
  },
});

class PicturesWall extends Component {

  static propTypes = {
    multiple: T.bool,
    action: T.string,
    file: T.object,
    fileList: T.array,
    onChange: T.func,
  }

  static defaultProps = {
    multiple: false,
    file: {
      uid: 'thisIsDefault',
    },
    fileList: [],
    action: process.env.REACT_APP_MEDIA_ENDPOINT,
    onChange: undefined,
  }

  constructor(props) {
    super(props);
    const fileList = _.compact(props.fileList || [props.file]);

    this.state = {
      previewVisible: false,
      previewImage: '',
      fileList: fileList ? _.map(fileList, file => parseFileInfo(file)) : [],
    };
  }

  componentWillReceiveProps = (nextProps) => {
    const fileList = _.compact(nextProps.fileList || [nextProps.file]);
    if (fileList) {
      const fileListState = _.map(fileList, file => parseFileInfo(file));
      this.setState({
        fileList: fileListState,
      });
    }
  }

  handleCancel = () => this.setState({ previewVisible: false })

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }

  handleChange = (event) => {
    const status = event.file.status;
    if (status !== 'uploading') {
      console.log(event.file, event.fileList);
    }
    if (status === 'done') {
      message.success(`${event.file.name} file uploaded successfully.`);
      this.props.onChange(_.map(event.fileList, file => mapFilelistToData(file)), 'success');
    } else if (status === 'error') {
      message.error(`${event.file.name} file upload failed.`);
    }

    this.setState({ fileList: event.fileList });
  }

  render() {
    const { multiple, action } = this.props;
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div key="upload-button">
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div className="clearfix">
        <Upload
          multiple={multiple}
          action={action}
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {multiple || (!multiple && fileList.length === 0) ? uploadButton : null}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}

export default PicturesWall;
