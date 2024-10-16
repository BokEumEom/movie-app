// movie-app/components/EditListForm.tsx

import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  Switch, 
  KeyboardAvoidingView, 
  Platform, 
  Keyboard 
} from 'react-native';
import { updateList } from '@/services/listService';
import { theme } from '@/constants/theme';
import { showAlert } from '@/utils/showAlert';
import { List } from '@/types';

interface EditListFormProps {
  listDetails: List;
  onSuccess?: () => void;
}

const EditListForm: React.FC<EditListFormProps> = ({ listDetails, onSuccess }) => {
  const [name, setName] = useState<string>(listDetails.name || '');
  const [description, setDescription] = useState<string>(listDetails.description || '');
  const [isPublic, setIsPublic] = useState<boolean>(listDetails.public || false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpdateList = async () => {
    Keyboard.dismiss();

    // 유효성 검사
    if (!name.trim()) {
      setError('리스트 이름을 입력해주세요.');
      showAlert('유효성 검사 오류', '리스트 이름을 입력해주세요.');
      return;
    }

    if (!description.trim()) {
      setError('리스트 설명을 입력해주세요.');
      showAlert('유효성 검사 오류', '리스트 설명을 입력해주세요.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await updateList(listDetails.id, name, description, isPublic);
      showAlert('성공', '리스트가 업데이트되었습니다.');
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error('리스트 업데이트 오류:', error);
      const errorMessage = error.response?.data?.status_message || error.message || '리스트를 업데이트하는 중 오류가 발생했습니다.';
      showAlert('오류', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.keyboardAvoidingView}
    >
      <View style={styles.formContainer}>
        {/* 리스트 이름 입력 */}
        <Text style={styles.label}>리스트 이름</Text>
        <TextInput
          placeholder="리스트 이름 입력"
          value={name}
          onChangeText={setName}
          style={[styles.input, error && styles.inputError]}
          accessibilityLabel="리스트 이름 입력 필드"
        />
        {error === '리스트 이름을 입력해주세요.' && <Text style={styles.errorText}>{error}</Text>}

        {/* 리스트 설명 입력 */}
        <Text style={styles.label}>리스트 설명</Text>
        <TextInput
          placeholder="리스트 설명 입력"
          value={description}
          onChangeText={setDescription}
          style={[styles.input, styles.textArea, error && styles.inputError]}
          multiline
          numberOfLines={4}
          accessibilityLabel="리스트 설명 입력 필드"
        />
        {error === '리스트 설명을 입력해주세요.' && <Text style={styles.errorText}>{error}</Text>}

        {/* 공개 여부 스위치 */}
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>공개 리스트</Text>
          <Switch
            value={isPublic}
            onValueChange={setIsPublic}
            trackColor={{ false: theme.colors.mediumGray, true: theme.colors.primary }}
            thumbColor={isPublic ? theme.colors.accent : theme.colors.lightGray}
            accessibilityLabel="공개 리스트 여부 스위치"
          />
        </View>

        {/* 업데이트 버튼 */}
        {loading ? (
          <ActivityIndicator size="small" color={theme.colors.primary} style={styles.loadingIndicator} />
        ) : (
          <TouchableOpacity
            style={styles.updateButton}
            onPress={handleUpdateList}
            accessibilityLabel="리스트 업데이트 버튼"
            accessibilityRole="button"
          >
            <Text style={styles.updateButtonText}>리스트 업데이트</Text>
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

export default EditListForm;

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  formContainer: {
    padding: 16,
    backgroundColor: theme.colors.background,
  },
  label: {
    color: theme.colors.text,
    fontSize: 16,
    marginBottom: 4,
    marginTop: 12,
    fontWeight: '500',
  },
  input: {
    backgroundColor: theme.colors.inputBackground,
    color: theme.colors.text,
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  inputError: {
    borderColor: theme.colors.text,
    borderWidth: 1,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 12,
  },
  switchLabel: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '500',
  },
  updateButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  updateButtonText: {
    color: theme.colors.textOnPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  loadingIndicator: {
    marginTop: 24,
  },
  errorText: {
    color: theme.colors.text,
    fontSize: 14,
    marginTop: 4,
    marginBottom: 8,
  },
});
