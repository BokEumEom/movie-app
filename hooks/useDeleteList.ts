// hooks/useDeleteList.ts

import { useQueryClient } from '@tanstack/react-query';
import { deleteList } from '@/services/listService';
import { Alert } from 'react-native';

const useDeleteList = () => {
  const queryClient = useQueryClient();

  const handleDeleteList = async (listId: number) => {
    const previousLists = queryClient.getQueryData(['userLists']);

    queryClient.setQueryData(['userLists'], (old: any) =>
      old ? old.filter((list: any) => list.id !== listId) : []
    );

    try {
      await deleteList(listId);
      Alert.alert('성공', '리스트가 삭제되었습니다.');
    } catch (error: any) {
      queryClient.setQueryData(['userLists'], previousLists); // 오류 시 롤백
      const errorMessage = error.response?.data?.status_message || '리스트 삭제 중 오류가 발생했습니다.';
      Alert.alert('오류', errorMessage);
    }
  };

  return { handleDeleteList };
};

export default useDeleteList;
