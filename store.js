import initOpbeat from 'opbeat-react';
import React from 'react';
import { createOpbeatMiddleware } from 'opbeat-react/redux'
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import * as reducers from 'modules';

if (process.env.NODE_ENV === 'production') {
  initOpbeat({
    orgId: '17ab8eb501d2418a81f3167c10407e90',
    appId: '57c8b7a2c8'
  });
}

const reducer = combineReducers({
  ...reducers
});

const initStore = (initialState = {}) =>
  createStore(
    reducer,
    initialState,
    /* Redux dev tool, install chrome extension in
     * https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=en */
    composeWithDevTools(
      /* The router middleware MUST be before thunk otherwise the URL changes
      * inside a thunk function won't work properly */
      applyMiddleware(thunk, createOpbeatMiddleware())
    )
  );

export { initStore };
