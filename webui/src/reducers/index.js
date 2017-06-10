import { combineReducers } from 'redux';
import masterapp from './masterapp';

import entities from './entities';
import session from './session';
import entryList from './domain/entryList';

export default combineReducers({
  masterapp,
  entities,
  session,
  domain: combineReducers({
    entryList,
  }),
});
