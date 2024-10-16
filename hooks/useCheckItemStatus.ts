// movie-app/hooks/useCheckItemStatus.ts

import { useState } from 'react';
import { checkItemStatus } from '../services/listService';

const useCheckItemStatus = (listId: number, movieId: number) => {
  const [isInList, setIsInList] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const verifyStatus = async () => {
    setLoading(true);
    setError(null);
    try {
      const status = await checkItemStatus(listId, movieId);
      setIsInList(status);
    } catch (err: any) {
      setError(err.response?.data?.status_message || '상태를 확인하는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return {
    isInList,
    loading,
    error,
    verifyStatus,
  };
};

export default useCheckItemStatus;
