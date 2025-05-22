import api from "../api/axiosInstance";

export const getUserInfo = async () => {
    try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            throw new Error('사용자 ID를 찾을 수 없습니다');
        }
        const response = await api.get(`/api/user/getUserById/${userId}`);
        return response.data;
    } catch (error) {
        console.error('사용자 정보를 가져오는 중 오류 발생:', error);
        throw error;
    }
}