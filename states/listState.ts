import { observable } from '@legendapp/state';
import { getUserLists, deleteList } from '@/services/listService';
import { handleServiceError } from '@/utils/errorHandler';

export const listState = observable({
  lists: [] as any[],
  loading: false,
  error: null as string | null,

  // 리스트 가져오기
  async fetchUserLists() {
    this.loading.set(true);
    try {
      const response = await getUserLists();
      this.lists.set(response.results);
    } catch (error: any) {
      this.error.set(handleServiceError('Fetching user lists', error));
    } finally {
      this.loading.set(false);
    }
  },

  // 리스트 삭제
  async removeList(listId: number) {
    const previousLists = this.lists.peek(); // 현재 상태 저장
    this.lists.set(this.lists.get().filter((list) => list.id !== listId));
    
    try {
      await deleteList(listId);
    } catch (error: any) {
      this.lists.set(previousLists); // 오류 발생 시 롤백
      throw handleServiceError('Deleting list', error);
    }
  },
});
