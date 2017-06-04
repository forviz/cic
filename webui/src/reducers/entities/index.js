import { combineReducers } from 'redux';
import spaces from './spaces';
import organizations from './organizations';
import entries from './entries';
import assets from './assets';

export default combineReducers({
  spaces,
  organizations,
  entries,
  assets,
});
