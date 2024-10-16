// movie-app/components/CreateListForm.tsx

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Keyboard, Switch } from 'react-native';
import { createList } from '@/services/listService';
import { showAlert } from '@/utils/showAlert';
import { theme } from '@/constants/theme';
import { PlusCircleIcon } from 'react-native-heroicons/solid';
import { List } from '@/types';
import DropDownPicker, { ItemType } from 'react-native-dropdown-picker'; // DropDownPicker import

interface CreateListFormProps {
  onSuccess?: (listId: number) => void;
  onCancel?: () => void;
}

const CreateListForm: React.FC<CreateListFormProps> = ({ onSuccess, onCancel }) => {
  const [listName, setListName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [isPublic, setIsPublic] = useState<boolean>(false);
  const [showComments, setShowComments] = useState<boolean>(false);
  const [sortByValue, setSortByValue] = useState<string>('Original Ascending');
  const [loading, setLoading] = useState<boolean>(false);

  // DropDownPicker 관련 상태
  const [sortByOpen, setSortByOpen] = useState<boolean>(false);
  const [sortByItems, setSortByItems] = useState<ItemType[]>([
    { label: 'Original Ascending', value: 'Original Ascending' },
    { label: 'Original Descending', value: 'Original Descending' },
    { label: 'Rating Ascending', value: 'Rating Ascending' },
    { label: 'Rating Descending', value: 'Rating Descending' },
    { label: 'Release Date Ascending', value: 'Release Date Ascending' },
    { label: 'Release Date Descending', value: 'Release Date Descending' },
    { label: 'Primary Release Date Ascending', value: 'Primary Release Date Ascending' },
    { label: 'Primary Release Date Descending', value: 'Primary Release Date Descending' },
    { label: 'Title (A-Z)', value: 'Title (A-Z)' },
    { label: 'Title (Z-A)', value: 'Title (Z-A)' },
  ]);

  const handleCreateList = async () => {
    Keyboard.dismiss();

    if (!listName.trim() || !description.trim()) {
      showAlert('유효성 검사 오류', '모든 필드를 입력해주세요.');
      return;
    }

    setLoading(true);

    try {
      const newList: List = await createList(listName, description, isPublic, showComments, sortByValue);
      console.log('Successfully created list:', newList);
      showAlert('성공', '새로운 리스트가 생성되었습니다.');
      // 상태 초기화
      setListName('');
      setDescription('');
      setIsPublic(false);
      setShowComments(false);
      setSortByValue('Original Ascending');
      setSortByOpen(false);

      if (onSuccess) {
        console.log('Calling onSuccess with list ID:', newList.id);
        onSuccess(newList.id); // 생성된 리스트의 ID를 반환
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.status_message || error.message || '리스트를 생성하는 중 오류가 발생했습니다.';
      showAlert('오류', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.formContainer}>
      <Text style={styles.label}>이름</Text>
      <TextInput
        placeholder="리스트 이름 입력"
        value={listName}
        onChangeText={setListName}
        style={styles.input}
        accessibilityLabel="새 리스트 이름 입력"
      />

      <Text style={styles.label}>설명</Text>
      <TextInput
        placeholder="리스트 설명 입력"
        value={description}
        onChangeText={setDescription}
        style={[styles.input, styles.textArea]}
        multiline
        numberOfLines={4}
        accessibilityLabel="새 리스트 설명 입력"
      />

      {/* 공개 리스트 스위치 */}
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

      {/* 댓글 표시 스위치 */}
      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>댓글 표시</Text>
        <Switch
          value={showComments}
          onValueChange={setShowComments}
          trackColor={{ false: theme.colors.mediumGray, true: theme.colors.primary }}
          thumbColor={showComments ? theme.colors.accent : theme.colors.lightGray}
          accessibilityLabel="댓글 표시 여부 스위치"
        />
      </View>

      {/* 정렬 기준 DropDownPicker 추가 */}
      <View style={styles.dropdownContainer}>
        <Text style={styles.label}>정렬 기준</Text>
        <DropDownPicker
          open={sortByOpen}
          value={sortByValue}
          items={sortByItems}
          setOpen={setSortByOpen}
          setValue={setSortByValue}
          setItems={setSortByItems}
          style={styles.dropdownStyle}
          dropDownContainerStyle={styles.dropdownBox}
          labelStyle={styles.dropdownLabel}
          listItemLabelStyle={styles.dropdownItemLabel}
          selectedItemLabelStyle={styles.dropdownSelectedItemLabel}
          placeholder="정렬 기준 선택"
          placeholderStyle={styles.dropdownPlaceholder}
          zIndex={1000}
          zIndexInverse={3000}
          accessibilityLabel="정렬 기준 선택 드롭다운"
        />
      </View>

      {/* 리스트 생성 버튼 */}
      {loading ? (
        <ActivityIndicator size="small" color={theme.colors.primary} />
      ) : (
        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreateList}
          accessibilityLabel="새 리스트 생성"
          accessibilityRole="button"
        >
          <PlusCircleIcon size={24} color={theme.colors.white} style={styles.createIcon} />
          <Text style={styles.createButtonText}>리스트 생성</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default CreateListForm;

const styles = StyleSheet.create({
  formContainer: {
    marginTop: 20,
    zIndex: 1000, // DropDownPicker가 모달 내에서 제대로 표시되도록 zIndex 설정
  },
  label: {
    color: theme.colors.gray,
    fontSize: 16,
    marginBottom: 4,
    marginTop: 12,
    fontWeight: '500',
  },
  switchLabel: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '500',
  },
  input: {
    backgroundColor: theme.colors.inputBackground,
    color: theme.colors.text,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  dropdownContainer: {
    marginBottom: 12,
    zIndex: 1000, // DropDownPicker가 다른 컴포넌트 위에 표시되도록 zIndex 설정
  },
  dropdownStyle: {
    backgroundColor: theme.colors.inputBackground,
    borderColor: theme.colors.border,
  },
  dropdownBox: {
    backgroundColor: theme.colors.inputBackground,
    borderColor: theme.colors.border,
  },
  dropdownLabel: {
    color: theme.colors.white,
    fontSize: 16,
  },
  dropdownItemLabel: {
    color: theme.colors.white,
    fontSize: 14,
  },
  dropdownSelectedItemLabel: {
    color: theme.colors.accent,
    fontWeight: 'bold',
  },
  dropdownPlaceholder: {
    color: theme.colors.gray,
    fontSize: 16,
  },
  createButton: {
    flexDirection: 'row',
    backgroundColor: theme.colors.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  createIcon: {
    marginRight: 8,
  },
  createButtonText: {
    color: theme.colors.textOnPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
