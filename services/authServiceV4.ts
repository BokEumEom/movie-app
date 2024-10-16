// movie-app/services/authServiceV4.ts

import apiV4 from './apiV4';
import { makeRedirectUri } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { showAlert } from '@/utils/showAlert';
import { saveAccessToken, saveSessionId } from './sessionStorage'; // saveSessionId 추가
import { v4ApiToken, apiKey } from '@/constants'; // apiKey 임포트

WebBrowser.maybeCompleteAuthSession();

export const authenticateUser = async (): Promise<string | null> => {
  try {
    // 리디렉션 URI 생성
    const redirectUri = makeRedirectUri({
      useProxy: true,
    });

    // 1. 요청 토큰 생성
    const requestTokenResponse = await fetch('https://api.themoviedb.org/4/auth/request_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        Authorization: `Bearer ${v4ApiToken}`, // v4ApiToken 사용
      },
      body: JSON.stringify({
        redirect_to: redirectUri, // 리디렉션 URI 포함
      }),
    });

    const { request_token, success } = await requestTokenResponse.json();

    if (!success || !request_token) {
      showAlert('오류', '요청 토큰을 가져올 수 없습니다. 다시 시도해주세요.');
      return null;
    }

    // 2. 사용자 승인 URL 생성
    const authUrl = `https://www.themoviedb.org/auth/access?request_token=${request_token}`;

    // 3. 사용자 승인 시작
    const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);

    if (result.type === 'success' && result.url) {
      // 4. 액세스 토큰 교환
      const accessTokenResponse = await fetch('https://api.themoviedb.org/4/auth/access_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          Authorization: `Bearer ${v4ApiToken}`, // v4ApiToken 사용
        },
        body: JSON.stringify({
          request_token,
        }),
      });

      const { access_token, success: accessSuccess } = await accessTokenResponse.json();

      if (accessSuccess && access_token) {
        // 액세스 토큰 저장
        await saveAccessToken(access_token);

        // 5. v3 session_id 생성
        const sessionResponse = await fetch(`https://api.themoviedb.org/3/authentication/session/convert/4?api_key=${apiKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json;charset=utf-8',
          },
          body: JSON.stringify({
            access_token,
          }),
        });

        const { session_id, success: sessionSuccess } = await sessionResponse.json();

        if (sessionSuccess && session_id) {
          // session_id 저장
          await saveSessionId(session_id);
          return access_token;
        } else {
          showAlert('오류', '세션 ID를 가져올 수 없습니다. 다시 시도해주세요.');
          return null;
        }
      } else {
        showAlert('오류', '액세스 토큰을 가져올 수 없습니다. 다시 시도해주세요.');
        return null;
      }
    } else {
      showAlert('오류', '사용자 승인이 취소되었습니다. 다시 시도해주세요.');
      return null;
    }
  } catch (error) {
    console.error('인증 오류:', error);
    showAlert('오류', '인증 중 오류가 발생했습니다. 다시 시도해주세요.');
    return null;
  }
};