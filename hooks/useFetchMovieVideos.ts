// movie-app/hooks/useFetchMovieVideos.ts

import { useQuery } from '@tanstack/react-query';
import { fetchMovieVideos } from '../services/moviedb';
import { Video } from '../types/movie';

interface UseFetchMovieVideosResult {
  videos: Video[] | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
}

const useFetchMovieVideos = (id: number): UseFetchMovieVideosResult => {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<Video[], Error>({
    queryKey: ['movieVideos', id],
    queryFn: async () => {
      const response = await fetchMovieVideos(id);
      // Filter for YouTube trailers
      return response.results.filter(
        (video) => video.site === 'YouTube' && video.type === 'Trailer'
      );
    },
    enabled: Number.isInteger(id) && id > 0,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });

  return { videos: data, isLoading, isError, error, refetch };
};

export default useFetchMovieVideos;
