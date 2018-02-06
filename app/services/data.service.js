import axios from 'axios';
import { ACCESS_TOKEN } from '../constants';

// https://github.com/axios/axios

const instance = axios.create({});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN);

    if (token != null) {
      /* eslint-disable */
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (err) => Promise.reject(err)
);

const get = (url) => instance.get(url);
const post = (url, data) => instance.post(url, data);
const put = (url, data) => instance.put(url, data);
const del = (url) => instance.delete(url);

const dataService = {
  get,
  post,
  put,
  delete: del,
};

export { dataService };
