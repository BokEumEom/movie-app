// hooks/useListDetails.ts
import { useState, useEffect, useCallback } from 'react';
import { getListDetails, removeItemFromList, clearList } from '@/services/listService';
import { List, Movie } from '@/types';

const useListDetails = (listId: number, isAuthenticated: boolean, isGuest: boolean) => {
  const [list, setList] = useState<List | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchList = async () => {
      try {
        const fetchedList = await getListDetails(listId);
        if (isMounted) {
          setList(fetchedList);
        }
      } catch (err: unknown) {
        if (isMounted) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError('리스트를 불러오는 중 오류가 발생했습니다.');
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (isAuthenticated || isGuest) {
      fetchList();
    } else {
      setLoading(false);
      setList(null);
    }

    return () => {
      isMounted = false;
    };
  }, [listId, isAuthenticated, isGuest]);

  const removeMovie = useCallback(async (movieId: number) => {
    setProcessing(true);
    try {
      await removeItemFromList(listId, movieId);
      const updatedList = await getListDetails(listId);
      setList(updatedList);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('영화를 제거하는 중 오류가 발생했습니다.');
      }
    } finally {
      setProcessing(false);
    }
  }, [listId]);

  const clearAllMovies = useCallback(async () => {
    setProcessing(true);
    try {
      await clearList(listId);
      const updatedList = await getListDetails(listId);
      setList(updatedList);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('리스트를 비우는 중 오류가 발생했습니다.');
      }
    } finally {
      setProcessing(false);
    }
  }, [listId]);

  return { list, loading, processing, error, removeMovie, clearAllMovies };
};

export default useListDetails;
