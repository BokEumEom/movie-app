// hooks/useMovieHandlers.ts

import { useContext } from 'react';
import { Alert } from 'react-native';
import { AuthContext } from '@/contexts/AuthContext';
import {
  markAsFavorite,
  addToWatchlist,
  rateMovie,
  deleteRating,
} from '@/services/userService';
import { handleError } from '@/utils/errorHandler';

export const useMovieHandlers = (
  movieId: number,
  isFavourite: boolean,
  setIsFavourite: React.Dispatch<React.SetStateAction<boolean>>,
  inWatchlist: boolean,
  setInWatchlist: React.Dispatch<React.SetStateAction<boolean>>,
  setUserRating: React.Dispatch<React.SetStateAction<number | null>>
) => {
  const { isAuthenticated } = useContext(AuthContext);

  const requireAuth = (action: () => Promise<void> | void) => {
    if (!isAuthenticated) {
      Alert.alert('로그인이 필요합니다.', '이 기능을 사용하려면 로그인해주세요.');
      return;
    }
    action();
  };

  const toggleItemState = async (
    currentState: boolean,
    setState: React.Dispatch<React.SetStateAction<boolean>>,
    apiCall: (movieId: number, state: boolean) => Promise<void>,
    successMessage: string,
    errorMessage: string
  ) => {
    try {
      await apiCall(movieId, !currentState);
      setState(!currentState);
      if (__DEV__) {
        console.log(successMessage);
      }
    } catch (error: unknown) {
      handleError(error, errorMessage);
    }
  };

  const handleFavouritePress = (): void => {
    requireAuth(() =>
      toggleItemState(
        isFavourite,
        setIsFavourite,
        markAsFavorite,
        '찜하기 상태가 업데이트되었습니다.',
        '찜하기 상태를 업데이트하는 중 오류가 발생했습니다.'
      )
    );
  };

  const handleWatchlistPress = (): void => {
    requireAuth(() =>
      toggleItemState(
        inWatchlist,
        setInWatchlist,
        addToWatchlist,
        '관심 목록 상태가 업데이트되었습니다.',
        '관심 목록 상태를 업데이트하는 중 오류가 발생했습니다.'
      )
    );
  };

  const handleRateMovie = (rating: number): void => {
    requireAuth(async () => {
      try {
        const tmdbRating = rating / 10;
        await rateMovie(movieId, tmdbRating);
        setUserRating(rating);
        Alert.alert('평가 완료', `이 영화를 ${rating}점으로 평가하였습니다.`);
        if (__DEV__) {
          console.log(`Movie rated with score: ${tmdbRating}`);
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error('Error rating movie:', error.message);
          Alert.alert('오류', '영화를 평가하는 중 오류가 발생했습니다.');
        } else {
          console.error('Unexpected error', error);
          Alert.alert('오류', '예기치 못한 오류가 발생했습니다.');
        }
      }
    });
  };

  const handleDeleteRating = (): void => {
    requireAuth(() => {
      Alert.alert('평가 삭제', '정말로 이 영화에 대한 평가를 삭제하시겠습니까?', [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteRating(movieId);
              setUserRating(null);
              Alert.alert('삭제 완료', '영화에 대한 평가가 삭제되었습니다.');
              if (__DEV__) {
                console.log(`Rating for movie ID ${movieId} deleted.`);
              }
            } catch (error: unknown) {
              if (error instanceof Error) {
                console.error('Error deleting rating:', error.message);
                Alert.alert('오류', '평가를 삭제하는 중 오류가 발생했습니다.');
              } else {
                console.error('Unexpected error', error);
                Alert.alert('오류', '예기치 못한 오류가 발생했습니다.');
              }
            }
          },
        },
      ]);
    });
  };

  // ...다른 핸들러 함수들

  return {
    handleFavouritePress,
    handleWatchlistPress,
    handleRateMovie,
    handleDeleteRating,
    // ...다른 핸들러 함수들 반환
  };
};
