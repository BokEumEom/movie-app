// movie-app/hooks/useAccountStates.ts

import { useState, useEffect, useContext } from 'react';
import { getAccountStates, getRatedMovies } from '@/services/userService';
import { AuthContext } from '@/contexts/AuthContext';
import { AccountStates, Movie } from '@/types';

const useAccountStatesHook = (movieId: number) => {
  const [isFavourite, setIsFavourite] = useState<boolean>(false);
  const [inWatchlist, setInWatchlist] = useState<boolean>(false);
  const [userRating, setUserRating] = useState<number | null>(null);
  const { isAuthenticated, isGuest } = useContext(AuthContext);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccountStatesData = async () => {
      if (isAuthenticated) {
        try {
          const accountStates: AccountStates = await getAccountStates(movieId);
          setIsFavourite(accountStates.favorite);
          setInWatchlist(accountStates.watchlist);
          const rating = accountStates.rated ? Math.round(accountStates.rated.value * 10) : null;
          setUserRating(rating);
        } catch (err: any) {
          console.error('Error fetching account states:', err.message);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      } else if (isGuest) {
        try {
          // 게스트 세션에서 평가한 모든 영화 가져오기
          const ratedMovies: Movie[] = await getRatedMovies();
          // 현재 영화의 평점을 찾아 설정
          const currentMovie = ratedMovies.find(movie => movie.id === movieId);
          const rating = currentMovie ? Math.round(currentMovie.rating * 10) : null;
          setUserRating(rating);
          // 게스트는 favorite과 watchlist를 사용할 수 없으므로 false로 설정
          setIsFavourite(false);
          setInWatchlist(false);
        } catch (err: any) {
          console.error('Error fetching rated movies for guest:', err.message);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      } else {
        // 인증되지 않은 사용자
        setIsFavourite(false);
        setInWatchlist(false);
        setUserRating(null);
        setLoading(false);
      }
    };

    fetchAccountStatesData();
  }, [movieId, isAuthenticated, isGuest]);

  return {
    isFavourite,
    setIsFavourite,
    inWatchlist,
    setInWatchlist,
    userRating,
    setUserRating,
    loading,
    error,
  };
};

export default useAccountStatesHook;
