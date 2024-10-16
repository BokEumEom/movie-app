// movie-app/app/(tabs)/profile.tsx

import React, { useContext } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { theme } from '@/constants/theme';
import Loading from '@/components/common/Loading';
import { AuthContext } from '@/contexts/AuthContext';
import useUserMovies from '@/hooks/useUserMovies';
import useGetAccountDetails from '@/hooks/useGetAccountDetails';
import UserProfile from '@/components/profile/UserProfile';
import UserLists from '@/components/profile/UserLists';
import UserMovies from '@/components/profile/UserMovies';
import ErrorMessage from '@/components/common/ErrorMessage';

const ProfileScreen: React.FC = () => {
  const { logout } = useContext(AuthContext);
  const router = useRouter();

  const { favoriteMovies, ratedMovies, watchlistMovies, isLoading: moviesLoading, isError: moviesError } = useUserMovies();
  const { data: accountDetails, isLoading: accountLoading, isError: accountError } = useGetAccountDetails();

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (moviesLoading || accountLoading) {
    return <Loading />;
  }

  if (moviesError || accountError) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ErrorMessage message="프로필 데이터를 가져오는 중 오류가 발생했습니다. 다시 시도해 주세요." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <UserProfile accountDetails={accountDetails} onLogout={handleLogout} />
        <UserLists />
        <UserMovies
          favoriteMovies={favoriteMovies}
          ratedMovies={ratedMovies}
          watchlistMovies={watchlistMovies}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
});
