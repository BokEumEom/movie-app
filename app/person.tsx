// movie-app/app/person.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { theme } from '@/constants/theme';
import { Image } from 'expo-image';
import MovieList from '@/components/movies/MovieList';
import Loading from '@/components/common/Loading';
import { useFetchPersonDetails } from '@/hooks/useFetchPersonDetails';
import { useFetchPersonMovies } from '@/hooks/useFetchPersonMovies';
import { getImageUrl, fallbackPersonImage } from '@/services/moviedb';
import Header from '@/components/common/Header';

const { width, height } = Dimensions.get('window');
const ios = Platform.OS === 'ios';

const Person = () => {
  const router = useRouter();
  const { personId } = useLocalSearchParams();
  const id = Number(personId);
  const [isFavourite, setIsFavourite] = useState(false);

  // Use the custom hooks with React Query
  const { data: person, isLoading: personLoading, error: personError } = useFetchPersonDetails(id);
  const { data: movies, isLoading: moviesLoading, error: moviesError } = useFetchPersonMovies(id);

  const loading = personLoading || moviesLoading;
  const error = personError || moviesError;

  const handleBackPress = () => {
    router.back();
  };

  const handleFavouritePress = () => {
    setIsFavourite(!isFavourite);
  };

  return (
    <View style={styles.container}>
      <Header
        isFavourite={isFavourite}
        onBackPress={handleBackPress}
        onFavouritePress={handleFavouritePress}
      />

      <ScrollView
        contentContainerStyle={{ paddingBottom: 20 }}
        style={styles.scrollView}
      >
        {loading ? (
          <Loading />
        ) : error ? (
          <Text style={styles.errorText}>{error.message}</Text>
        ) : person ? (
          <View>
            <View style={styles.castItem}>
              <Image
                source={
                  person.profile_path
                    ? { uri: getImageUrl(person.profile_path, 'w500') }
                    : { uri: 'https://via.placeholder.com/500x750?text=No+Image' }
                }
                style={styles.castImage}
              />
            </View>

            <View>
              <Text style={styles.name}>{person.name}</Text>
              <Text style={styles.location}>{person.place_of_birth || '알 수 없음'}</Text>
            </View>

            <View style={styles.infoContainer}>
              <View style={styles.infoBox}>
                <Text style={styles.infoTitle}>성별</Text>
                <Text style={styles.infoText}>
                  {person.gender === 1 ? '여성' : person.gender === 2 ? '남성' : '알 수 없음'}
                </Text>
              </View>
              <View style={styles.infoBox}>
                <Text style={styles.infoTitle}>생일</Text>
                <Text style={styles.infoText}>{person.birthday || '알 수 없음'}</Text>
              </View>
              <View style={styles.infoBox}>
                <Text style={styles.infoTitle}>직업</Text>
                <Text style={styles.infoText}>{person.known_for_department || '알 수 없음'}</Text>
              </View>
              <View style={styles.popularity}>
                <Text style={styles.infoTitle}>인기도</Text>
                <Text style={styles.infoText}>{person.popularity.toFixed(2)}</Text>
              </View>
            </View>

            <View style={styles.description}>
              <Text style={styles.subtitle}>전기</Text>
              <Text style={styles.biography}>
                {person.biography || '전기 정보가 없습니다.'}
              </Text>
            </View>

            {movies && movies.length > 0 && (
              <MovieList title="출연 작품" hideSeeAll={true} data={movies} />
            )}
          </View>
        ) : (
          <Text style={styles.errorText}>인물 정보를 불러올 수 없습니다.</Text>
        )}
      </ScrollView>
    </View>
  );
};

export default Person;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  scrollView: {
    flex: 1,
  },
  castItem: {
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: 'gray',
    shadowRadius: 40,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 1,
    marginTop: 120,
  },
  castImage: {
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#6B7280',
    width: width * 0.74,
    height: height * 0.43,
    borderRadius: theme.radius.lg,
  },
  name: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 24,
  },
  location: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    backgroundColor: '#374151',
    marginHorizontal: 12,
    paddingVertical: 16,
    paddingHorizontal: 8,
    marginTop: 24,
    borderRadius: 16,
  },
  infoBox: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: '#9CA3AF',
    paddingHorizontal: 8,
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoTitle: {
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
  },
  infoText: {
    color: '#D1D5DB',
    fontSize: 14,
    textAlign: 'center',
  },
  popularity: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  description: {
    marginVertical: 24,
    marginHorizontal: 16,
  },
  subtitle: {
    color: 'white',
    fontSize: 18,
    marginBottom: 8,
  },
  biography: {
    color: '#9CA3AF',
    letterSpacing: 1,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 10,
  },
});
