// movie-app/hooks/useFetchMovieDetails.ts

import { useQuery } from '@tanstack/react-query';
import { fetchMovieDetails } from '../services/moviedb';
import { Movie } from '@/types';

interface UseFetchMovieDetailsResult {
  movie: Movie | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

const useFetchMovieDetails = (id: number): UseFetchMovieDetailsResult => {
  const {
    data: movie,
    isLoading,
    isError,
    error,
  } = useQuery<Movie, Error>({
    queryKey: ['movieDetails', id],
    queryFn: () => fetchMovieDetails(id),
    enabled: Number.isInteger(id) && id > 0, // Only run query if id is valid
    retry: 2, // Retry failed requests twice
  });

  return { movie, isLoading, isError, error };
};

export default useFetchMovieDetails;
