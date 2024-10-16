// movie-app/app/lists/create.tsx

import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import CreateListForm from '@/components/lists/CreateListForm';
import AddMoviesToList from '@/components/lists/AddMoviesToList';
import { theme } from '@/constants/theme';

const CreateListScreen: React.FC = () => {
  const router = useRouter();
  const [step, setStep] = useState(1); // 단계 상태 관리
  const [createdListId, setCreatedListId] = useState<number | null>(null);

  // Step 1 완료 후 호출되는 함수
  const handleListCreated = (listId: number) => {
    setCreatedListId(listId);
    setStep(2); // Step 2로 이동
  };

  // 모든 단계 완료 후 호출되는 함수
  const handleCompletion = () => {
    router.replace(`/lists/details?id=${createdListId}`);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {step === 1 && (
        <CreateListForm onSuccess={handleListCreated} />
      )}
      {step === 2 && createdListId && (
        <AddMoviesToList listId={createdListId} onComplete={handleCompletion} />
      )}
    </KeyboardAvoidingView>
  );
};

export default CreateListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
});
