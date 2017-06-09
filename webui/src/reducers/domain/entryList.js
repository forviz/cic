import _ from 'lodash';

const initialState = {
  queryParam: { // For Display only
    contentType: 'All',
    status: 'All',
    search: '',
  },
	visibleList: [], // id ของ entry ที่กำลังแสดงผล
}

const reducer = (state = initialState, action) => {
	switch (action.type) {

    case 'ENTRYLIST/UPDATE/VISIBLELIST': {
      return { ...state, visibleList: action.list };
    }

		default: return state;
	}
}

export default reducer;