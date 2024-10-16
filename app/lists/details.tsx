// movie-app/app/lists/details.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getListDetails, removeItemFromList } from '@/services/listService';
import { Movie } from '@/types';
import MovieItem from '@/components/movies/MovieItem';
import FloatingButton from '@/components/common/FloatingButton';

const ListDetailsScreen: React.FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const listId = Number(id);
  const [list, setList] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchListDetails = async () => {
    try {
      const data = await getListDetails(listId);
      setList(data.results);
    } catch (error) {
      Alert.alert('오류', '리스트를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListDetails();
  }, [listId]);

  const handleRemoveMovie = useCallback(async (movieId: number) => {
    try {
      await removeItemFromList(listId, movieId);
      setList((prev) => prev.filter((movie) => movie.id !== movieId));
      Alert.alert('성공', '영화가 제거되었습니다.');
    } catch {
      Alert.alert('오류', '영화를 제거하는 중 오류가 발생했습니다.');
    }
  }, [listId]);

  if (loading) return <Text>Loading...</Text>;

  return (
    <View style={styles.container}>
      <FlatList
        data={list}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <MovieItem movie={item} onRemove={() => handleRemoveMovie(item.id)} />
        )}
      />
      <FloatingButton
        icon={<Text style={{ color: '#fff' }}>+</Text>}
        onPress={() => router.push(`/search?listId=${listId}`)}
        label="영화 추가"
      />
    </View>
  );
};

export default ListDetailsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111827', padding: 16 },
});
