import _ from 'lodash';
// import { createSelector } from 'reselect';

export const getUser = (state) => {
  return state.session.user;
}

export const getIsAuthenticated = (state) => {
  return state.session.user.isAuthenticated;
}

export const getUserSpaces = (state) => {
  const spaceIds = _.get(getUser(state), 'spaces');
  return _.map(spaceIds, id => _.get(state, `entities.spaces.entities.${id}`));
}

export const getSpaceId = (props) => {
  return _.get(props, 'match.params.spaceId');
}

export const getContentTypeId = (props) => {
  return props.match.params.contentTypeId;
}

export const getEntryId = (props) => {
  return props.match.params.entryId;
}

export const getAssetId = (props) => {
  return props.match.params.assetId;
}

export const getActiveAsset = (state, props) => {
  const assetId = getAssetId(props);
  return _.get(state.entities.assets, `entities.${assetId}`);
}

export const getApiKeyId = (props) => {
  return props.match.params.keyId;
}

export const getActiveSpaceFromId = (state, spaceId) => {
  return _.get(state.entities.spaces, `entities.${spaceId}`);
}

export const getActiveSpace = (state, props) => {
  const spaceId = getSpaceId(props);
  return getActiveSpaceFromId(state, spaceId);
}


export const getActiveContentType = (state, props) => {
  const contentTypeId = getContentTypeId(props);
  const space = getActiveSpace(state, props);
  return _.find(_.get(space, 'contentTypes'), ct => ct._id === contentTypeId);
}

export const getActiveEntry = (state, props) => {
  const entryId = getEntryId(props);
  return _.get(state.entities.entries, `entities.${entryId}`);
}


export const getActiveApiKey= (state, props) => {
  const keyId = getApiKeyId(props);
  const space = getActiveSpace(state, props);

  return _.find(_.get(space, 'apiKeys'), k => k._id === keyId);
}

export const getSpaceEntriesFromSpaceId = (state, spaceId) => {
  return _.filter(_.get(state, 'entities.entries.entities'), entry => entry._spaceId === spaceId);
}

export const getSpaceEntries = (state, ownProps) => {
  const space = getActiveSpace(state, ownProps);
  return getSpaceEntriesFromSpaceId(state, space._id);
}

export const getSpaceAssets = (state, ownProps) => {
  const space = getActiveSpace(state, ownProps);
  return _.filter(_.get(state, 'entities.assets.entities', []), asset => asset._spaceId === space._id);
}

export const getEntryVisibleList = (state, ownProps) => {
  const visibleList = _.get(state, 'domain.entryList.visibleList');
  const space = getActiveSpace(state, ownProps);
  return _.filter(_.get(state, 'entities.entries.entities'), (entry, key) => entry._spaceId === space._id && visibleList.indexOf(key) != -1);
}