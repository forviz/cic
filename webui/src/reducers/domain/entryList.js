const initialState = {
  items: [],
  pagination: {
    pageSize: 10, // number of item per page
    current: 1, // current Page
  },

};

const entryList = (state = initialState, action) => {
  switch (action.type) {
    case 'ENTRYLIST/ENTRIES/RECEIVED':
      return {
        ...state,
        items: action.entryIds,
      };
    default: return state;
  }
};

export default entryList;
