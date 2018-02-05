import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import thunk from 'redux-thunk';
import reduxImmutableStateInvariant from 'redux-immutable-state-invariant';
import { createLogger } from 'redux-logger';

import { rootReducer, initialState } from './reducers';
import { parseQueryString, storeAuth } from './services';
import { history, ACCESS_TOKEN, ActionTypes as actionTypes } from './constants';

const enhancers = [];
const middleware = [thunk, routerMiddleware(history)];

const isDev = process.env.NODE_ENV === 'development';
if (isDev) {
  const logger = createLogger({
    collapsed: true,
  });
  const { devToolsExtension } = window;
  if (typeof devToolsExtension === 'function') {
    enhancers.push(devToolsExtension());
  }

  middleware.push(logger);
  middleware.push(reduxImmutableStateInvariant());
}

const composedEnhancers = compose(applyMiddleware(...middleware), ...enhancers);

function storeSetup() {
  const store = createStore(rootReducer(), initialState, composedEnhancers);
  return store;
}
const store = storeSetup();

export function injectAsyncReducer(storeInput, asyncReducer) {
  storeInput.replaceReducer(rootReducer(asyncReducer));
}

const initialToken = parseQueryString()[ACCESS_TOKEN];
if (initialToken) {
  const user = storeAuth(initialToken);
  store.dispatch({ type: actionTypes.LOGIN.LOGIN_SUCCESS, data: user });
}

export default store;
