// movie-app/components/Cast.tsx

import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { theme } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { getImageUrl, fallbackPersonImage } from '../../services/moviedb';
import useFetchMovieCredits from '../../hooks/useFetchMovieCredits';

interface CastProps {
  movieId: number;
}

const Cast: React.FC<CastProps> = ({ movieId }) => {
  const { cast, loading, error } = useFetchMovieCredits(movieId);
  const router = useRouter();

  if (loading) {
    return <Text style={styles.loadingText}>캐스트 정보를 불러오는 중...</Text>;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  if (!cast || cast.length === 0) {
    return <Text style={styles.noCastText}>출연진 정보가 없습니다.</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>주요 출연진</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 15 }}
      >
        {cast.map((person) => {
          const personName = person.name;
          const characterName = person.character;

          return (
            <TouchableOpacity
              key={person.id}
              style={styles.castItem}
              onPress={() => router.push({ pathname: '/person', params: { personId: person.id } })}
            >
              <View style={styles.castImage}>
                <Image
                  source={
                    person.profile_path
                      ? { uri: getImageUrl(person.profile_path, 'w185') }
                      : { uri: 'https://via.placeholder.com/500x750?text=No+Image' }
                  }
                  style={[styles.image, { width: 90, height: 90 }]}
                />
              </View>
              <Text style={styles.characterName}>
                {characterName.length > 10 ? characterName.slice(0, 10) + '...' : characterName}
              </Text>
              <Text style={styles.personName}>
                {personName.length > 10 ? personName.slice(0, 10) + '...' : personName}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default Cast;

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
  },
  heading: {
    color: 'white',
    fontSize: 18,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  castImage: {
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#6B7280',
    borderRadius: theme.radius.xs,
    overflow: 'hidden',
  },
  castItem: {
    marginRight: 6,
    alignItems: 'center',
  },
  characterName: {
    color: 'white',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  personName: {
    color: '#A0AEC0',
    fontSize: 12,
    marginTop: 2,
    textAlign: 'center',
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: theme.radius.xs,
  },
  loadingText: {
    color: 'white',
    textAlign: 'center',
    marginVertical: 10,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 10,
  },
  noCastText: {
    color: 'white',
    textAlign: 'center',
    marginVertical: 10,
  },
});
