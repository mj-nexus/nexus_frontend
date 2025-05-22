import api from '../api/axiosInstance';

export const noticeService = {
    // 모든 공지사항 조회
    getNotices: async () => {
        try {
            const response = await api.get('/api/mjc-notices');
            return response.data;
        } catch (error) {
            console.error('공지사항 로딩 오류:', error);
            throw new Error('공지사항을 불러오는데 실패했습니다.');
        }
    },

    // 특정 공지사항 상세 조회
    getNoticeDetail: async (id) => {
        try {
            const response = await api.get(`/api/mjc-notices/${id}`);
            return response.data;
        } catch (error) {
            console.error('공지사항 상세 로딩 오류:', error);
            throw new Error('공지사항 상세정보를 불러오는데 실패했습니다.');
        }
    },

    // 최신 공지사항 5개 조회
    getLatestNotices: async () => {
        try {
            const response = await api.get('/api/mjc-notices/latest/list');
            return response.data;
        } catch (error) {
            console.error('최신 공지사항 로딩 오류:', error);
            throw new Error('최신 공지사항을 불러오는데 실패했습니다.');
        }
    },

    // 공지사항 크롤링 실행 (관리자용)
    crawlNotices: async () => {
        try {
            const response = await api.post('/api/mjc-notices/crawl');
            return response.data;
        } catch (error) {
            console.error('공지사항 크롤링 오류:', error);
            throw new Error('공지사항 크롤링에 실패했습니다.');
        }
    }
}; 