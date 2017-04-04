import _ from 'lodash';
// import { createSelector } from 'reselect';

export const getUser = (state) => {
  return state.session.user;
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

export const getApiKeyId = (props) => {
  return props.match.params.keyId;
}

export const getActiveSpace = (state, props) => {
  const spaceId = getSpaceId(props);
  return _.get(state.entities.spaces, `entities.${spaceId}`);
}

export const getActiveContentType = (state, props) => {
  const contentTypeId = getContentTypeId(props);
  const space = getActiveSpace(state, props);
  return _.find(_.get(space, 'contentTypes'), ct => ct._id === contentTypeId);
}

export const getActiveApiKey= (state, props) => {
  const keyId = getApiKeyId(props);
  const space = getActiveSpace(state, props);
  
  return _.find(_.get(space, 'apiKeys'), k => k._id === keyId);
}
