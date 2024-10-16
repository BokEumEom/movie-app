// movie-app/hooks/useUserMovies.ts

import { useQuery } from '@tanstack/react-query';
import { getFavoriteMovies, getRatedMovies, getWatchlistMovies } from '@/services/accountService';
import { useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';
import { Movie } from '@/types';

interface UseUserMoviesResult {
  favoriteMovies: Movie[] | undefined;
  ratedMovies: Movie[] | undefined;
  watchlistMovies: Movie[] | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

const useUserMovies = (): UseUserMoviesResult => {
  const { isAuthenticated } = useContext(AuthContext);

  // Fetch Rated Movies (available for both authenticated and guest users)
  const {
    data: ratedMovies,
    isLoading: isLoadingRatedMovies,
    isError: isErrorRatedMovies,
    error: errorRatedMovies,
  } = useQuery<Movie[], Error>({
    queryKey: ['ratedMovies'], // Query key for rated movies
    queryFn: getRatedMovies,    // Fetch function for rated movies
    staleTime: 1000 * 60 * 5,   // Cache the result for 5 minutes
    enabled: isAuthenticated, // 인증된 사용자 경우에 쿼리 실행
    retry: 2,                   // Retry failed requests up to 2 times
  });

  // Fetch Favorite Movies (only for authenticated users)
  const {
    data: favoriteMovies,
    isLoading: isLoadingFavoriteMovies,
    isError: isErrorFavoriteMovies,
    error: errorFavoriteMovies,
  } = useQuery<Movie[], Error>({
    queryKey: ['favoriteMovies'],    // Query key for favorite movies
    queryFn: getFavoriteMovies,      // Fetch function for favorite movies
    staleTime: 1000 * 60 * 5,        // Cache the result for 5 minutes
    enabled: isAuthenticated, // 인증된 사용자만 쿼리 실행
    retry: 2,                        // Retry failed requests up to 2 times
  });

  // Fetch Watchlist Movies (only for authenticated users)
  const {
    data: watchlistMovies,
    isLoading: isLoadingWatchlistMovies,
    isError: isErrorWatchlistMovies,
    error: errorWatchlistMovies,
  } = useQuery<Movie[], Error>({
    queryKey: ['watchlistMovies'],   // Query key for watchlist movies
    queryFn: getWatchlistMovies,     // Fetch function for watchlist movies
    staleTime: 1000 * 60 * 5,        // Cache the result for 5 minutes
    enabled: isAuthenticated, // 인증된 사용자만 쿼리 실행
    retry: 2,                        // Retry failed requests up to 2 times
  });

  // Combine loading, error states, and data from all three queries
  const isLoading = isLoadingRatedMovies || isLoadingFavoriteMovies || isLoadingWatchlistMovies;
  const isError = isErrorRatedMovies || isErrorFavoriteMovies || isErrorWatchlistMovies;
  const error = errorRatedMovies || errorFavoriteMovies || errorWatchlistMovies || null;

  return {
    favoriteMovies,
    ratedMovies,
    watchlistMovies,
    isLoading,
    isError,
    error,
  };
};

export default useUserMovies;
