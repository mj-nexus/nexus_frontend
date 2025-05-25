import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axiosInstance';
import { decodeJwtToken } from '../utils/jwtUtil';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // 추가

  // 토큰 갱신 함수 추가
  const refreshToken = useCallback(async () => {
    try {
      const response = await api.post('/api/user/refresh-token');
      const newAccessToken = response.data.accessToken;
      
      if (newAccessToken) {
        localStorage.setItem('accessToken', newAccessToken);
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('토큰 갱신 실패:', error);
      return false;
    }
  }, []);

  // logout 함수를 useCallback으로 정의해 의존성 문제 해결
  const logout = useCallback(async () => {
    try {
      // 서버에 로그아웃 요청 보내기 (리프레시 토큰 삭제 포함)
      await api.post('/api/user/logout', {}, { withCredentials: true });
      console.log('서버 로그아웃 성공 (액세스 토큰 및 리프레시 토큰 삭제)');
    } catch (error) {
      console.error('서버 로그아웃 실패:', error);
    } finally {
      // 로컬 스토리지에서 데이터 삭제
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userId');
      localStorage.removeItem('name');
      // 상태 업데이트
      setIsAuthenticated(false);
      setUserId(null);
    }
  }, []);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('accessToken');
      const storedUserId = localStorage.getItem('userId');
      
      if (token) {
        // 토큰 디코딩 및 확인
        const decodedToken = decodeJwtToken(token);
        if (decodedToken) {
          // 객체 형태로 간결하게 출력, 시간표 정보 제외
          const { student_id, iat, exp } = decodedToken;
          console.log('저장된 JWT 토큰 정보:', { student_id, iat, exp });
          
          // 토큰 만료 확인
          const currentTime = Math.floor(Date.now() / 1000);
          
          if (exp && exp < currentTime) {
            console.warn('토큰이 만료되었습니다. 갱신 시도 중...');
            // 자동 토큰 갱신 시도
            const refreshed = await refreshToken();
            if (!refreshed) {
              console.warn('토큰 갱신 실패. 로그아웃 처리합니다.');
              await logout();
            } else {
              console.log('토큰 갱신 성공');
              setIsAuthenticated(true);
              setUserId(storedUserId);
            }
          } else {
            setIsAuthenticated(true);
            setUserId(storedUserId);
          }
        } else {
          console.warn('유효하지 않은 토큰 형식입니다.');
        }
      }
      
      setIsLoading(false); // 로딩 끝
    };
    
    checkAuthStatus();
  }, [logout, refreshToken]);

  const login = (token, id, name) => {
    localStorage.setItem('accessToken', token);
    localStorage.setItem('userId', id);
    localStorage.setItem('name', name);
    setIsAuthenticated(true);
    setUserId(id);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userId, login, logout, refreshToken, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};