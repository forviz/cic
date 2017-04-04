import React from 'react';
import _ from 'lodash';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { routerMiddleware } from 'react-router-redux';

import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { Router, browserHistory, useRouterHistory, createMemoryHistory } from 'react-router';
import { createHashHistory } from 'history';

// ===============
// Reducer
// ===============
import rootReducer from './reducers';

// CSS
// import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/style.scss';

// ===============
// Create Store
// ===============

// ===============
// Router
// ===============
import routes from './routes';

const applicationInitialState = {};

// ===============
// History Router
// ===============
const history = useRouterHistory(createHashHistory)({ queryKey: false });
// const history = createMemoryHistory()
// let history = browserHistory; // createMemoryHistory; // browserHistory;
if (process.env.NODE_ENV !== 'development') {
  // history = useRouterHistory(createHashHistory)({ queryKey: false });
}

const loggerMiddleware = createLogger();
const store = createStore(
  rootReducer,
  applicationInitialState,
  applyMiddleware(
    thunkMiddleware,
    loggerMiddleware,
    routerMiddleware(history),
  )
);
// ===============
// Render
// ===============

const rootEl = document.getElementById('app');

render(
  <Provider store={store}>
    <Router history={history} routes={routes} />
  </Provider>,
  rootEl
);
