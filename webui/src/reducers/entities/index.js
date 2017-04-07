import { combineReducers } from 'redux';
import spaces from './spaces';
import entries from './entries';

export default combineReducers({
  spaces,
  entries,
});
