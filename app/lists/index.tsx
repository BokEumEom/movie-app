// movie-app/app/lists/index.tsx
import React, { useCallback } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Alert, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { PlusCircleIcon } from 'react-native-heroicons/solid';
import useUserLists from '@/hooks/useUserLists';
import { useQueryClient } from '@tanstack/react-query';
import ListCard from '@/components/lists/ListCard';
import FloatingButton from '@/components/common/FloatingButton';
import { deleteList } from '@/services/listService';

const ListScreen: React.FC = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: userLists, isLoading, error } = useUserLists();

  const confirmDeleteList = useCallback(async (listId: number) => {
    const previousLists = queryClient.getQueryData(['userLists']);
    queryClient.setQueryData(['userLists'], (old) =>
      old ? old.filter((list) => list.id !== listId) : []
    );

    try {
      await deleteList(listId);
      Alert.alert('성공', '리스트가 삭제되었습니다.');
    } catch (error) {
      queryClient.setQueryData(['userLists'], previousLists);
      Alert.alert('오류', '리스트 삭제 중 오류가 발생했습니다.');
    }
  }, [queryClient]);

  if (isLoading) return <ActivityIndicator size="large" color="#1D4ED8" style={styles.centered} />;
  if (error) return <Text style={styles.errorText}>리스트를 불러오는 중 오류가 발생했습니다.</Text>;

  return (
    <View style={styles.container}>
      <FlatList
        data={userLists?.results || []}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ListCard
            list={item}
            onPress={() => router.push(`/lists/details?id=${item.id}`)}
            onDelete={() => confirmDeleteList(item.id)}
          />
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>리스트가 없습니다.</Text>}
        contentContainerStyle={styles.content}
      />
      <FloatingButton
        icon={<PlusCircleIcon size={24} color="#ffffff" />}
        onPress={() => router.push('/lists/create')}
        label="리스트 생성"
      />
    </View>
  );
};

export default ListScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111827' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { color: 'red', textAlign: 'center', marginTop: 20, fontSize: 16 },
  emptyText: { color: '#9CA3AF', textAlign: 'center', marginTop: 20, fontSize: 16 },
  content: { padding: 16 },
});
