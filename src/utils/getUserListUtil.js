import api from "../api/axiosInstance";

export const getUserList = async () => {
    try {
        const response = await api.get("/api/user/getAll");
        // API 응답에서 데이터 추출 (response.data가 이미 배열인 경우를 고려)
        const data = Array.isArray(response.data) ? response.data : response.data.data;
        return data || [];
    } catch (error) {
        console.error("사용자 목록을 가져오는 중 오류 발생:", error);
        return [];
    }
};
