// movie-app/src/services/apiV4.ts

import axios from 'axios';
import { getUserAccessToken } from './sessionStorage';
import { v4ApiToken } from '@/constants';

// 기본 Axios 인스턴스 생성
const apiV4 = axios.create({
  baseURL: 'https://api.themoviedb.org/4',
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  },
});

// 요청 인터셉터: 요청 시마다 적절한 Authorization 헤더 설정
apiV4.interceptors.request.use(
  async (config) => {
    const accessToken = await getUserAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    } else if (config.url?.includes('/list') || config.url?.includes('/account')) {
      // 사용자별 데이터를 요청할 때는 반드시 accessToken이 필요합니다.
      console.error('Access token is missing. Cannot fetch user-specific data.');
      return Promise.reject(new Error('User access token is missing.'));
    } else {
      // 사용자 인증이 필요 없는 경우만 앱의 v4ApiToken을 사용
      config.headers.Authorization = `Bearer ${v4ApiToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiV4;
