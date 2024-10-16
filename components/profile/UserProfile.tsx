// movie-app/components/UserProfile.tsx

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '@/constants/theme';

interface UserProfileProps {
  accountDetails: { username: string } | null;
  onLogout: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ accountDetails, onLogout }) => (
  <View style={styles.profileContainer}>
    {accountDetails ? (
      <>
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>{accountDetails.username.charAt(0).toUpperCase()}</Text>
        </View>
        <Text style={styles.username}>{accountDetails.username}</Text>
      </>
    ) : (
      <Text style={styles.errorText}>사용자 정보를 불러올 수 없습니다.</Text>
    )}
    <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
      <Text style={styles.logoutButtonText}>로그아웃</Text>
    </TouchableOpacity>
  </View>
);

export default UserProfile;

const styles = StyleSheet.create({
  profileContainer: {
    alignItems: 'center',
    marginVertical: 40,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: 'bold',
  },
  username: {
    marginTop: 12,
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  logoutButton: {
    marginTop: 16,
    backgroundColor: '#E50914',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  errorText: {
    color: '#FF0000',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
});
