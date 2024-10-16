// movie-app/components/UserLists.tsx

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import useUserLists from '@/hooks/useUserLists';
import { theme } from '@/constants/theme';

const UserLists: React.FC = () => {
  const router = useRouter();
  const { data: userLists, isLoading, error } = useUserLists();

  if (isLoading) {
    return <ActivityIndicator size="large" color={theme.colors.primary} style={styles.loadingIndicator} />;
  }

  if (error) {
    return <Text style={styles.errorMessage}>리스트를 불러오는 중 오류가 발생했습니다.</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>내 리스트</Text>
        <TouchableOpacity onPress={() => router.push('/lists')}>
          <Text style={styles.linkText}>모든 리스트 보기</Text>
        </TouchableOpacity>
      </View>

      {userLists?.results?.slice(0, 3).map((list) => (
        <View key={list.id} style={styles.listItem}>
          <Text style={styles.listName}>{list.name}</Text>
          <Text style={styles.listDescription}>{list.description}</Text>
        </View>
      ))}

      {userLists?.results.length === 0 && (
        <Text style={styles.emptyMessage}>생성된 리스트가 없습니다.</Text>
      )}
    </View>
  );
};

export default UserLists;

const styles = StyleSheet.create({
  container: {
    marginBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  linkText: {
    color: theme.colors.primary,
    fontSize: 14,
  },
  listItem: {
    backgroundColor: theme.colors.inputBackground,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  listName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  listDescription: {
    fontSize: 14,
    color: theme.colors.textLight,
  },
  emptyMessage: {
    color: theme.colors.textLight,
    textAlign: 'center',
    marginTop: 16,
  },
  loadingIndicator: {
    marginVertical: 20,
  },
  errorMessage: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});
