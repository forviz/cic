import _ from 'lodash';

const initialState = {
  entities: {},
  fetchStatus: {},
  errors: {},
};

const spaces = (state = initialState, action) => {
  switch (action.type) {

    case 'ENTITIES/SPACE/RECEIVED': {
      const spaceId = action.spaceId;
      return {
        ...state,
        entities: _.assign({}, state.entities, {
          [spaceId]: { ...state.entities[spaceId], ...action.space },
        }),
        fetchStatus: {
          ...state.fetchStatus,
          [spaceId]: 'loaded',
        },
      };
    }

    default: return state;
  }
};

export default spaces;
