// movie-app/hooks/useFetchPersonDetails.ts

import { useQuery } from '@tanstack/react-query';
import { fetchPersonDetails } from '@/services/moviedb';

interface PersonDetails {
  id: number;
  name: string;
  birthday: string;
  deathday: string | null;
  gender: number;
  biography: string;
  place_of_birth: string;
  profile_path: string;
  known_for_department: string;
  popularity: number;
}

export const useFetchPersonDetails = (id: number) => {
  return useQuery({
    queryKey: ['personDetails', id], // Object form
    queryFn: () => fetchPersonDetails(id),
    enabled: !!id, // Only run if 'id' is valid
    retry: 2, // Retry failed requests up to 2 times
    staleTime: 1000 * 60 * 5, // Cache results for 5 minutes
  });
};
