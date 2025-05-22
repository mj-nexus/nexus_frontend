// src/services/boardService.js
import api from '../api/axiosInstance';

export const boardService = {
    getBoards: async (page = 1, limit = 10) => {
        try {
            const response = await api.get(`/board?page=${page}&limit=${limit}`);
            return response.data;
        } catch (error) {
            console.error('게시글 로딩 오류:', error);
            throw new Error('게시글을 불러오는데 실패했습니다.');
        }
    },

    getMyBoard: async (userId) => {
        try {
            const response = await api.get(`/board/my/${userId}`);
            return response.data;
        } catch (error) {
            console.error('내 게시글 로딩 오류:', error);
            throw new Error('내 게시글을 불러오는데 실패했습니다.');
        }
    },

    getBoardDetail: async (boardId) => {
        try {
            const response = await api.get(`/board/${boardId}`);
            return response.data;
        } catch (error) {
            console.error('게시글 상세 로딩 오류:', error);
            throw new Error('게시글을 불러오는데 실패했습니다.');
        }
    },

    searchBoards: async (searchTerm, page = 1, limit = 10, searchType = 'title') => {
        try {
            const response = await api.get(
                `/board/search?keyword=${searchTerm}&searchType=${searchType}&page=${page}&limit=${limit}`
            );
            return response.data;
        } catch (error) {
            console.error('게시글 검색 오류:', error);
            throw new Error('게시글 검색에 실패했습니다.');
        }
    },

    deleteBoard: async (boardId) => {
        try {
            const response = await api.delete(`/board/${boardId}`);
            return response.data;
        } catch (error) {
            console.error('게시글 삭제 오류:', error);
            throw new Error('게시글 삭제에 실패했습니다.');
        }
    },
    
    writeBoard: async (boardData) => {
        try {
            const response = await api.post('/board', boardData);
            return response.data;
        } catch (error) {
            console.error('게시글 작성 오류:', error);
            throw new Error('게시글 작성에 실패했습니다.'); 
        }
    },
    
    updateBoard: async (boardId, boardData) => {
        try {
            const response = await api.put(`/board/${boardId}`, boardData);
            return response.data;
        } catch (error) {
            console.error('게시글 수정 오류:', error);
            throw new Error('게시글 수정에 실패했습니다.');
        }
    }
};