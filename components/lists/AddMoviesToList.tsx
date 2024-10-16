// movie-app/components/AddMoviesToList.tsx

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import MovieSearch from '@/components/MovieSearch';
import { Movie } from '@/types';
import useAddMovieToList from '@/hooks/useAddMovieToList';
import { theme } from '@/constants/theme';

interface AddMoviesToListProps {
  listId: number;
  onComplete: () => void;
  modalVisible: boolean;
  onClose: () => void;
}

const AddMoviesToList: React.FC<AddMoviesToListProps> = ({
  listId,
  onComplete,
  modalVisible,
  onClose,
}) => {
  const [selectedMovies, setSelectedMovies] = useState<Movie[]>([]);
  const { mutate: addMovieToList, isLoading: addingMovieLoading } = useAddMovieToList();

  const handleMovieSelect = useCallback(
    (movie: Movie) => {
      setSelectedMovies((prevSelected) =>
        prevSelected.some((m) => m.id === movie.id)
          ? prevSelected.filter((m) => m.id !== movie.id) // 이미 선택된 경우 제거
          : [...prevSelected, movie] // 선택되지 않은 경우 추가
      );
    },
    []
  );

  const handleAddMovies = () => {
    selectedMovies.forEach((movie) => addMovieToList({ listId, movieId: movie.id }));
    setSelectedMovies([]);
    onComplete();
    onClose(); // 완료 시 모달 닫기
  };

  return (
    <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <KeyboardAvoidingView
          style={styles.modalContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.content}>
            {/* 헤더 */}
            <View style={styles.header}>
              <Text style={styles.headerText}>영화 추가</Text>
              <TouchableOpacity onPress={onClose}>
                <Text style={styles.closeButton}>닫기</Text>
              </TouchableOpacity>
            </View>

            {/* 영화 검색 */}
            <MovieSearch
              onMovieSelect={handleMovieSelect}
              selectedMovieIds={new Set(selectedMovies.map((movie) => movie.id))}
              placeholder="영화 검색..."
            />

            {/* 선택된 영화 표시 */}
            {selectedMovies.length > 0 && (
              <ScrollView horizontal style={styles.selectedMoviesContainer}>
                {selectedMovies.map((movie) => (
                  <View key={movie.id} style={styles.selectedMovie}>
                    <Text style={styles.selectedMovieTitle}>{movie.title}</Text>
                  </View>
                ))}
              </ScrollView>
            )}

            {/* 전체 추가 버튼 */}
            <TouchableOpacity
              style={styles.addAllButton}
              onPress={handleAddMovies}
              disabled={addingMovieLoading || selectedMovies.length === 0}
            >
              {addingMovieLoading ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Text style={styles.addAllButtonText}>선택한 영화 추가</Text>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

export default AddMoviesToList;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end', // 하단에서 시작
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // 반투명 배경
  },
  modalContainer: {
    height: '80%', // 모달이 화면의 80%까지만 올라오도록 설정
    width: '100%',
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  closeButton: {
    color: theme.colors.primary,
    fontSize: 16,
  },
  selectedMoviesContainer: {
    marginTop: 10,
    marginBottom: 10,
    flexDirection: 'row',
  },
  selectedMovie: {
    backgroundColor: theme.colors.primary,
    padding: 10,
    borderRadius: 8,
    marginRight: 8,
  },
  selectedMovieTitle: {
    color: theme.colors.textOnPrimary,
    fontWeight: 'bold',
  },
  addAllButton: {
    backgroundColor: theme.colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  addAllButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
