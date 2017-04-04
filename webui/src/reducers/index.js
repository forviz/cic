import { combineReducers } from 'redux';
import masterapp from './masterapp';

import entities from './entities';
import session from './session';

export default combineReducers({
  masterapp,
  entities,
  session,
});
