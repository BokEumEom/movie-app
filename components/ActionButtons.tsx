// movie-app/components/ActionButtons.tsx

import React, { memo } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { theme } from '@/constants/theme';
import {
  HeartIcon as HeartIconOutline,
  BookmarkIcon as BookmarkIconOutline,
  PlayIcon,
  ListBulletIcon as ListBulletIconOutline,
} from 'react-native-heroicons/outline';

import {
  HeartIcon as HeartIconSolid,
  BookmarkIcon as BookmarkIconSolid,
  ListBulletIcon as ListBulletIconSolid,
} from 'react-native-heroicons/solid';

interface ActionButtonsProps {
  isFavourite: boolean;
  onFavouritePress: () => void;
  isInWatchlist: boolean;
  onWatchlistPress: () => void;
  onTrailerPress: () => void;
  isTrailerAvailable?: boolean;
  onAddToListPress: () => void;
  isInList: boolean; // 리스트 포함 여부 상태 추가
}

interface ActionButtonProps {
  onPress: () => void;
  icon: React.ReactNode;
  label: string; // 텍스트 레이블 추가
  isActive?: boolean;
  accessibilityLabel: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  onPress,
  icon,
  label,
  isActive = false,
  accessibilityLabel,
}) => (
  <TouchableOpacity
    onPress={onPress}
    style={styles.actionButton}
    accessibilityLabel={accessibilityLabel}
    accessibilityRole="button"
    activeOpacity={0.7}
  >
    <View style={[styles.iconContainer, isActive && styles.activeIconContainer]}>
      {icon}
    </View>
    <Text style={styles.iconLabel}>{label}</Text>
  </TouchableOpacity>
);

const ActionButtons: React.FC<ActionButtonsProps> = memo(({
  isFavourite,
  onFavouritePress,
  isInWatchlist,
  onWatchlistPress,
  onTrailerPress,
  isTrailerAvailable = true,
  onAddToListPress,
  isInList,
}) => {
  return (
    <View style={styles.actionButtons}>
      {/* 리스트 추가하기 버튼 */}
      <ActionButton
        onPress={onAddToListPress}
        icon={
          isInList ? (
            <ListBulletIconSolid size={24} color={theme.colors.primary} />
          ) : (
            <ListBulletIconOutline size={24} color="white" />
          )
        }
        label="리스트 추가"
        isActive={isInList}
        accessibilityLabel="리스트 추가하기 버튼"
      />

      {/* 찜하기 버튼 */}
      <ActionButton
        onPress={onFavouritePress}
        icon={
          isFavourite ? (
            <HeartIconSolid size={24} color={theme.colors.primary} />
          ) : (
            <HeartIconOutline size={24} color="white" />
          )
        }
        label="찜하기"
        isActive={isFavourite}
        accessibilityLabel={isFavourite ? '찜하기 취소 버튼' : '찜하기 버튼'}
      />

      {/* 관심 목록 버튼 */}
      <ActionButton
        onPress={onWatchlistPress}
        icon={
          isInWatchlist ? (
            <BookmarkIconSolid size={24} color={theme.colors.primary} />
          ) : (
            <BookmarkIconOutline size={24} color="white" />
          )
        }
        label="관심목록"
        isActive={isInWatchlist}
        accessibilityLabel={isInWatchlist ? '관심 목록에서 제거 버튼' : '관심 목록에 추가 버튼'}
      />

      {/* 트레일러 보기 버튼 */}
      {isTrailerAvailable && (
        <ActionButton
          onPress={onTrailerPress}
          icon={<PlayIcon size={24} color="white" />}
          label="트레일러"
          accessibilityLabel="트레일러 보기 버튼"
        />
      )}
    </View>
  );
});

export default ActionButtons;

const styles = StyleSheet.create({
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
    flexWrap: 'wrap',
  },
  actionButton: {
    flexBasis: '20%', // 각 버튼이 부모 요소의 1/4 크기를 차지
    alignItems: 'center',
    marginHorizontal: 5,
    marginBottom: 10,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.actionButton || '#374151',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeIconContainer: {
    backgroundColor: theme.colors.activeButton || '#4B5563',
    borderWidth: 2,
    borderColor: theme.colors.primary, // 활성화된 버튼에 테두리 강조
  },
  iconLabel: {
    color: '#FFFFFF',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
});
