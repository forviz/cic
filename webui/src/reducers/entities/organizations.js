import _ from 'lodash';

import convertArrayToEntities from '../../helpers/convertArrayToEntities';

const initialState = {
  entities: {},
  fetchStatus: {},
  errors: {},
}

const spaces = (state = initialState, action) => {
  switch (action.type) {

    case 'USER/ORGANIZATIONS/RECEIVED': {
      return {
        ...state,
        entities: _.assign({}, state.entities, convertArrayToEntities(action.organizations, '_id')),
      }
    }

    default: return state;
  }
}

export default spaces;
