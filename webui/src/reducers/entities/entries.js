import _ from 'lodash';

import convertArrayToEntities from '../../helpers/convertArrayToEntities';

const initialState = {
  entities: {},
  fetchStatus: {},
  errors: {},
}

const entries = (state = initialState, action) => {
  switch (action.type) {

    case 'ENTITIES/ENTRY/RECEIVED': {
      return {
        ...state,
        entities: _.assign({}, state.entities, {
          [action.item._id]: action.item,
        }),
      }
    }

    default: return state;
  }
}

export default entries;
