import _ from 'lodash';

const initialState = {
  entities: {},
  fetchStatus: {},
  errors: {},
};

const entries = (state = initialState, action) => {
  switch (action.type) {

    case 'ENTITIES/ENTRY/RECEIVED': {
      const entryId = action.item._id;
      return {
        ...state,
        entities: _.assign({}, state.entities, {
          [entryId]: { ...state.entities[entryId], ...action.item },
        }),
        fetchStatus: {
          ...state.fetchStatus,
          [entryId]: 'loaded',
        },
      };
    }

    default: return state;
  }
};

export default entries;
