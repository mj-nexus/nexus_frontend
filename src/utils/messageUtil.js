import { messageService } from '../services/messageService';

export const getChatList = async (userId) => {
  try {
    const { roomIds } = await messageService.getChatIdList(userId);
    return roomIds;
  } catch (error) {
    console.error(error.message);
    return [];
  }
}

export const getChatInfo = async (roomIds) => {
  try {
    const { room } = await messageService.getChatInfo(roomIds);
    return room;
  }
  catch (err) {
    console.err(err.message);
    return [];
  }
}

export const getChatLog = async (roomId) => {
  try {
    const { messages } = await messageService.getChatLog(roomId);
    return messages;
  } catch (error) {
    console.error(error.message);
    return [];
  }
}
