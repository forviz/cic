import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';

import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';

import App from './App';
import './index.css';

// ===============
// Reducer
// ===============
import rootReducer from './reducers';


const applicationInitialState = {};

const loggerMiddleware = createLogger();
const store = createStore(
  rootReducer,
  applicationInitialState,
  applyMiddleware(
    thunkMiddleware,
    loggerMiddleware,
  )
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
