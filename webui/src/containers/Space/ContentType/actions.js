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
      fields: [...contentType.fields, {
        name: values.name,
        fieldType: _.head(values.fieldType),
        identifier: values.identifier,
        required: _.get(values, 'required', false),
        localized: false,
        validations: {
          linkContentType: [], // ["post", "doc", "product"],
          in: [], // ["General", "iOS", "Android"],
          linkMimetypeGroup: undefined, // "image",
          // size: {
          //   "min": 0,
          //   "max": 0,
          // },
          range: {
            "min": _.get(values, 'validation-limit-min', 0),
            "max": _.get(values, 'validation-limit-max', 0),
          },
          // regexp: {"pattern": "^such", "flags": "im"},
          // unique: true,
        },
      }]
    })

    return fetchUpdateContentType(spaceId, contentTypeId, _contentTypeToUpdate)
    .then((createResponse) => {
      dispatch(getSpace(spaceId));
    });
  }
}

export const updateField = (spaceId, contentTypeId, contentType, values) => {
  return (dispatch) => {

    const fieldId = values._id;
    debugger;
    const _contentTypeToUpdate = _.assign({}, contentType, {
      fields: _.map(contentType.fields, field => {
        if (field._id === fieldId) {
          return {
            name: values.name,
            fieldType: _.head(values.fieldType),
            identifier: values.identifier,
            required: _.get(values, 'required', false),
            localized: false,
            validations: {
              linkContentType: [], // ["post", "doc", "product"],
              in: [], // ["General", "iOS", "Android"],
              linkMimetypeGroup: undefined, // "image",
              // size: {
              //   "min": 0,
              //   "max": 0,
              // },
              range: {
                "min": _.get(values, 'validation-limit-min', 0),
                "max": _.get(values, 'validation-limit-max', 0),
              },
              // regexp: {"pattern": "^such", "flags": "im"},
              // unique: true,
            }
          };
        }
        return field;
      })
    });

    debugger;

    return fetchUpdateContentType(spaceId, contentTypeId, _contentTypeToUpdate)
    .then((createResponse) => {
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
