const initialState = {
  entities: {},
  fetchStatus: {},
  errors: {},
};

const organizations = (state = initialState, action) => {
  switch (action.type) {
    case 'ENTITIES/ORGANIZATION/RECEIVED': {
      const orgId = action.organizationId;
      return {
        ...state,
        entities: {
          ...state.entities,
          [orgId]: { ...state.entities[orgId], ...action.organization },
        },
      };
    }
    case 'ENTITIES/ORGANIZATION/MEMBERS/RECEIVED': {
      const orgId = action.organizationId;
      return {
        ...state,
        entities: {
          ...state.entities,
          [orgId]: { ...state.entities[orgId], members: action.members },
        },
      };
    }

    default: return state;
  }
};

export default organizations;
