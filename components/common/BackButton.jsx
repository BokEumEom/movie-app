// movie-app/components/BackButton.jsx
import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { ChevronLeftIcon, HeartIcon } from 'react-native-heroicons/solid';
import { theme } from '@/constants/theme';
import { useRouter } from 'expo-router';

export default function BackButton({ isFavourite = false, toggleFavourite = null }) {
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={toggleFavourite ? () => toggleFavourite(!isFavourite) : () => router.back()}
      activeOpacity={0.7}
      style={[theme.background, styles.backButton]}
    >
      {toggleFavourite ? (
        <HeartIcon size={30} color={isFavourite ? theme.background : 'white'} />
      ) : (
        <ChevronLeftIcon size={28} strokeWidth={2.5} color="white" />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  backButton: {
    borderRadius: 12, // rounded-xl
    padding: 4, // p-1
    backgroundColor: theme.colors.dark,
  },
});
