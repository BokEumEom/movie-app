import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  Keyboard,
} from 'react-native';
import { searchMovies } from '@/services/moviedb';
import { Movie } from '@/types';
import { theme } from '@/constants/theme';
import { debounce } from 'lodash';

interface MovieSearchProps {
  onMovieSelect: (movie: Movie) => void;
  placeholder?: string;
  selectedMovieIds?: Set<number>;
  searchQuery?: string;
  onSearchQueryChange?: (query: string) => void;
  showSearchInput?: boolean;
}

const MovieSearch: React.FC<MovieSearchProps> = ({
  onMovieSelect,
  placeholder = '영화 검색...',
  selectedMovieIds = new Set(),
  searchQuery: externalSearchQuery,
  onSearchQueryChange,
  showSearchInput = true,
}) => {
  const [internalSearchQuery, setInternalSearchQuery] = useState<string>('');
  const searchQuery = externalSearchQuery ?? internalSearchQuery;
  const setSearchQuery = onSearchQueryChange ?? setInternalSearchQuery;

  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (!query.trim()) {
        setResults([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const data = await searchMovies(query);
        setResults(data?.results ?? []);
      } catch (error: any) {
        setError('영화 검색 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    }, 500),
    []
  );

  useEffect(() => {
    debouncedSearch(searchQuery);
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchQuery, debouncedSearch]);

  const renderMovieItem = useCallback(
    ({ item }: { item: Movie }) => (
      <TouchableOpacity
        onPress={() => onMovieSelect(item)}
        style={styles.movieItem}
        disabled={selectedMovieIds.has(item.id)}
        accessibilityLabel={`${item.title} 선택`}
        accessibilityRole="button"
      >
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
          <Text style={styles.movieOverview} numberOfLines={2}>
            {item.overview || '설명이 없습니다.'}
          </Text>
        </View>
        {selectedMovieIds.has(item.id) && <Text style={styles.addedText}>추가됨</Text>}
      </TouchableOpacity>
    ),
    [onMovieSelect, selectedMovieIds]
  );

  return (
    <View style={styles.container}>
      {showSearchInput && (
        <TextInput
          placeholder={placeholder}
          value={searchQuery}
          onChangeText={(text) => {
            setSearchQuery(text);
            Keyboard.dismiss(); // Dismiss keyboard on search
          }}
          style={styles.searchInput}
          autoCapitalize="none"
          returnKeyType="search"
        />
      )}
      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} style={styles.loadingIndicator} />
      ) : error ? (
        <Text style={styles.errorMessage}>{error}</Text>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderMovieItem}
          ListEmptyComponent={
            searchQuery ? (
              <Text style={styles.emptyMessage}>검색 결과가 없습니다.</Text>
            ) : (
              <Text style={styles.emptyMessage}>검색어를 입력하세요.</Text>
            )
          }
        />
      )}
    </View>
  );
};

export default MovieSearch;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchInput: {
    backgroundColor: theme.colors.inputBackground,
    color: theme.colors.text,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
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
  movieOverview: {
    color: theme.colors.textLight,
    fontSize: 14,
    marginTop: 4,
  },
  addedText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  emptyMessage: {
    color: theme.colors.textLight,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  errorMessage: {
    color: theme.colors.text,
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
  },
});
