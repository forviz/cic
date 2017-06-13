import _ from 'lodash';
import convertArrayToEntities from '../../helpers/convertArrayToEntities';

const initialState = {
  entities: {
    'forviz': {
      name: 'Forviz',
      users: []
    },
  },
  fetchStatus: {},
  errors: {},
};

const organizations = (state = initialState, action) => {
  switch (action.type) {

    case 'USER/ORGANIZATIONS/RECEIVED': {
      return {
        ...state,
        entities: _.assign({}, state.entities, convertArrayToEntities(action.organizations, '_id')),
      };
    }

    case 'CREATENEW/ORGANIZATION': {
      return {
        ...state,
        entities: { ...state.entities, 'lego': { name: 'Lego', users: [] }},
      }
    }

    default: return state;
  }
};

export default organizations;
