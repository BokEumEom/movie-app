// movie-app/services/userService.ts

import api from './apiV3';
import { getSessionId, getGuestSessionId } from './sessionStorage';
import * as SecureStore from 'expo-secure-store';
import { AccountStates, Movie, AccountDetails } from '@/types';
import { handleServiceError } from '@/utils/errorHandler';

const ACCOUNT_ID_KEY = 'account_id';

// 계정 상세 정보 가져오기
export const getAccountDetails = async (): Promise<AccountDetails | null> => {
  try {
    const sessionId = await getSessionId();
    if (!sessionId) return null;

    const response = await api.get('/account', {
      params: {
        session_id: sessionId,
      },
    });
    const accountDetails: AccountDetails = response.data;

    // account_id 저장
    await saveAccountId(accountDetails.id.toString());

    return accountDetails;
  } catch (error: any) {
    console.error('Error getting account details:', error.message);
    throw error;
  }
};

// account_id 저장
export const saveAccountId = async (accountId: string) => {
  try {
    await SecureStore.setItemAsync(ACCOUNT_ID_KEY, accountId);
  } catch (error: any) {
    console.error('Error saving account ID:', error.message);
    throw error;
  }
};

// account_id 가져오기
export const getAccountId = async (): Promise<string | null> => {
  try {
    const accountId = await SecureStore.getItemAsync(ACCOUNT_ID_KEY);
    return accountId;
  } catch (error: any) {
    console.error('Error getting account ID:', error.message);
    throw error;
  }
};

// 계정 상태 가져오기
export const getAccountStates = async (movieId: number): Promise<AccountStates> => {
  try {
    const sessionId = await getSessionId();
    if (!sessionId) {
      return { favorite: false, watchlist: false, rated: null };
    }
    const response = await api.get(`/movie/${movieId}/account_states`, {
      params: {
        session_id: sessionId,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error('Error getting account states:', error.message);
    throw error;
  }
};

// 즐겨찾기 설정/해제
export const markAsFavorite = async (mediaId: number, favorite: boolean) => {
  try {
    const sessionId = await getSessionId();
    const accountId = await getAccountId();

    if (!sessionId || !accountId) return null;

    const response = await api.post(
      `/account/${accountId}/favorite`,
      {
        media_type: 'movie',
        media_id: mediaId,
        favorite: favorite,
      }
    );

    return response.data;
  } catch (error: any) {
    console.error('Error marking as favorite:', error.message);
    throw error;
  }
};

// 즐겨찾기 영화 가져오기
export const getFavoriteMovies = async (): Promise<Movie[]> => {
  try {
    const sessionId = await getSessionId();
    const accountId = await getAccountId();

    // 게스트 사용자는 즐겨찾기 접근 불가
    if (!sessionId || !accountId) {
      console.warn('Guest users do not have access to favorite movies.');
      return [];
    }

    const response = await api.get(`/account/${accountId}/favorite/movies`, {
      params: {
        language: 'ko-KR',
      },
    });

    return response.data.results;
  } catch (error: any) {
    console.error('Error getting favorite movies:', error.message);
    throw error;
  }
};

// 관심 목록 추가/제거
export const addToWatchlist = async (mediaId: number, watchlist: boolean) => {
  try {
    const sessionId = await getSessionId();
    const accountId = await getAccountId();

    if (!sessionId || !accountId) return null;

    const response = await api.post(
      `/account/${accountId}/watchlist`,
      {
        media_type: 'movie',
        media_id: mediaId,
        watchlist: watchlist,
      }
    );

    return response.data;
  } catch (error: any) {
    console.error('Error adding to watchlist:', error.message);
    throw error;
  }
};

// 관심 목록 영화 가져오기
export const getWatchlistMovies = async (): Promise<Movie[]> => {
  try {
    const sessionId = await getSessionId();
    const accountId = await getAccountId();

    // 게스트 사용자는 관심 목록 접근 불가
    if (!sessionId || !accountId) {
      console.warn('Guest users do not have access to watchlist movies.');
      return [];
    }

    const response = await api.get(`/account/${accountId}/watchlist/movies`, {
      params: {
        language: 'ko-KR',
      },
    });

    return response.data.results;
  } catch (error: any) {
    console.error('Error getting watchlist movies:', error.message);
    throw error;
  }
};

// 영화 평가
export const rateMovie = async (movieId: number, rating: number) => {
  try {
    const sessionId = await getSessionId();
    const guestSessionId = await getGuestSessionId();

    if (sessionId) {
      const accountId = await getAccountId();

      if (!accountId) return null;

      const response = await api.post(
        `/movie/${movieId}/rating`,
        { value: rating }, // 0-10 점수
        {
          params: {
            session_id: sessionId,
          },
        }
      );

      return response.data;
    } else if (guestSessionId) {
      const response = await api.post(
        `/movie/${movieId}/rating`,
        { value: rating }, // 0-10 점수
        {
          params: {
            guest_session_id: guestSessionId,
          },
        }
      );

      return response.data;
    } else {
      throw new Error('No valid session found.');
    }
  } catch (error: any) {
    console.error('Error rating movie:', error.message);
    throw error;
  }
};

// 평가한 영화 목록 가져오기
export const getRatedMovies = async (): Promise<Movie[]> => {
  const sessionId = await getSessionId();
  const guestSessionId = await getGuestSessionId();
  let allResults: Movie[] = [];

  try {
    if (sessionId) {
      // 인증된 사용자의 경우
      const accountId = await getAccountId();
      if (!accountId) {
        throw new Error('Account ID is missing for authenticated user.');
      }

      let page = 1;
      let totalPages = 1;

      do {
        const response = await api.get(`/account/${accountId}/rated/movies`, {
          params: { 
            session_id: sessionId, 
            language: 'ko-KR', 
            sort_by: 'created_at.asc', 
            page 
          },
        });

        allResults = [...allResults, ...response.data.results];
        totalPages = response.data.total_pages;
        page += 1;
      } while (page <= totalPages);
    } else if (guestSessionId) {
      // 게스트 사용자의 경우
      let page = 1;
      let totalPages = 1;

      do {
        console.log(`Fetching rated movies for guest_session_id: ${guestSessionId}, page: ${page}`);
        const response = await api.get(`/guest_session/${guestSessionId}/rated/movies`, {
          params: { 
            language: 'ko-KR', 
            page 
          }, // 'sort_by' 제거
        });

        if (!response.data.results || response.data.results.length === 0) {
          console.log('No rated movies found for guest.');
          return [];
        }

        allResults = [...allResults, ...response.data.results];
        totalPages = response.data.total_pages;
        page += 1;
      } while (page <= totalPages);
    } else {
      console.warn('No valid session found.');
      return [];
    }

    return allResults;
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      console.warn('No rated movies found (404). Returning empty array.');
      return [];
    }
    console.error('Error getting rated movies:', error.message);
    throw error;
  }
};

/**
 * 영화 평가 삭제 함수
 * @param movieId - 평가를 삭제할 영화의 ID
 */
export const deleteRating = async (movieId: number): Promise<void> => {
  try {
    const sessionId = await getSessionId();
    const guestSessionId = await getGuestSessionId();

    if (sessionId) {
      const accountId = await getAccountId();
      if (!accountId) {
        console.error('Account ID가 없습니다.');
        return;
      }

      // 인증된 사용자의 경우 평가 삭제
      await api.delete(`/movie/${movieId}/rating`, {
        params: { 
          session_id: sessionId 
        },
      });

      console.log(`Movie ID ${movieId}의 평가가 삭제되었습니다.`);
    } else if (guestSessionId) {
      // 게스트 사용자의 경우 평가 삭제
      await api.delete(`/movie/${movieId}/rating`, {
        params: { 
          guest_session_id: guestSessionId 
        },
      });

      console.log(`Movie ID ${movieId}의 게스트 평가가 삭제되었습니다.`);
    } else {
      console.error('Session ID 또는 Guest Session ID가 없습니다.');
    }
  } catch (error: any) {
    console.error('Error deleting rating:', error.message);
    throw error;
  }
};
