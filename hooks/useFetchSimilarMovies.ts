// movie-app/hooks/useFetchSimilarMovies.ts

import { useQuery } from '@tanstack/react-query';
import { fetchSimilarMovies } from '../services/moviedb';
import { MovieItem } from '@/types';

interface UseFetchSimilarMoviesResult {
  similarMovies: MovieItem[] | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

const useFetchSimilarMovies = (id: number): UseFetchSimilarMoviesResult => {
  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery<{ results: MovieItem[] }, Error>({
    queryKey: ['similarMovies', id],
    queryFn: () => fetchSimilarMovies(id),
    enabled: Number.isInteger(id) && id > 0,
    retry: 2,
  });

  return {
    similarMovies: data?.results,
    isLoading,
    isError,
    error,
  };
};

export default useFetchSimilarMovies;
