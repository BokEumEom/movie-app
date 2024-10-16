import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addItemToList } from '@/services/listService';
import { showAlert } from '@/utils/showAlert';
import { AddItemToListResponse, AddMovieVariables } from '@/types';
import { AxiosError } from 'axios';

const MESSAGES = {
  success: '영화가 리스트에 성공적으로 추가되었습니다.',
  error: '리스트에 영화를 추가하는 중 오류가 발생했습니다.',
};

const useAddMovieToList = () => {
  const queryClient = useQueryClient();

  const handleSuccess = (variables: AddMovieVariables) => {
    showAlert('성공', MESSAGES.success);

    // 리스트 상세 정보를 업데이트하기 위해 invalidateQueries 사용
    queryClient.invalidateQueries(['listDetails', variables.listId]);

    // 또는 setQueryData를 사용하여 성능 최적화 (옵션)
    /*
    queryClient.setQueryData(['listDetails', variables.listId], (oldData: any) => {
      if (!oldData) return;
      return {
        ...oldData,
        items: [...oldData.items, newItem], // 새로운 영화 항목 추가
      };
    });
    */
  };

  const handleError = (error: AxiosError) => {
    console.error('리스트에 영화를 추가하는 중 오류 발생:', error);
    const errorMessage =
      error.response?.data?.status_message ||
      error.message ||
      MESSAGES.error;
    showAlert('오류', errorMessage);
  };

  return useMutation<AddItemToListResponse, AxiosError, AddMovieVariables>({
    mutationFn: async ({ listId, movieId }: AddMovieVariables) => {
      return await addItemToList(listId, movieId);
    },
    onSuccess: (_data, variables) => handleSuccess(variables),
    onError: handleError,
  });
};

export default useAddMovieToList;