// movie-app/components/MovieListItem.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router'; // expo-router 사용
import { Movie } from '@/types';
import { theme } from '@/constants/theme';

interface MovieItemProps {
  movie: Movie;
  buttonText: string;
  loading: boolean;
  disabled: boolean;
}

const MovieListItem: React.FC<MovieItemProps> = ({
  movie,
  buttonText,
  loading,
  disabled,
}) => {
  const router = useRouter(); // router 훅 사용

  // 영화 상세 페이지로 이동하는 함수
  const handlePress = () => {
    router.push(`/movie?id=${movie.id}`); // 영화 ID를 경로에 전달
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.movieItem}>
      <Image
        source={
          movie.poster_path
            ? { uri: `https://image.tmdb.org/t/p/w200${movie.poster_path}` }
            : require('@/assets/images/failbackMovie.jpg')
        }
        style={styles.poster}
      />
      <View style={styles.movieInfo}>
        <Text style={styles.movieTitle}>{movie.title}</Text>
      </View>
      <TouchableOpacity
        onPress={handlePress}
        disabled={disabled}
        style={styles.addButton}
      >
        <Text style={styles.addButtonText}>{buttonText}</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
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
});

export default MovieListItem;
