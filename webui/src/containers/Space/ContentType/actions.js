import _ from 'lodash';
import { fetchCreateContentType, fetchUpdateContentType, fetchDeleteContentType } from '../../../api/cic/contentTypes';
import { getSpace } from '../../../actions/spaces';

export const createContentType = (spaceId, values) => {
  return (dispatch) => {
    return fetchCreateContentType(spaceId, values)
    .then((createResponse) => {
      dispatch(getSpace(spaceId));
    });
  }
}

export const deleteContentType = (spaceId, contentTypeId) => {
  return (dispatch) => {
    return fetchDeleteContentType(spaceId, contentTypeId)
    .then((updateResponse) => {
      dispatch(getSpace(spaceId));
    });
  };
};

export const addField = (spaceId, contentTypeId, contentType, values) => {
  return (dispatch) => {

    const _contentTypeToUpdate = _.assign({}, contentType, {
      displayField: (values.isDisplayField === true) ? values.identifier : contentType.displayField,
      fields: [...contentType.fields, {
        name: values.name,
        type: values.type,
        identifier: values.identifier,
        required: _.get(values, 'required', false),
        localized: _.get(values, 'localized', false),
        validations: _.get(values, 'validations'),
      }]
    });

    return fetchUpdateContentType(spaceId, contentTypeId, _contentTypeToUpdate)
    .then((createResponse) => {
      console.log('createResponse', createResponse);
      dispatch(getSpace(spaceId));
    });
  }
}

export const updateField = (spaceId, contentTypeId, contentType, values) => {
  return (dispatch) => {

    const fieldId = values._id;

    const _contentTypeToUpdate = _.assign({}, contentType, {
      displayField: (values.isDisplayField === true) ? values.identifier : contentType.displayField,
      fields: _.map(contentType.fields, field => {
        if (field._id === fieldId) {
          return {
            name: values.name,
            type: values.type,
            identifier: values.identifier,
            required: _.get(values, 'required', false),
            localized: _.get(values, 'localized', false),
            validations: _.get(values, 'validations'),
          };
        }
        return field;
      })
    });

    console.log('_contentTypeToUpdate', _contentTypeToUpdate);
    return fetchUpdateContentType(spaceId, contentTypeId, _contentTypeToUpdate)
    .then((res) => {
      console.log('updateFieldResponse', res);
      dispatch(getSpace(spaceId));
    });
  }
}


export const deleteField = (spaceId, contentTypeId, contentType, fieldId) => {
  return (dispatch) => {

    const _contentTypeToUpdate = _.assign({}, contentType, {
      fields: _.filter(contentType.fields, field => field._id !== fieldId)
    });

    return fetchUpdateContentType(spaceId, contentTypeId, _contentTypeToUpdate)
    .then((deleteResponse) => {
      dispatch(getSpace(spaceId));
    });

  }
}
