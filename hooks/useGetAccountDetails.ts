// movie-app/hooks/useGetAccountDetails.ts

import { useQuery } from '@tanstack/react-query';
import api from '@/services/apiV3';
import { useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';

export interface AccountDetails {
  id: number;
  name: string;
  username: string;
  // ... other fields as needed
}

const useGetAccountDetails = () => {
  const { isAuthenticated } = useContext(AuthContext);

  return useQuery<AccountDetails, Error>({
    queryKey: ['accountDetails'],
    queryFn: async () => {
      if (!isAuthenticated) {
        throw new Error('User is not authenticated');
      }
      const response = await api.get('/account');
      return response.data;
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 60, // 1 hour
    retry: 2,
    onError: (error) => {
      console.error('Error fetching account details:', error.message);
    },
  });
};

export default useGetAccountDetails;
