// movie-app/hooks/useFetchMovieCredits.ts

import { useQuery } from '@tanstack/react-query';
import { fetchMovieCredits } from '../services/moviedb';
import { CastMember } from '@/types';

interface UseFetchMovieCreditsResult {
  cast: CastMember[] | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

const useFetchMovieCredits = (id: number): UseFetchMovieCreditsResult => {
  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery<{ cast: CastMember[] }, Error>({
    queryKey: ['movieCredits', id],
    queryFn: () => fetchMovieCredits(id),
    enabled: Number.isInteger(id) && id > 0,
    retry: 2,
  });

  return {
    cast: data?.cast,
    isLoading,
    isError,
    error,
  };
};

export default useFetchMovieCredits;
