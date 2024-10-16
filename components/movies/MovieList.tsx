import React from 'react';
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native';
import { Image } from 'expo-image';
import { theme } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { fallbackMoviePoster, getImageUrl } from '@/services/moviedb';

const { width, height } = Dimensions.get('window');

interface MovieItem {
  id: number;
  title: string;
  poster_path: string | null;  // poster_path can be null
}

interface MovieListProps {
  title: string;
  data: MovieItem[];
  hideSeeAll?: boolean;
  isGrid?: boolean;
}

const MovieList: React.FC<MovieListProps> = ({ title, data, hideSeeAll }) => {
  const router = useRouter();

  // Function to handle movie press
  const handlePress = (id: number) => {
    router.push({ pathname: '/movie', params: { id } });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {!hideSeeAll && (
          <TouchableOpacity>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {data.map((item, index) => (
          <TouchableWithoutFeedback key={item.id || index} onPress={() => handlePress(item.id)}>
            <View style={styles.movieContainer}>
              <Image
                source={{ uri: getImageUrl(item.poster_path, 'w185') || fallbackMoviePoster }}
                style={styles.image}
              />
              {/* <Text style={styles.movieName}>
                {item.title.length > 14 ? `${item.title.slice(0, 14)}...` : item.title}
              </Text> */}
            </View>
          </TouchableWithoutFeedback>
        ))}
      </ScrollView>
    </View>
  );
};

export default React.memo(MovieList);

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  header: {
    marginHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: theme.colors.gray,
    fontSize: 20,
    marginBottom: 12,
  },
  seeAll: {
    fontSize: 18,
    color: theme.colors.gray,
    marginBottom: 12,
  },
  scrollContainer: {
    paddingHorizontal: 15,
  },
  movieContainer: {
    marginLeft: 8,
    alignItems: 'center',
  },
  movieName: {
    marginVertical: 4,
    color: theme.colors.gray,
    fontSize: 12,
    textAlign: 'center',
  },
  image: {
    width: width * 0.26,
    height: height * 0.17,
    borderRadius: theme.radius.xs,
  },
});
