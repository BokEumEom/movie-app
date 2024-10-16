// movie-app/app/lists/edit.tsx

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { theme } from '@/constants/theme';
import { getListDetails, updateList } from '@/services/listService';
import EditListForm from '@/components/lists/EditListForm';

const ListEditScreen: React.FC = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const listId = Number(id);

  const [loading, setLoading] = useState(true);
  const [listDetails, setListDetails] = useState<any>(null);

  useEffect(() => {
    const fetchListDetails = async () => {
      try {
        const details = await getListDetails(listId);
        setListDetails(details);
      } catch (error: any) {
        Alert.alert('오류', '리스트 정보를 가져오는 중 오류가 발생했습니다.');
        router.back();
      } finally {
        setLoading(false);
      }
    };

    fetchListDetails();
  }, [listId]);

  const handleSuccess = () => {
    router.replace(`/lists/details?id=${listId}`);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <EditListForm listDetails={listDetails} onSuccess={handleSuccess} />
    </KeyboardAvoidingView>
  );
};

export default ListEditScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
