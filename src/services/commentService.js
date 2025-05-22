import api from '../api/axiosInstance';

// 댓글 생성
export const createComment = (board_id, user_id, content) =>
  api.post('/api/comments', { board_id, user_id, content });

// 게시글별 댓글 목록 조회
export const getCommentsByBoard = (board_id) =>
  api.get(`/api/comments/board/${board_id}`);

// 댓글 단일 조회
export const getComment = (comment_id) =>
  api.get(`/api/comments/${comment_id}`);

// 댓글 수정
export const updateComment = (comment_id, content) =>
  api.patch(`/api/comments/${comment_id}`, { content });

// 댓글 삭제 (soft delete)
export const deleteComment = (comment_id) =>
  api.delete(`/api/comments/${comment_id}`); 