// src/services/boardService.js
import api from '../api/axiosInstance';

export const boardService = {
    getBoards: async (page = 1, limit = 10) => {
        try {
            const response = await api.get(`/board`);
            return response.data;
        } catch (error) {
            throw new Error('게시글을 불러오는데 실패했습니다.');
        }
    },

    getMyBoard: async (userId) => {
        try {
            const response = await api.get(`/board/my/${userId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getBoardDetail: async (boardId) => {
        try {
            const response = await api.get(`/board/${boardId}`);
            return response.data;
        } catch (error) {
            throw new Error('게시글을 불러오는데 실패했습니다.');
        }
    },

    searchBoards: async (searchTerm, page = 1, limit = 10) => {
        try {
            const response = await api.get(
                `/boards/search?term=${searchTerm}&page=${page}&limit=${limit}`
            );
            return response.data;
        } catch (error) {
            throw new Error('게시글 검색에 실패했습니다.');
        }
    },

    deleteBoard: async (boardId) => {
        try {
            const response = await api.delete(`/board/${boardId}`);
            return response.data;
        } catch (error) {
            throw new Error('게시글 삭제에 실패했습니다.');
        }
    },
    writeBoard: async (boardData) => {
        try {
            console.log(boardData);
            const response = await api.post('/board', boardData);
            return response.data;
        } catch (error) {
            throw new Error('게시글 작성에 실패했습니다.'); 
        }
    }
};