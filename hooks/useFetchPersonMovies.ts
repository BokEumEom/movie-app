// movie-app/hooks/useFetchPersonMovies.ts

import { useQuery } from '@tanstack/react-query';
import { fetchPersonMovieCredits } from '@/services/moviedb';

interface MovieCredit {
  id: number;
  title: string;
  poster_path: string;
}

export const useFetchPersonMovies = (id: number) => {
  return useQuery({
    queryKey: ['personMovies', id], // Object form
    queryFn: () => fetchPersonMovieCredits(id),
    enabled: !!id, // Only run if 'id' is valid
    retry: 2, // Retry failed requests up to 2 times
    staleTime: 1000 * 60 * 5, // Cache results for 5 minutes
    select: (data) => data.cast, // Select only cast data
  });
};
