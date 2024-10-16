// movie-app/contexts/AuthContext.tsx

import React, { createContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { User } from '@/types';
import { showAlert } from '@/utils/showAlert';
import { authenticateUser } from '@/services/authServiceV4';
import { getSessionId, clearSession, removeAccessToken } from '@/services/sessionStorage';

interface AuthContextProps {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps>({
  isAuthenticated: false,
  user: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const loadSession = async () => {
    setLoading(true);
    try {
      const sessionId = await getSessionId();
      if (sessionId) {
        setIsAuthenticated(true);
        setUser(null); // 사용자 정보가 필요하면 추가 API 호출 필요
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error: any) {
      console.error('Error loading session:', error.message);
      showAlert('오류', '세션을 로드하는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSession();
  }, []);

  const login = async () => {
    setLoading(true);
    try {
      const accessToken = await authenticateUser();
      if (accessToken) {
        setIsAuthenticated(true);
        setUser(null); // 사용자 정보가 필요하면 추가 API 호출 필요
        showAlert('성공', '로그인에 성공했습니다.');
      } else {
        setIsAuthenticated(false);
        setUser(null);
        showAlert('오류', '로그인에 실패했습니다.');
      }
    } catch (error: any) {
      console.error('Error during login:', error.message);
      setIsAuthenticated(false);
      setUser(null);
      showAlert('오류', '로그인 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await clearSession();
      await removeAccessToken();
      setIsAuthenticated(false);
      setUser(null);
      showAlert('성공', '로그아웃 되었습니다.');
    } catch (error: any) {
      console.error('Error during logout:', error.message);
      showAlert('오류', '로그아웃 중 오류가 발생했습니다.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const contextValue = useMemo(
    () => ({
      isAuthenticated,
      user,
      loading,
      login,
      logout,
    }),
    [isAuthenticated, user, loading]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};
