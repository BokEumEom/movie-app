// services/accountService.ts

import apiV4 from './apiV4';
import { getAccountId } from './sessionStorage';
import { Movie } from '@/types';

// 즐겨찾기 영화 가져오기 (v4)
export const getFavoriteMovies = async (): Promise<Movie[]> => {
  try {
    const accountObjectId = await getAccountId();
    if (!accountObjectId) {
      throw new Error('Account ID not found.');
    }

    const response = await apiV4.get(`/account/${accountObjectId}/movie/favorites`, {
      params: {
        page: 1,
        language: 'ko-KR',
      },
    });

    return response.data.results;
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      console.warn('No favorite movies found (404). Returning empty array.');
      return [];
    }
    console.error('Error getting favorite movies:', error.message);
    throw error;
  }
};

// 평가한 영화 목록 가져오기 (v4)
export const getRatedMovies = async (): Promise<Movie[]> => {
  try {
    const accountObjectId = await getAccountId();
    if (!accountObjectId) {
      throw new Error('Account ID not found.');
    }

    const response = await apiV4.get(`/account/${accountObjectId}/movie/rated`, {
      params: {
        page: 1,
        language: 'ko-KR',
      },
    });

    return response.data.results;
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      console.warn('No rated movies found (404). Returning empty array.');
      return [];
    }
    console.error('Error getting rated movies:', error.message);
    throw error;
  }
};

// 관심 목록 영화 가져오기 (v4)
export const getWatchlistMovies = async (): Promise<Movie[]> => {
  try {
    const accountObjectId = await getAccountId();
    if (!accountObjectId) {
      throw new Error('Account ID not found.');
    }

    const response = await apiV4.get(`/account/${accountObjectId}/movie/watchlist`, {
      params: {
        page: 1,
        language: 'ko-KR',
      },
    });

    return response.data.results;
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      console.warn('No watchlist movies found (404). Returning empty array.');
      return [];
    }
    console.error('Error getting watchlist movies:', error.message);
    throw error;
  }
};
