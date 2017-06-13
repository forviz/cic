import _ from 'lodash';

import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT_SUCCESS,
} from '../../constants';

const initialState = {
  isFetching: false,
  isAuthenticated: localStorage.getItem('id_token'),
  token: localStorage.getItem('id_token'),
  spaces: [],
};

const user = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
        isAuthenticated: false,
        user: action.creds,
      });
    case LOGIN_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        isAuthenticated: true,
        errorMessage: '',
      });
    case LOGIN_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        isAuthenticated: false,
        errorMessage: action.message,
      });
    case LOGOUT_SUCCESS:
      return Object.assign({}, state, {
        isFetching: true,
        isAuthenticated: false,
      });

    case 'USER/PROFILE/RECEIVED':
      return { ...state, ...action.profile };

    case 'USER/SPACES/RECEIVED': {
      const ids = _.map(action.spaces, space => space._id);
      return { ...state, spaces: ids };
    }

    case 'USER/ORGANIZATIONS/RECEIVED': {
      const ids = _.map(action.organizations, org => org._id);
      return {
        ...state,
        organizations: ids,
      };
    }

    default: return state;
  }
};

export default user;
