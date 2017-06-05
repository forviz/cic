import _ from 'lodash';

import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT_SUCCESS,
} from '../../constants';

const initialState = {
  // access_token: 'ciylb9lc80000t5xzerjd5a9q',
  // bearer_token: 'fbPcSrbF5Cfc3BjhIyJ9R75JU9ABimOx8iyecOg0UFMtBazuXOzHMbG60FaVWFdHCO0Y69x7JrmkgkBr60YoFWfkReS0DKnYZB9AZPHzgAmiMl3lLpHCF5qPbP8uz5lFIlGI7WhRLE3kOS2t0ILLnjrZOAhZNvNxxyNYTwKyDXAaNTwF1XJDnqS0ApTOXf7ED6iR1QxXWzo0HirrnEh65jrovKeJlBLmJ00VfDMq3P3IAX5iUK6RB7rFfkCcFnX0',
  isFetching: false,
  isAuthenticated: localStorage.getItem('id_token') ? true : false,
  token: localStorage.getItem('id_token'),
  spaces: [],
}

const user = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
        isAuthenticated: false,
        user: action.creds
      });
    case LOGIN_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        isAuthenticated: true,
        errorMessage: ''
      });
    case LOGIN_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        isAuthenticated: false,
        errorMessage: action.message
      });
    case LOGOUT_SUCCESS:
      return Object.assign({}, state, {
        isFetching: true,
        isAuthenticated: false
      });

    case 'USER/SPACES/RECEIVED': {
      const ids = _.map(action.spaces, space => space._id);
      return { ...state, spaces: ids };
    }

    case 'USER/ORGANIZATIONS/RECEIVED': {
      const ids = _.map(action.organizations, org => org._id);
      return { ...state, organizations: ids };
    }

    default:
      return state
    }
}

export default user;
