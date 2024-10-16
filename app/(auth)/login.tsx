// movie-app/app/login.tsx

import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, ImageBackground } from 'react-native';
import { AuthContext } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { showAlert } from '@/utils/showAlert';

const LoginScreen = () => {
  const { loading, login } = useContext(AuthContext);
  const router = useRouter();

  // TMDB 로그인 핸들러
  const handleLogin = async () => {
    try {
      await login();
      router.replace('/');
    } catch (error: any) {
      console.error('Login error:', error.message);
      showAlert('로그인 오류', '로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('@/assets/images/movieBackground.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.9)']}
          style={styles.overlay}
        >
          <View style={styles.content}>
            <Text style={styles.title}>Welcome to Movie App</Text>
            <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Login with TMDB</Text>}
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  content: {
    alignItems: 'center',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#E11D48',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: '60%',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
});
