// app/movie.tsx

import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { theme } from '@/constants/theme';

import Cast from '@/components/movies/Cast';
import MovieList from '@/components/movies/MovieList';

import useFetchMovieDetails from '@/hooks/useFetchMovieDetails';
import useFetchSimilarMovies from '@/hooks/useFetchSimilarMovies';
import useAccountStatesHook from '@/hooks/useAccountStates';
import useFetchMovieVideos from '@/hooks/useFetchMovieVideos';
import { useMovieHandlers } from '@/hooks/useMovieHandlers';

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';

import Header from '@/components/common/Header';
import { AuthContext } from '@/contexts/AuthContext';
import PosterWithGradient from '@/components/movies/PosterWithGradient';
import ActionButtons from '@/components/ActionButtons';
import MovieRating from '@/components/movies/MovieRating';
import TrailerPlayer from '@/components/movies/TrailerPlayer';
import AddToListModal from '@/components/lists/AddToListModal';

const { width, height } = Dimensions.get('window');
const ios = Platform.OS === 'ios';

const ANIMATION_DURATION = 800;
const INITIAL_IMAGE_TRANSLATE_Y = height * 0.1;  // 화면 높이에 비례하여 초기값 설정

const MovieScreen: React.FC = () => {
  const params = useLocalSearchParams<{ id: string }>();
  const movieId = Number(params.id);
  const router = useRouter();
  const { isAuthenticated } = useContext(AuthContext);

  // React Query hooks
  const {
    movie,
    isLoading: movieLoading,
    isError: movieIsError,
    error: movieError,
  } = useFetchMovieDetails(movieId);
  const {
    similarMovies,
    isLoading: similarLoading,
    isError: similarIsError,
    error: similarError,
  } = useFetchSimilarMovies(movieId);
  const {
    isFavourite,
    setIsFavourite,
    inWatchlist,
    setInWatchlist,
    userRating,
    setUserRating,
    isLoading: accountLoading,
    isError: accountIsError,
    error: accountError,
  } = useAccountStatesHook(movieId);
  const {
    videos: movieVideos,
    isLoading: videosLoading,
    isError: videosIsError,
    error: videosError,
  } = useFetchMovieVideos(movieId);

  const {
    handleFavouritePress,
    handleWatchlistPress,
    handleRateMovie,
    handleDeleteRating,
  } = useMovieHandlers(
    movieId,
    isFavourite,
    setIsFavourite,
    inWatchlist,
    setInWatchlist,
    setUserRating
  );

  const loading = movieLoading || similarLoading || accountLoading;
  const isError = movieIsError || similarIsError || accountIsError;
  const error =
    movieError?.message ||
    similarError?.message ||
    accountError?.message ||
    null;

  // Reanimated shared values
  const imageTranslateY = useSharedValue(INITIAL_IMAGE_TRANSLATE_Y);
  const imageOpacity = useSharedValue(0);
  const contentOpacity = useSharedValue(0);

  useEffect(() => {
    if (!movieLoading && movie) {
      // 포스터 이미지 애니메이션
      imageTranslateY.value = withTiming(0, {
        duration: ANIMATION_DURATION,
        easing: Easing.out(Easing.exp),
      });
      imageOpacity.value = withTiming(1, {
        duration: ANIMATION_DURATION,
        easing: Easing.out(Easing.exp),
      });

      // 콘텐츠 애니메이션
      contentOpacity.value = withTiming(1, {
        duration: ANIMATION_DURATION,
        easing: Easing.out(Easing.exp),
        delay: 400,
      });
    }
  }, [movieLoading, movie]);

  const animatedImageStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: imageTranslateY.value }],
    opacity: imageOpacity.value,
  }));

  const animatedContentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
  }));

  // 슬라이더의 선택 값을 관리
  const [selectedRating, setSelectedRating] = useState<number>(userRating ?? 0);

  useEffect(() => {
    setSelectedRating(userRating ?? 0);
  }, [userRating]);

  // 모달 상태 관리
  const [modals, setModals] = useState({
    isTrailerVisible: false,
    isAddToListModalVisible: false,
  });

  const toggleModal = (modalName: keyof typeof modals, visible: boolean) => {
    setModals((prev) => ({ ...prev, [modalName]: visible }));
  };

  // 트레일러 비디오 준비
  const trailerVideo =
    movieVideos && movieVideos.length > 0 ? movieVideos[0] : null;

  // 핸들러 함수들
  const handleBackPress = (): void => {
    router.back();
  };

  const requireAuth = (action: () => Promise<void> | void) => {
    if (!isAuthenticated) {
      Alert.alert('로그인이 필요합니다.', '이 기능을 사용하려면 로그인해주세요.');
      return;
    }
    action();
  };

  const handleShowTrailer = (): void => {
    if (movieVideos && movieVideos.length > 0) {
      toggleModal('isTrailerVisible', true);
    } else {
      Alert.alert('트레일러 없음', '이 영화의 트레일러가 없습니다.');
    }
  };

  const handleCloseTrailer = (): void => {
    toggleModal('isTrailerVisible', false);
  };

  const openAddToListModal = (): void => {
    requireAuth(() => {
      toggleModal('isAddToListModalVisible', true);
    });
  };

  const handleCloseAddToListModal = (): void => {
    toggleModal('isAddToListModalVisible', false);
  };

  return (
    <View style={styles.container}>
      {/* Header 컴포넌트 사용 */}
      <Header
        isFavourite={isFavourite}
        onBackPress={handleBackPress}
        onFavouritePress={handleFavouritePress}
      />

      {loading ? (
        <ActivityIndicator
          size="large"
          color={theme.colors.primary}
          style={{ flex: 1 }}
        />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollView}>
          {/* 영화 포스터 */}
          {movie && (
            <PosterWithGradient
              movie={movie}
              animatedStyle={animatedImageStyle}
            />
          )}

          {/* 영화 상세 정보 */}
          <Animated.View
            style={[styles.contentContainer, animatedContentStyle]}
          >
            {isError && <Text style={styles.errorText}>{error}</Text>}

            {/* 제목 */}
            <Text
              style={styles.title}
              accessibilityLabel={`영화 제목: ${movie?.title || '알 수 없음'}`}
            >
              {movie?.title || '영화 제목'}
            </Text>

            {/* 상태, 개봉일, 러닝타임 */}
            <Text style={styles.status}>
              {movie
                ? `${movie.status} • ${new Date(
                    movie.release_date
                  ).getFullYear()} • ${Math.floor(
                    movie.runtime / 60
                  )}h ${movie.runtime % 60}m`
                : '로딩 중...'}
            </Text>

            {/* 장르 */}
            <View style={styles.genresContainer}>
              <Text style={styles.genre}>
                {movie?.genres
                  ?.map((genre) => genre.name)
                  .join(', ') || '장르 정보 없음'}
              </Text>
            </View>

            {/* 액션 버튼들 */}
            <ActionButtons
              isFavourite={isFavourite}
              onFavouritePress={handleFavouritePress}
              isInWatchlist={inWatchlist}
              onWatchlistPress={handleWatchlistPress}
              onTrailerPress={handleShowTrailer}
              isTrailerAvailable={Boolean(trailerVideo)}
              onAddToListPress={openAddToListModal}
              isInList={false} // 실제로 리스트에 포함되어 있는지 상태 관리 필요
            />

            {/* 평가 및 평가 삭제 */}
            <MovieRating
              initialRating={userRating}
              onRatingChange={(value) => setSelectedRating(value)}
              onSubmit={() => handleRateMovie(selectedRating)}
              onDelete={handleDeleteRating}
            />

            {/* 설명 */}
            <View style={styles.desc}>
              <Text style={styles.description}>
                {movie?.overview || '설명 정보 없음'}
              </Text>
            </View>

            {/* 출연진 */}
            <View style={styles.castContainer}>
              <Cast movieId={movieId} />
            </View>

            {/* 비슷한 영화 */}
            {similarMovies && similarMovies.length > 0 && (
              <View style={styles.movieListContainer}>
                <MovieList
                  title="비슷한 영화"
                  hideSeeAll={true}
                  data={similarMovies}
                />
              </View>
            )}
          </Animated.View>
        </ScrollView>
      )}

      {/* Trailer Player Modal */}
      <TrailerPlayer
        visible={modals.isTrailerVisible}
        video={trailerVideo}
        onClose={handleCloseTrailer}
      />

      {/* Add to List Modal */}
      <AddToListModal
        visible={modals.isAddToListModalVisible}
        movieId={movieId}
        onClose={handleCloseAddToListModal}
      />
    </View>
  );
};

export default MovieScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  scrollView: {
    paddingBottom: 20,
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    marginTop: -60,
    alignItems: 'center',
    width: '100%',
  },
  title: {
    color: theme.colors.text,
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 1.5,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 12,
  },
  status: {
    color: theme.colors.gray,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginVertical: 8,
  },
  genresContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  genre: {
    color: theme.colors.gray,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  desc: {
    marginVertical: 10,
    marginHorizontal: 16,
    width: '90%',
  },
  description: {
    color: '#9CA3AF',
    letterSpacing: 1,
  },
  castContainer: {
    marginBottom: 16,
    width: '100%',
  },
  movieListContainer: {
    marginTop: 4,
    width: '100%',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 10,
  },
});
