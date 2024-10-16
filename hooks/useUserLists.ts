// movie-app/hooks/useUserLists.ts

import { useQuery } from '@tanstack/react-query';
import { getUserLists } from '@/services/listService';
import { GetMovieListsResponse } from '@/types';
import { useContext, useEffect } from 'react';
import { AuthContext } from '@/contexts/AuthContext';
import { Alert } from 'react-native';

const useUserLists = () => {
  const { isAuthenticated } = useContext(AuthContext);

  // React Query를 사용한 리스트 조회
  const query = useQuery<GetMovieListsResponse, Error>({
    queryKey: ['userLists'],
    queryFn: getUserLists,
    enabled: isAuthenticated, // 인증된 사용자만 조회 가능
    staleTime: 1000 * 60 * 5, // 5분 동안 캐시 유지
    retry: 2, // 실패 시 재시도 횟수
    onError: (error) => {
      console.error('Error fetching user lists:', error.message);
    },
  });

  // 에러 발생 시 경고창 표시
  useEffect(() => {
    if (query.isError) {
      Alert.alert('오류', '리스트를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.');
    }
  }, [query.isError]);

  return query;
};

export default useUserLists;
