// movie-app/src/services/listService.ts

import apiV4 from './apiV4';
import { 
  List, 
  CreateListResponse, 
  AddItemToListResponse, 
  MovieList, 
  PaginatedResponse, 
  ListItem,
  MediaType,
  GetMovieListsResponse
} from '@/types/movie';
import { handleServiceError } from '@/utils/errorHandler';

// Enum to define actions for modifying list items
enum ListAction {
  Add = 'add',
  Remove = 'remove',
}

/**
 * 리스트 항목을 추가하거나 제거하는 일반화된 함수입니다.
 * @param listId - 리스트 ID
 * @param items - 추가 또는 제거할 아이템 배열
 * @param action - 'add' 또는 'remove'
 * @returns API 응답 데이터
 */
const modifyListItems = async (
  listId: number,
  items: ListItem[],
  action: ListAction
): Promise<AddItemToListResponse> => {
  try {
    const endpoint = `/list/${listId}/items`;
    const method = action === ListAction.Add ? 'post' : 'delete';
    const response = await apiV4.request<AddItemToListResponse>({
      url: endpoint,
      method,
      data: { items },
    });
    return response.data;
  } catch (error: unknown) {
    handleServiceError(`${action === ListAction.Add ? 'adding' : 'removing'} item(s) in list`, error);
    throw error;
  }
};


/**
 * 유저의 모든 리스트 가져오기 (v4)
 * @returns 유저의 모든 리스트 응답 데이터
 */
export const getUserLists = async (): Promise<GetMovieListsResponse> => {
  try {
    const accountObjectId = '66dfb53b18d0fdf8e26deeaa';
    if (!accountObjectId) {
      throw new Error('Account Object ID not found.'); // 계정 ID가 없으면 에러
    }

    console.log('Account Object ID:', accountObjectId); // 계정 ID 확인

    const response = await apiV4.get<GetMovieListsResponse>(`/account/${accountObjectId}/lists`);

    console.log('User lists response:', response.data); // 응답 데이터 확인
    return response.data;
  } catch (error: any) {
    // 추가적으로 API 요청에 따른 예외 처리 강화
    if (error.response && error.response.status === 404) {
      console.warn('No user lists found (404). Returning empty object.');
      return { results: [], total_pages: 0, total_results: 0, page: 1 };
    }
    console.error('Error fetching user lists:', error.message);
    throw error;
  }
};

/**
 * 리스트 생성
 * @param name - 리스트 이름
 * @param description - 리스트 설명
 * @param isPublic - 리스트 공개 여부
 * @param sortBy - 리스트 정렬 기준
 * @param iso_639_1 - 언어 코드
 * @param iso_3166_1 - 국가 코드
 * @returns 생성된 리스트의 응답 데이터
 */
export const createList = async (
  name: string, 
  description: string, 
  isPublic: boolean = false,
  sortBy: string = 'original_order.asc',
  iso_639_1: string = 'ko',
  iso_3166_1: string = 'KR',
): Promise<CreateListResponse> => {
  try {
    const response = await apiV4.post<CreateListResponse>('/list', {
      name,
      description,
      public: isPublic,
      sort_by: sortBy,
      iso_639_1,
      iso_3166_1,
    });
    return response.data;
  } catch (error: unknown) {
    handleServiceError('creating list', error);
    throw error;
  }
};

/**
 * 리스트 삭제
 * @param listId - 삭제할 리스트의 ID
 */
export const deleteList = async (listId: number): Promise<void> => {
  try {
    await apiV4.delete(`/list/${listId}`);
  } catch (error: unknown) {
    handleServiceError('deleting list', error);
    throw error;
  }
};

/**
 * 리스트 세부 정보 조회
 * @param listId - 조회할 리스트의 ID
 * @returns 리스트의 상세 정보
 */
export const getListDetails = async (listId: number): Promise<List> => {
  try {
    const response = await apiV4.get<List>(`/list/${listId}`, {
      params: {
        language: 'ko-KR',
      },
    });
    return response.data;
  } catch (error: unknown) {
    handleServiceError('fetching list details', error);
    throw error;
  }
};

/**
 * 리스트에 영화 또는 TV 시리즈 추가
 * @param listId - 리스트 ID
 * @param mediaId - 추가할 미디어 ID
 * @param mediaType - 미디어 타입 ('movie' 또는 'tv')
 * @returns 추가된 아이템의 응답 데이터
 */
export const addItemToList = async (
  listId: number,
  mediaId: number,
  mediaType: MediaType = MediaType.Movie
): Promise<AddItemToListResponse> => {
  if (!listId) {
    console.error('Invalid list ID:', listId);
    throw new Error('Invalid list ID');
  }

  const items: ListItem[] = [{ media_type: mediaType, media_id: mediaId }];
  console.log('Attempting to add item to list:', { listId, mediaId, mediaType, items });

  return modifyListItems(listId, items, ListAction.Add);
};

/**
 * 리스트에서 영화 또는 TV 시리즈 제거
 * @param listId - 리스트 ID
 * @param mediaId - 제거할 미디어 ID
 * @param mediaType - 미디어 타입 ('movie' 또는 'tv')
 * @returns 제거된 아이템의 응답 데이터
 */
export const removeItemFromList = async (
  listId: number, 
  mediaId: number, 
  mediaType: MediaType = MediaType.Movie
): Promise<AddItemToListResponse> => {
  const items: ListItem[] = [{ media_type: mediaType, media_id: mediaId }];
  return modifyListItems(listId, items, ListAction.Remove);
};

/**
 * 리스트 비우기 (모든 영화 또는 TV 시리즈 제거)
 * @param listId - 리스트 ID
 */
export const clearList = async (listId: number): Promise<void> => {
  try {
    const listDetails = await getListDetails(listId);
    const items: ListItem[] = listDetails.results.map(item => ({
      media_type: item.media_type as MediaType,
      media_id: item.media_id,
    }));

    if (items.length === 0) return; // 리스트가 이미 비어있다면 종료

    await modifyListItems(listId, items, ListAction.Remove);
  } catch (error: unknown) {
    handleServiceError('clearing list', error);
    throw error;
  }
};

/**
 * 리스트 항목 상태 확인 (특정 미디어가 리스트에 포함되어 있는지)
 * @param listId - 리스트 ID
 * @param mediaId - 미디어 ID (영화 또는 TV 쇼)
 * @param mediaType - 미디어 타입 ('movie' 또는 'tv')
 * @returns 특정 미디어가 리스트에 포함되어 있는지 여부
 */
export const checkItemStatus = async (
  listId: number,
  mediaId: number,
  mediaType: MediaType = MediaType.Movie
): Promise<boolean> => {
  try {
    const response = await apiV4.get<{ status: string }>(`/list/${listId}/item_status`, {
      params: {
        media_id: mediaId,
        media_type: mediaType,
      },
    });
    return response.data.status === 'present';
  } catch (error: unknown) {
    handleServiceError('checking item status', error);
    throw error;
  }
};

/**
 * 리스트 업데이트
 * @param listId - 업데이트할 리스트의 ID
 * @param name - 새로운 리스트 이름
 * @param description - 새로운 리스트 설명
 * @param isPublic - 리스트 공개 여부
 * @param sortBy - 리스트 정렬 기준
 * @param iso_639_1 - 언어 코드
 * @param iso_3166_1 - 국가 코드
 */
export const updateList = async (
  listId: number,
  name: string,
  description: string,
  isPublic: boolean = false,
  sortBy: string = 'original_order.asc',
  iso_639_1: string = 'ko',
  iso_3166_1: string = 'KR',
): Promise<void> => {
  try {
    await apiV4.put(`/list/${listId}`, {
      name,
      description,
      public: isPublic,
      sort_by: sortBy,
      iso_639_1,
      iso_3166_1,
    });
  } catch (error: unknown) {
    handleServiceError('updating list', error);
    throw error;
  }
};
