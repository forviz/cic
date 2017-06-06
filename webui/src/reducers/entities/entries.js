import _ from 'lodash';

const initialState = {
  entities: {},
  fetchStatus: {},
  errors: {},
};

const entries = (state = initialState, action) => {
  switch (action.type) {

    case 'ENTITIES/ENTRY/RECEIVED': {
      return {
        ...state,
        entities: _.assign({}, state.entities, {
          [action.item._id]: action.item,
        }),
        fetchStatus: {
          ...state.fetchStatus,
          [action.item._id]: 'loaded',
        },
      };
    }

    default: return state;
  }
};

export default entries;
