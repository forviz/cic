import { combineReducers } from 'redux';
import spaces from './spaces';
import entries from './entries';
import assets from './assets';

export default combineReducers({
  spaces,
  entries,
  assets,
});
