import api from "../api/axiosInstance";

export const messageService = {
  getChatIdList: async (userId) => {
    try {
      const response = await api.get(`/api/messages/user/${userId}/rooms`);
      return response.data;
    } catch (error) {
      throw new Error("채팅방 아이디를 불러오는데 실패했습니다.");
    }
  },
  
  getChatLog: async (roomId) => {
    try {
      const response = await api.get(`/api/messages/room/${roomId}`);
      return response.data;
    } catch (err) {
      throw new Error("채팅방 채팅 내용을 불러오는데 실패했습니다.");
    }
  },
  getChatInfo: async (roomId) => {
    try {
      const response = await api.get(`/api/messages/room-info/${roomId}`);
      return response.data;
    } catch (err) {
      throw new Error("채팅방 채팅 내용을 불러오는데 실패했습니다.");
    }
  },
}