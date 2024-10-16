// movie-app/components/TrendingMovies.tsx

import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  SharedValue,
} from 'react-native-reanimated';
import { theme } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { fallbackMoviePoster, getImageUrl } from '../../services/moviedb';
import { MovieItem } from '../../types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const ITEM_WIDTH = SCREEN_WIDTH * 0.9;
const ITEM_HEIGHT = SCREEN_HEIGHT / 1.75;
const PARALLAX_FACTOR = 0.1;

interface TrendingMoviesProps {
  data: MovieItem[];
}

const TrendingMovies: React.FC<TrendingMoviesProps> = ({ data }) => {
  const router = useRouter();
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  const handleClick = (item: MovieItem) => {
    router.push({ pathname: '/movie', params: { id: item.id } });
  };

  const renderItem = ({
    item,
    animationValue,
  }: {
    item: MovieItem;
    index: number;
    animationValue: SharedValue<number>;
  }) => (
    <MovieCard
      item={item}
      animationValue={animationValue}
      handleClick={handleClick}
    />
  );

  const animationStyle = useCallback((value: number) => {
    'worklet';
    const zIndex = interpolate(value, [-1, 0, 1], [10, 20, 30]);
    const translateX = interpolate(
      value,
      [-1, 0, 1],
      [-SCREEN_WIDTH, 0, SCREEN_WIDTH]
    );
    return {
      transform: [{ translateX }],
      zIndex,
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trending</Text>
      <Carousel
        data={data}
        renderItem={renderItem}
        width={ITEM_WIDTH}
        height={ITEM_HEIGHT}
        loop
        autoPlay={isAutoPlay}
        autoPlayInterval={4000}
        scrollAnimationDuration={1200}
        customAnimation={animationStyle}
        onSnapToItem={(index) => console.log('Current index:', index)}
        style={styles.carousel}
        pagingEnabled={true} // 페이지 단위로 스크롤되도록 설정
        snapEnabled={true} // 스냅 효과를 활성화하여 이미지가 중앙에 위치하도록 함
      />
    </View>
  );
};

export default React.memo(TrendingMovies);

interface MovieCardProps {
  item: MovieItem;
  animationValue: SharedValue<number>;
  handleClick: (item: MovieItem) => void;
}

const MovieCard: React.FC<MovieCardProps> = ({
  item,
  animationValue,
  handleClick,
}) => {
  const [imageUri, setImageUri] = useState<string | number>(
    getImageUrl(item.poster_path, 'w500') || fallbackMoviePoster
  );

  const handleImageError = () => {
    setImageUri(fallbackMoviePoster);
  };

  const maskStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      animationValue.value,
      [-1, 0, 1],
      ['#000000dd', 'transparent', '#000000dd']
    );
    return { backgroundColor };
  }, [animationValue]);

  const imageStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      animationValue.value,
      [-1, 0, 1],
      [ITEM_WIDTH * PARALLAX_FACTOR, 0, -ITEM_WIDTH * PARALLAX_FACTOR]
    );
    return { transform: [{ translateX }] };
  }, [animationValue]);

  return (
    <TouchableWithoutFeedback onPress={() => handleClick(item)}>
      <View style={styles.itemContainer}>
        <Animated.Image
          source={
            typeof imageUri === 'string' ? { uri: imageUri } : imageUri
          }
          style={[styles.image, imageStyle]}
          resizeMode="cover"
          onError={handleImageError}
        />
        <Animated.View
          pointerEvents="none"
          style={[styles.mask, maskStyle]}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  title: {
    color: theme.colors.gray,
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 16,
    marginBottom: 12,
  },
  carousel: {
    alignSelf: 'center', // Carousel 자체를 중앙에 위치시킴
  },
  itemContainer: {
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT,
    overflow: 'hidden',
    borderRadius: theme.radius.xs,
  },
  image: {
    width: ITEM_WIDTH + ITEM_WIDTH * PARALLAX_FACTOR * 0.2,
    height: '100%',
    // borderRadius: theme.radius.xs,
  },
  mask: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
