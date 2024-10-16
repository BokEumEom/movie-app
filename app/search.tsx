// movie-app/app/search.tsx

import React, { useState, useCallback } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Keyboard,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import MovieSearch from '@/components/MovieSearch';
import { Movie } from '@/types';
import { theme } from '@/constants/theme';
import Header from '@/components/common/Header';
import { debounce } from 'lodash';

export default function SearchScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Debounce the search query updates to limit API calls
  const debouncedSetSearchQuery = useCallback(debounce((query) => {
    setSearchQuery(query);
  }, 500), []);

  const handleMovieSelect = (movie: Movie) => {
    Keyboard.dismiss();  // Dismiss keyboard on movie selection
    router.push({ pathname: 'movie', params: { id: movie.id } });
  };

  const handleBackPress = () => {
    router.back();
    Keyboard.dismiss();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header onBackPress={handleBackPress} />
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="영화 검색"
          placeholderTextColor="#9E9E9E"  // Accessible color
          style={styles.textInput}
          value={searchQuery}
          onChangeText={debouncedSetSearchQuery}  // Debounced search input
          autoFocus
          accessibilityLabel="Search for a movie"  // Accessibility label
        />
      </View>
      <View style={styles.container}>
        <MovieSearch
          onMovieSelect={handleMovieSelect}
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          showSearchInput={false}
          selectedMovieIds={new Set()}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
  searchContainer: {
    marginTop: 60, // Adjust based on Header height
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  textInput: {
    backgroundColor: theme.colors.inputBackground,
    color: 'white',
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    borderRadius: 50,
    fontSize: 16,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
});
