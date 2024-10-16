// components/PosterWithGradient.tsx

import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { fallbackMoviePoster, getImageUrl } from '@/services/moviedb';
import { Movie } from '@/types';

const { width, height } = Dimensions.get('window');

interface PosterWithGradientProps {
  movie: Movie;
  animatedStyle: any;
}

const PosterWithGradient: React.FC<PosterWithGradientProps> = ({ movie, animatedStyle }) => {
  return (
    <View style={styles.fullWidth}>
      {movie && (
        <Animated.View style={animatedStyle}>
          <Image
            source={{
              uri: getImageUrl(movie.poster_path, 'w500') || fallbackMoviePoster,
            }}
            style={styles.image}
            accessibilityLabel={`${movie.title} 포스터`}
          />
          <LinearGradient
            colors={[
              'transparent',
              'rgba(23,23,23,0.6)',
              'rgba(23,23,23,0.9)',
              'rgba(23,23,23,1)',
            ]}
            style={styles.linearGradient}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
          />
        </Animated.View>
      )}
    </View>
  );
};

export default PosterWithGradient;

const styles = StyleSheet.create({
  fullWidth: {
    width: '100%',
  },
  linearGradient: {
    position: 'absolute',
    bottom: 0,
    height: height * 0.12,
    width: width,
  },
  image: {
    width: width,
    height: height * 0.55,
  },
});
