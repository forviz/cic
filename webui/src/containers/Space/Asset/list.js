import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as Actions from './actions';
import _ from 'lodash';

import { Button, Table, Icon, Col, Row, message, Popconfirm } from 'antd';
import { getActiveSpace, getSpaceAssets } from '../../../selectors';

const MEDIA_SERVICE_ENDPOINT = 'http://localhost:4000/v1/media/';

class AssetList extends Component {

  static propTypes = {
    space: PropTypes.object,
  }

  componentDidMount = () => {
    if (!this.props.asset) {
      const { space } = this.props;
      const { getAssetInSpace } = this.props.actions;
      getAssetInSpace(space._id);
    }
  }

  handleClickAddAsset = (a) => {
    const { space } = this.props;
    const { createEmptyAsset } = this.props.actions;

    createEmptyAsset(space._id);
  }

  confirmDeleteAsset = (assetId) => {
    const { deleteAsset } = this.props.actions;
    const { space } = this.props;
    deleteAsset(space._id, assetId)
    .then(response => {
      message.success('Deleted Asset');
    });
  }

  cancel = (e) => {
    console.log(e);
  }

  render() {
    const { space, assets } = this.props;
    if (!space) return (<div />);

    const columns = [
      {
        title: 'Preview',
        dataIndex: 'file',
        key: 'file',
        render: (file, record) => {
          switch (file.contentType) {
            case 'image/png':
            case 'image/jpg':
            case 'image/jpeg':
              return (<img src={`${MEDIA_SERVICE_ENDPOINT}w_80,h_80,c_fill/${file.publicId}`} alt={_.get(record, 'fields.title')}/>);
            default: return <div />;
          }
        },
      },
      {
        title: 'Title',
        dataIndex: 'title',
        key: 'title',
        render: (text, record) => <Link to={`/spaces/${space._id}/assets/${record._id}`}>{text || 'No title'}</Link>,
      },
      {
        title: 'Type',
        dataIndex: 'contentType',
        key: 'contentType',
      },
      {
        title: 'Updated',
        dataIndex: 'updated',
        key: 'updated',
        render: (text) => moment(text).fromNow(),
      },
      {
        title: 'Author',
        dataIndex: 'author',
        key: 'author',
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
      },
      {
        title: 'Action',
        key: 'action',
        render: (text, record) => (
          <span>
            <Popconfirm
              title="Are you sure delete this asset?"
              onConfirm={e => this.confirmDeleteAsset(record._id)}
              onCancel={this.cancel}
              okText="Yes"
              cancelText="No"
            >
              <a href="#">Delete</a>
            </Popconfirm>
          </span>
        ),
      }
    ];

    const data = _.map(assets, (asset, i) => {
      return {
        _id: asset._id,
        file: _.get(asset, 'fields.file', {}),
        key: i,
        title: _.get(asset, 'fields.title', 'No title'),
        contentType: _.get(asset, 'fields.file.contentType'),
        updated: asset.updatedAt,
        by: '',
        status: asset.status,
      }
    });

    return (
      <div>
        <div>
          <div style={{ marginBottom: 20 }}>
            <Button type="primary" onClick={this.handleClickAddAsset}>
              <Icon type="plus" /> Add Asset
            </Button>
          </div>
        </div>
        <Row>
          <Col>
            <Table columns={columns} dataSource={data} />
          </Col>
        </Row>
      </div>
    );
  }
}
const mapStateToProps = (state, ownProps) => {
  return {
    space: getActiveSpace(state, ownProps),
    assets: getSpaceAssets(state, ownProps),
  }
}

const actions = {
  getAssetInSpace: Actions.getAssetInSpace,
  createEmptyAsset: Actions.createEmptyAsset,
  deleteAsset: Actions.deleteAsset,
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(AssetList);
