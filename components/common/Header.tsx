// movie-app/components/Header.tsx

import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeftIcon } from 'react-native-heroicons/outline';
import { HeartIcon } from 'react-native-heroicons/solid';
import { theme } from '@/constants/theme';

interface HeaderProps {
  onBackPress: () => void;
  showFavourite?: boolean;
  isFavourite?: boolean;
  onFavouritePress?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  onBackPress,
  showFavourite = false,
  isFavourite = false,
  onFavouritePress,
}) => {
  return (
    <SafeAreaView style={styles.headerContainer}>
      <TouchableOpacity
        onPress={onBackPress}
        activeOpacity={0.7}
        style={[styles.button]}
        accessibilityLabel="뒤로 가기"
        accessibilityRole="button"
      >
        <ChevronLeftIcon size={28} strokeWidth={2.5} color="white" />
      </TouchableOpacity>
      {showFavourite && (
        <TouchableOpacity
          onPress={onFavouritePress}
          style={[styles.button]}
          accessibilityLabel="즐겨찾기"
          accessibilityRole="button"
        >
          <HeartIcon size={30} color={isFavourite ? theme.colors.primary : 'white'} />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

export default Header;

const styles = StyleSheet.create({
  headerContainer: {
    position: 'absolute',
    zIndex: 20,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: 'transparent',
  },
  button: {
    borderRadius: 12,
    padding: 4,
    backgroundColor: theme.colors.dark,
  },
});
