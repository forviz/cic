import _ from 'lodash';

const initialState = {
  entities: {},
  fetchStatus: {},
  errors: {},
};

const entries = (state = initialState, action) => {
  switch (action.type) {

    case 'ENTITIES/ASSET/RECEIVED': {
      return {
        ...state,
        entities: _.assign({}, state.entities, {
          [action.item._id]: action.item,
        }),
      };
    }

    default: return state;
  }
};

export default entries;
