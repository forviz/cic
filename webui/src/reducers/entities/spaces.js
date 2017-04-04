import _ from 'lodash';

import convertArrayToEntities from '../../helpers/convertArrayToEntities';

const initialState = {
  entities: {},
  fetchStatus: {},
  errors: {},
}

const spaces = (state = initialState, action) => {
  switch (action.type) {
    case 'USER/SPACES/RECEIVED': {
      // const ids = _.map(action.spaces, space => space._id);
      return {
        ...state,
        entities: _.assign({}, state.entities, convertArrayToEntities(action.spaces, '_id')),
      }
    }

    case 'SPACE/UPDATE/RECEIVED': {
      return {
        ...state,
        entities: _.assign({}, state.entities, {
          [action.spaceId]: action.space,
        }),
      }
    }
    default: return state;
  }
}

export default spaces;
