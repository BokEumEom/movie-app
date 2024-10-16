// movie-app/components/AddToListModal.tsx

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { 
  Modal, 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator, 
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Image,
} from 'react-native';
import { addItemToList, removeItemFromList } from '@/services/listService';
import { List, Movie, MediaType } from '@/types';
import { showAlert } from '@/utils/showAlert';
import { searchMovies } from '@/services/moviedb';
import { theme } from '@/constants/theme';
import { debounce } from 'lodash';
import CreateListForm from '@/components/lists/CreateListForm';
import MovieItem from '../movies/MovieItem';

interface AddToListModalProps {
  visible: boolean;
  onClose: () => void;
}

const AddToListModal: React.FC<AddToListModalProps> = ({ visible, onClose }) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [createdListId, setCreatedListId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [addedMovies, setAddedMovies] = useState<Movie[]>([]); // 추가된 영화 저장
  const [addingMovieIds, setAddingMovieIds] = useState<Set<number>>(new Set());
  const [movieLoading, setMovieLoading] = useState<boolean>(false);

  // Debounced Search for Moviesre
  const debouncedSearch = useMemo(
    () => debounce(async (query: string) => {
      if (!query.trim()) {
        setSearchResults([]);
        return setMovieLoading(false);
      }
      setMovieLoading(true);
      try {
        const data = await searchMovies(query);
        setSearchResults(data?.results ?? []);
      } catch (error) {
        console.error('Search error:', error);
        showAlert('오류', '영화 검색 중 오류가 발생했습니다.');
      } finally {
        setMovieLoading(false);
      }
    }, 500),
    []
  );  

  useEffect(() => {
    if (currentStep === 2) {
      debouncedSearch(searchQuery);
    }
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchQuery, currentStep, debouncedSearch]);

  // Handle adding movie to the created list
  const handleAddMovie = async (movieId: number, movie: Movie) => {
    if (!createdListId) {
      console.error('Cannot add movie: List ID is not defined.');
      return;
    }
  
    console.log('Attempting to add a movie to list ID:', createdListId);
    setAddingMovieIds((prev) => new Set(prev).add(movieId));
    try {
      await addItemToList(createdListId, movieId, MediaType.Movie);
      showAlert('성공', '영화가 리스트에 추가되었습니다.');
      setAddedMovies((prev) => [...prev, movie]); // 추가된 영화 저장
    } catch (error: any) {
      console.error('영화 추가 오류:', error);
      showAlert('오류', error.response?.data?.status_message || '영화를 리스트에 추가하는 중 오류가 발생했습니다.');
    } finally {
      setAddingMovieIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(movieId);
        return newSet;
      });
    }
  };

  // Handle removing movie from the created list
  const handleRemoveMovie = async (movieId: number) => {
    if (!createdListId) {
      console.error('Cannot remove movie: List ID is not defined.');
      return;
    }

    try {
      await removeItemFromList(createdListId, movieId, MediaType.Movie);
      showAlert('성공', '영화가 리스트에서 제거되었습니다.');
      setAddedMovies((prev) => prev.filter((movie) => movie.id !== movieId)); // 삭제된 영화 제거
    } catch (error: any) {
      console.error('영화 삭제 오류:', error);
      showAlert('오류', error.response?.data?.status_message || '영화를 리스트에서 삭제하는 중 오류가 발생했습니다.');
    }
  };

  // Handle successful list creation
  const handleCreateListSuccess = useCallback((listId: number) => {
    console.log('List created successfully with ID:', listId);
    setCreatedListId(listId);
    setCurrentStep(2);
    showAlert('성공', '새로운 리스트가 생성되었습니다. 이제 영화를 추가하세요.');
  }, []);

  // 완료 버튼 클릭 시 상태 초기화 및 모달 닫기
  const handleComplete = () => {
    setCreatedListId(null);
    setCurrentStep(1);
    setSearchQuery('');
    setSearchResults([]);
    setAddedMovies([]); // 추가된 영화 목록 초기화
    onClose();
  };

  // Render movie item for search results
  const renderMovieItem = useCallback(
    ({ item }: { item: Movie }) => {
      const isAdding = addingMovieIds.has(item.id);
      const isAdded = addedMovies.some((movie) => movie.id === item.id);
  
      return (
        <MovieItem
          movie={item}
          onPress={() => handleAddMovie(item.id, item)}
          buttonText={isAdded ? '추가됨' : '추가'}
          loading={isAdding}
          disabled={isAdded}
        />
      );
    },
    [addingMovieIds, addedMovies, handleAddMovie]
  );

  // Render added movie item for added movie list
  const renderAddedMovieItem = useCallback(({ item }: { item: Movie }) => (
    <View style={styles.movieItem}>
      <Image
        source={
          item.poster_path
            ? { uri: `https://image.tmdb.org/t/p/w200${item.poster_path}` }
            : require('@/assets/images/failbackMovie.jpg')
        }
        style={styles.poster}
        accessibilityLabel={`${item.title} 포스터`}
      />
      <View style={styles.movieInfo}>
        <Text style={styles.movieTitle}>{item.title}</Text>
      </View>
      <TouchableOpacity
        onPress={() => handleRemoveMovie(item.id)}
        accessibilityLabel={`${item.title} 삭제 버튼`}
        accessibilityHint="이 영화를 리스트에서 제거합니다."
        accessibilityRole="button"
        style={styles.removeButton}
      >
        <Text style={styles.removeButtonText}>삭제</Text>
      </TouchableOpacity>
    </View>
  ), [handleRemoveMovie]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContainer}>
            {currentStep === 1 && (
              <>
                <Text style={styles.modalTitle}>리스트 만들기 (Step 1)</Text>
                <CreateListForm onSuccess={handleCreateListSuccess} />
              </>
            )}

            {currentStep === 2 && createdListId !== null && (
              <>
                <Text style={styles.modalTitle}>영화 추가하기 (Step 2)</Text>
                <TextInput
                  placeholder="영화 제목으로 검색"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  style={styles.searchInput}
                  accessibilityLabel="영화 검색 입력"
                  autoCapitalize="none"
                  returnKeyType="search"
                />
                {movieLoading ? (
                  <ActivityIndicator size="large" color={theme.colors.primary} style={styles.loadingIndicator} />
                ) : (
                  <FlatList
                    data={searchResults}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderMovieItem}
                    ListEmptyComponent={<Text style={styles.emptyText}>검색 결과가 없습니다.</Text>}
                    accessibilityLabel="영화 검색 결과 목록"
                  />
                )}

                {/* 추가된 영화 목록 */}
                <Text style={styles.sectionTitle}>추가된 영화 목록</Text>
                <FlatList
                  data={addedMovies}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={renderAddedMovieItem}
                  ListEmptyComponent={<Text style={styles.emptyText}>추가된 영화가 없습니다.</Text>}
                  accessibilityLabel="추가된 영화 목록"
                />

                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => setCurrentStep(1)}
                  accessibilityLabel="이전 단계로 돌아가기"
                  accessibilityRole="button"
                >
                  <Text style={styles.backButtonText}>이전</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.completeButton} 
                  onPress={handleComplete}
                  accessibilityLabel="리스트 추가 완료"
                  accessibilityRole="button"
                >
                  <Text style={styles.completeButtonText}>리스트 추가 완료</Text>
                </TouchableOpacity>
              </>
            )}

            <TouchableOpacity 
              style={styles.closeButton}
              onPress={handleComplete}
              accessibilityLabel="모달 닫기 버튼"
              accessibilityRole="button"
            >
              <Text style={styles.closeButtonText}>닫기</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default AddToListModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: theme.colors.overlayBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: theme.colors.background,
    borderRadius: 10,
    padding: 16,
  },
  modalTitle: {
    fontSize: 20,
    color: theme.colors.text,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  searchInput: {
    backgroundColor: theme.colors.inputBackground,
    color: theme.colors.text,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
  },
  loadingIndicator: {
    marginVertical: 20,
  },
  movieItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: theme.colors.inputBackground,
    borderRadius: 8,
    padding: 8,
  },
  poster: {
    width: 60,
    height: 90,
    borderRadius: 4,
    marginRight: 12,
  },
  movieInfo: {
    flex: 1,
  },
  movieTitle: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  addButton: {
    padding: 8,
  },
  addButtonText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  emptyText: {
    color: theme.colors.textLight,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  backButton: {
    marginTop: 12,
    backgroundColor: theme.colors.lightGray,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  backButtonText: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  completeButton: {
    marginTop: 10,
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  completeButtonText: {
    color: theme.colors.textOnPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    marginTop: 10,
    alignSelf: 'center',
  },
  closeButtonText: {
    color: theme.colors.primary,
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    color: theme.colors.text,
    fontWeight: 'bold',
    marginTop: 20,
  },
  removeButton: {
    padding: 8,
    backgroundColor: theme.colors.text,
    borderRadius: 4,
  },
  removeButtonText: {
    color: theme.colors.textOnPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
});
