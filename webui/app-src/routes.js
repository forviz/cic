import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './containers/App';
import Home from './containers/Home';
import SpaceContainer from './containers/Space';
import ContentTypeListContainer from './containers/Space/ContentType/list';
import ContentTypeSingleContainer from './containers/Space/ContentType/single';
import EntryListContainer from './containers/Space/Entry/list';
import EntrySingleContainer from './containers/Space/Entry/single';

const routes = (
  <Route path={'/'} component={App}>
    <IndexRoute component={Home} />
    <Route path="/space/:spaceId" component={SpaceContainer}>
      <Route path="content_type" component={ContentTypeListContainer} />
      <Route path="content_type/:contentTypeId" component={ContentTypeSingleContainer} />
      <Route path="entries" component={EntryListContainer} />
      <Route path="entries/:entryId" component={EntrySingleContainer} />
    </Route>
  </Route>
);

export default routes;
