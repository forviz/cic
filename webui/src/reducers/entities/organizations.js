import _ from 'lodash';

const initialState = {
  entities: {
    'forviz': {
      name: 'Forviz',
      users: []
    },
  },
  fetchStatus: {},
  errors: {},
}

const organizations = (state = initialState, action) => {
  switch (action.type) {
    case 'CREATENEW/ORGANIZATION': {
      return {
        ...state,
        entities: { ...state.entities, 'lego': { name: 'Lego', users: [] }},
      }
    }
    default : return state;
  }
}

export default organizations;