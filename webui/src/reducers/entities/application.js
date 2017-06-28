import _ from 'lodash';

const initialState = {
  entities: {},
  fetchStatus: {},
  errors: {},
};
const reducers = (state = initialState, action) => {
  switch (action.type) {
    case 'APPLICATION/RECEIVED/SUCCESS': {
      return {
        entities: _.map(action.items, (app) => {
          return {
            name: app.name,
            redirectURL: app.redirectURL,
            description: app.description,
            read: app.read,
            write: app.write,
            _id: app._id,
          };
        }),
      };
    }
    case 'APPLICATION/DELETE': {
      return {
        entities: action.items,
      };
    }
    case 'APPLICATION/CREATE': {
      return {
        entities: action.items,
      };
    }
    default:
      return state;
  }
};

export default reducers;
