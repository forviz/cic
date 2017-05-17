import _ from 'lodash';

const initialState = {
  entities: {
    emailuser: 'pinpisut.pin@gmail.com',
  }

};

/*const settingUserprofile = (state = initialState, action) => {
  switch (action.type) {
    case 'editEmail': {
      return {
        ...state,
      }
    }
    default : return state;
  }
}

export default settings;*/

export default (state = initialState, action) => {
  switch (action.type){
    default: return state;
  }
}