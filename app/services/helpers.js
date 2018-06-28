import createBrowserHistory from 'history/createBrowserHistory';
import createMemoryHistory from 'history/createMemoryHistory';
import { decode } from './jwt-decode';
import { ACCESS_TOKEN } from './constants';

export const isBrowser = typeof window !== 'undefined';

export const history = isBrowser ? createBrowserHistory() : createMemoryHistory();

export const accessToken = () => tokenFromQuery() || localStorage.getItem(ACCESS_TOKEN);

export const getAuth = () => {
  const token = accessToken();
  return token ? decode(token) : undefined;
};

export const setAuth = token => {
  localStorage.setItem(ACCESS_TOKEN, token);
  return decode(token);
};

export const clearAuth = () => {
  localStorage.clear(ACCESS_TOKEN);
};

export const navigate = route => {
  history.push(route);
};

export const parseQueryString = () => {
  const str = window.location.search;
  const objURL = {};

  str.replace(new RegExp('([^?=&]+)(=([^&]*))?', 'g'), ($0, $1, $2, $3) => {
    objURL[$1] = $3;
  });
  return objURL;
};

// https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
export const guid = () => {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return `${s4() + s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
};

function tokenFromQuery() {
  return parseQueryString()[ACCESS_TOKEN];
}
