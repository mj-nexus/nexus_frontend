import axios from 'axios';
import api from '../api/axiosInstance';

const BASE_URL = '/api/senior-board';

export const seniorBoardService = {
  // 전체 조회
  getBoards: () => api.get(BASE_URL),

  // 단일 조회
  getBoard: (id) => api.get(`${BASE_URL}/${id}`),

  // 생성
  createBoard: (data) => api.post(BASE_URL, data),

  // 수정
  updateBoard: (id, data) => api.put(`${BASE_URL}/${id}`, data),

  // 삭제
  deleteBoard: (id) => api.delete(`${BASE_URL}/${id}`),

  // 좋아요
  like: (board_id, user_id) => api.post(`${BASE_URL}/like`, { board_id, user_id }),

  // 좋아요 취소
  unlike: (board_id, user_id) => api.post(`${BASE_URL}/unlike`, { board_id, user_id }),
}; 