// movie-app/src/services/sessionStorage.ts

import * as SecureStore from 'expo-secure-store';

const STORAGE_KEYS = {
  SESSION_ID: 'session_id',
  ACCESS_TOKEN: 'user_access_token',
  REFRESH_TOKEN: 'refresh_token', // 일관된 키 네이밍
  ACCOUNT_ID: 'account_id',
};

/**
 * 아이템 저장
 */
const saveItem = async (key: keyof typeof STORAGE_KEYS, value: string) => {
  try {
    await SecureStore.setItemAsync(STORAGE_KEYS[key], value);
  } catch (error: any) {
    console.error(`Error saving ${key}:`, error.message);
    throw error;
  }
};

/**
 * 아이템 가져오기
 */
const getItem = async (key: keyof typeof STORAGE_KEYS): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(STORAGE_KEYS[key]);
  } catch (error: any) {
    console.error(`Error getting ${key}:`, error.message);
    return null;
  }
};

/**
 * 아이템 삭제
 */
const removeItem = async (key: keyof typeof STORAGE_KEYS): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(STORAGE_KEYS[key]);
  } catch (error: any) {
    console.error(`Error removing ${key}:`, error.message);
    throw error;
  }
};

// 세션 관리
export const saveSessionId = (sessionId: string) => saveItem('SESSION_ID', sessionId);
export const getSessionId = () => getItem('SESSION_ID');
export const removeSessionId = () => removeItem('SESSION_ID');

/**
 * 세션 삭제 함수 (일반 세션 ID와 게스트 세션 ID 모두 삭제)
 */
export const clearSession = async () => {
  try {
    await removeSessionId();
  } catch (error: any) {
    console.error('Error clearing session:', error.message);
    throw error;
  }
};

// 계정 관리
export const saveAccountId = async (accountId: string) => {
  await saveItem('ACCOUNT_ID', accountId);
};
export const getAccountId = () => getItem('ACCOUNT_ID');
export const removeAccountId = () => removeItem('ACCOUNT_ID');

// 토큰 관리
export const saveAccessToken = async (accessToken: string) => {
  await saveItem('ACCESS_TOKEN', accessToken);
};
export const saveRefreshToken = async (refreshToken: string) => {
  await saveItem('REFRESH_TOKEN', refreshToken);
};
export const saveTokens = async (accessToken: string, refreshToken: string) => {
  await saveAccessToken(accessToken);
  await saveRefreshToken(refreshToken);
};

export const getUserAccessToken = () => getItem('ACCESS_TOKEN');
export const getRefreshToken = () => getItem('REFRESH_TOKEN');

export const removeAccessToken = async () => {
  await removeItem('ACCESS_TOKEN');
};
export const removeRefreshToken = async () => {
  await removeItem('REFRESH_TOKEN');
};
export const removeTokens = async () => {
  await removeAccessToken();
  await removeRefreshToken();
};
