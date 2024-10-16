// movie-app/services/apiV3.ts

import axios from 'axios';
import { apiKey } from '../constants';
import { getSessionId, getGuestSessionId } from './sessionStorage';

const API_KEY = apiKey;
const API_BASE_URL = 'https://api.themoviedb.org/3';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use(
  async (config) => {
    const sessionId = await getSessionId();

    config.params = {
      ...config.params,
      api_key: API_KEY,
    };

    if (sessionId) {
      config.params.session_id = sessionId;
    }

    if (config.method === 'post') {
      config.headers['Content-Type'] = 'application/json;charset=utf-8';
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
