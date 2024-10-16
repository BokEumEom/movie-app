// movie-app/components/UserMovies.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MovieList from '@/components/movies/MovieList';
import { theme } from '@/constants/theme';

interface UserMoviesProps {
  favoriteMovies?: any[];
  ratedMovies?: any[];
  watchlistMovies?: any[];
  isAuthenticated: boolean;
}

const UserMovies: React.FC<UserMoviesProps> = ({
  favoriteMovies = [],
  ratedMovies = [],
  watchlistMovies = [],
  isAuthenticated,
}) => {
  return (
    <>
      {/* Favorite Movies Section */}
      <View style={styles.moviesSection}>
        <Text style={styles.sectionTitle}>내가 찜한 영화</Text>
        {favoriteMovies.length > 0 ? (
          <View style={styles.moviesContainer}>
            <MovieList title="내가 찜한 영화" hideSeeAll={true} data={favoriteMovies} />
          </View>
        ) : (
          <Text style={styles.emptyMessage}>찜한 영화가 없습니다.</Text>
        )}
      </View>

      {/* Rated Movies Section */}
      <View style={styles.moviesSection}>
        <Text style={styles.sectionTitle}>내가 평가한 영화</Text>
        {ratedMovies.length > 0 ? (
          <View style={styles.moviesContainer}>
            <MovieList title="내가 평가한 영화" hideSeeAll={true} data={ratedMovies} />
          </View>
        ) : (
          <Text style={styles.emptyMessage}>평가한 영화가 없습니다.</Text>
        )}
      </View>

      {/* Watchlist Movies Section */}
      <View style={styles.moviesSection}>
        <Text style={styles.sectionTitle}>내 관심 목록</Text>
        {watchlistMovies.length > 0 ? (
          <View style={styles.moviesContainer}>
            <MovieList title="내 관심 목록" hideSeeAll={true} data={watchlistMovies} />
          </View>
        ) : (
          <Text style={styles.emptyMessage}>관심 목록이 비어 있습니다.</Text>
        )}
      </View>

      {/* No Movies Message for Authenticated Users */}
      {isAuthenticated &&
        favoriteMovies.length === 0 &&
        ratedMovies.length === 0 &&
        watchlistMovies.length === 0 && (
          <Text style={styles.noMoviesText}>저장된 영화가 없습니다.</Text>
        )}
    </>
  );
};

export default UserMovies;

const styles = StyleSheet.create({
  moviesSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 16,
  },
  moviesContainer: {
    marginBottom: 20,
  },
  emptyMessage: {
    color: theme.colors.textLight,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  noMoviesText: {
    color: theme.colors.textLight,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 30,
  },
});
