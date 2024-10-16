// state/moviesState.ts - 상태 정의
import { observable } from '@legendapp/state';

// 전역 상태 정의
export const moviesState = observable({
  searchQuery: '',
  searchResults: [],
  addedMovies: [],
  currentStep: 1,
  loading: false,
  createdListId: null as number | null,
});
