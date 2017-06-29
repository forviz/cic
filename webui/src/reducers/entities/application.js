const initialState = {
  entities: {},
  fetchStatus: {},
  errors: {},
};
const reducers = (state = initialState, action) => {
  switch (action.type) {
    case 'USER/APPLICATION/RECEIVED': {
      return {
        ...state,
        entities: action.applications,
      };
    }
    case 'USER/APPLICATION/DELETE': {
      return {
        ...state,
        fetchStatus: action.status,
      };
    }
    case 'USER/APPLICATION/CREATE': {
      return {
        ...state,
        fetchStatus: action.status,
      };
    }
    default:
      return state;
  }
};

export default reducers;
