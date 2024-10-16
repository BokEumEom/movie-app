// movie-app/src/hooks/useGetMovieLists.ts

import { useQuery } from '@tanstack/react-query';
import { getMovieLists, GetMovieListsResponse } from '@/services/moviedb';

const useGetMovieLists = (movieId: number) => {
  return useQuery<GetMovieListsResponse, Error>({
    queryKey: ['movieLists', movieId],
    queryFn: () => getMovieLists(movieId),
    enabled: movieId > 0, // Only run if movieId is valid
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });
};

export default useGetMovieLists;
