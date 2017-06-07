/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { message } from 'antd';

import * as Actions from './actions';
import AssetEditorForm from '../../../components/AssetEditorForm';
import { getActiveSpace, getActiveAsset, getAssetId } from '../../../selectors';

class AssetSingle extends Component {

  static propTypes = {

  }

  componentDidMount = () => {
    if (!this.props.asset) {
      const { space } = this.props;
      const { getSingleAsset } = this.props.actions;
      getSingleAsset(space._id, this.props.assetId);
    }
  }

  handleSubmitForm = (values) => {
    // Use AssetId from url param, because entities asset with the ID is not created.
    const { space, assetId } = this.props;
    const spaceId = space._id;

    console.log('handleSubmitForm', spaceId, assetId, values);

    const { updateAsset } = this.props.actions;
    updateAsset(spaceId, assetId, values)
    .then(res => {
      message.info('Asset saved');
    })

    return false;
  }

  render() {
    const { asset } = this.props;
    return (
      <div>
        <AssetEditorForm asset={asset} onSubmit={this.handleSubmitForm} />
      </div>

    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const space = getActiveSpace(state, ownProps);
  const asset = getActiveAsset(state, ownProps);
  return {
    space: space,
    asset: asset,
    assetId: getAssetId(ownProps),
  }
}

const actions = {
  getSingleAsset: Actions.getSingleAsset,
  updateAsset: Actions.updateAsset,
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(AssetSingle);
