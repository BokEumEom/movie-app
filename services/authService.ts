// movie-app/services/authService.ts

import api from './apiV3';
import { Linking } from 'react-native';
import * as AuthSession from 'expo-auth-session';
import { saveSessionId, saveGuestSessionId } from './sessionStorage';
import { showAlert } from '@/utils/showAlert';

const redirectUri = AuthSession.makeRedirectUri({
  native: 'myapp://redirect', // 실제 리다이렉트 URI로 교체하세요
  useProxy: true,
});

/**
 * 요청 토큰 생성 함수
 */
export const createRequestToken = async (): Promise<string> => {
  try {
    const response = await api.get('/authentication/token/new');
    const { request_token } = response.data;
    return request_token;
  } catch (error: any) {
    console.error('Error creating request token:', error.message);
    showAlert('오류', '요청 토큰 생성에 실패했습니다.');
    throw error;
  }
};

/**
 * 사용자 인증 함수
 * @param requestToken - 생성된 요청 토큰
 */
export const authenticateUser = async (requestToken: string): Promise<void> => {
  try {
    const authUrl = `https://www.themoviedb.org/authenticate/${requestToken}?redirect_to=${encodeURIComponent(
      redirectUri
    )}`;
    await Linking.openURL(authUrl);
  } catch (error: any) {
    console.error('Error authenticating user:', error.message);
    showAlert('오류', '사용자 인증에 실패했습니다.');
    throw error;
  }
};

/**
 * 세션 ID 생성 함수
 * @param requestToken - 인증된 요청 토큰
 */
export const createSessionId = async (requestToken: string): Promise<string> => {
  try {
    const response = await api.post('/authentication/session/new', {
      request_token: requestToken,
    });
    const { session_id } = response.data;
    await saveSessionId(session_id);
    showAlert('성공', '세션이 생성되었습니다.');
    return session_id;
  } catch (error: any) {
    console.error('Error creating session ID:', error.message);
    showAlert('오류', '세션 ID 생성에 실패했습니다.');
    throw error;
  }
};

/**
 * 게스트 세션 생성 함수
 */
export const createGuestSession = async (): Promise<string> => {
  try {
    const response = await api.get('/authentication/guest_session/new');
    const { guest_session_id, expires_at } = response.data;
    await saveGuestSessionId(guest_session_id);
    showAlert('성공', '게스트 세션이 생성되었습니다.');
    return guest_session_id;
  } catch (error: any) {
    console.error('Error creating guest session:', error.message);
    showAlert('오류', '게스트 세션 생성에 실패했습니다.');
    throw error;
  }
};
