// axiosInstance.js
import axios from 'axios';
import { decodeJwtToken } from '../utils/jwtUtil';

const instance = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_HOST}`,
  withCredentials: true // 모든 요청에 쿠키 포함 (리프레시 토큰 전송에 필요)
});

// 토큰 갱신 시 재시도 중인지 체크하는 플래그
let isRefreshing = false;
// 토큰 갱신 중에 대기 중인 요청 큐
let failedQueue = [];

// 대기 중인 요청을 처리하는 함수
const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// 요청 인터셉터
instance.interceptors.request.use((config) => {
  // 토큰 갱신 요청에는 Authorization 헤더를 추가하지 않음 (무한 루프 방지)
  if (config.url === '/api/user/refresh-token') {
    return config;
  }
  
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// 응답 인터셉터
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // 리프레시 토큰 요청 자체가 실패하면 무한 루프 방지를 위해 바로 에러 반환
    if (originalRequest.url === '/api/user/refresh-token') {
      return Promise.reject(error);
    }

    // 토큰 만료로 인한 401 에러이고, 재시도되지 않은 요청인 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      // 토큰 갱신이 이미 진행 중인 경우, 해당 요청을 큐에 추가
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return instance(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // 리프레시 토큰은 쿠키에 있으므로 별도의 토큰 전송 없이 요청
        const response = await instance.post('/api/user/refresh-token');
        
        // 새 액세스 토큰 저장
        const { accessToken } = response.data;
        
        if (!accessToken) {
          throw new Error('리프레시 토큰 응답에 액세스 토큰이 없습니다.');
        }
        
        // 토큰 검증
        const decodedToken = decodeJwtToken(accessToken);
        if (!decodedToken) {
          throw new Error('새로 발급된 액세스 토큰이 유효하지 않습니다.');
        }
        
        console.log('새 토큰 발급 성공:', { 
          exp: decodedToken.exp ? new Date(decodedToken.exp * 1000).toLocaleString() : '없음'
        });
        
        localStorage.setItem('accessToken', accessToken);
        
        // 대기 중인 요청 처리
        processQueue(null, accessToken);
        
        // 원래 요청 재시도
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        return instance(originalRequest);
      } catch (refreshError) {
        // 자세한 오류 로깅
        console.error('토큰 갱신 실패:', refreshError.response?.data || refreshError.message);
        
        // 리프레시 토큰도 만료된 경우 로그아웃 처리
        processQueue(refreshError, null);
        
        // localStorage에서 토큰 제거
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userId');
        localStorage.removeItem('name');
        
        // 세션 만료 알림
        alert('세션이 만료되었습니다. 다시 로그인해주세요.');
        
        // 로그인 페이지로 리다이렉트
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
