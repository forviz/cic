import _ from 'lodash';

const initialState = {
  spaces: [],
  access_token: 'ciylb9lc80000t5xzerjd5a9q',
  bearer_token: 'fbPcSrbF5Cfc3BjhIyJ9R75JU9ABimOx8iyecOg0UFMtBazuXOzHMbG60FaVWFdHCO0Y69x7JrmkgkBr60YoFWfkReS0DKnYZB9AZPHzgAmiMl3lLpHCF5qPbP8uz5lFIlGI7WhRLE3kOS2t0ILLnjrZOAhZNvNxxyNYTwKyDXAaNTwF1XJDnqS0ApTOXf7ED6iR1QxXWzo0HirrnEh65jrovKeJlBLmJ00VfDMq3P3IAX5iUK6RB7rFfkCcFnX0',
}

const user = (state = initialState, action) => {
  switch (action.type) {
    case 'USER/SPACES/RECEIVED':
      return {
        ...state,
        spaces: _.map(action.spaces, space => space._id),
      }
    default: return state;
  }
}

export default user;
