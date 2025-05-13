import { getRoomId } from './messageUtil';
import { joinChatRoom, sendMessage, connectToServer, createSocketEventHandlers } from './socketUtil';
import { formatMessageTime, createMessageObject, createSendMessageObject, fetchChatHistory } from './messageUtil';

/**
 * 채팅 메시지 기능 관련 유틸리티 함수들
 */

/**
 * 채팅 기록 불러오기
 * @param {string} roomId 채팅방 ID
 * @param {Function} setIsLoading 로딩 상태 설정 함수
 * @param {Function} setMessages 메시지 설정 함수
 */
export const loadChatHistory = async (roomId, setIsLoading, setMessages) => {
  try {
    setIsLoading(true);
    const chatHistory = await fetchChatHistory(roomId);
    
    if (chatHistory && chatHistory.length > 0) {
      console.log(`${chatHistory.length}개의 채팅 기록을 불러왔습니다.`);
      setMessages(chatHistory);
    } else {
      console.log('채팅 기록이 없습니다.');
      setMessages([]);
    }
  } catch (error) {
    console.error('채팅 기록 로드 오류:', error);
  } finally {
    setIsLoading(false);
  }
};

/**
 * 채팅방 입장 및 기록 불러오기
 * @param {object} messageService 메시지 서비스 인스턴스
 * @param {number} currentUserId 현재 사용자 ID
 * @param {number} selectedUserId 선택된 사용자 ID
 * @param {Function} setIsLoading 로딩 상태 설정 함수
 * @param {Function} setMessages 메시지 설정 함수
 */
export const joinChatRoomAndLoadHistory = (
  messageService,
  currentUserId,
  selectedUserId,
  setIsLoading,
  setMessages
) => {
  const roomId = getRoomId(currentUserId, selectedUserId);
  joinChatRoom(messageService, roomId);
  loadChatHistory(roomId, setIsLoading, setMessages);
};

/**
 * 메시지 전송 처리
 * @param {Event} e 이벤트 객체
 * @param {string} input 입력 메시지
 * @param {Function} setInput 입력 설정 함수
 * @param {Array} messages 현재 메시지 목록
 * @param {Function} setMessages 메시지 설정 함수
 * @param {object} currentUser 현재 사용자 정보
 * @param {number} selectedUser 선택된 사용자 ID
 * @param {object} messageService 메시지 서비스 인스턴스
 * @param {boolean} connected 연결 상태
 * @param {boolean} reconnecting 재연결 상태
 * @param {Function} handleConnectToServer 서버 연결 함수
 * @returns {boolean} 성공 여부
 */
export const handleSendMessage = (
  e,
  input,
  setInput,
  messages,
  setMessages,
  currentUser,
  selectedUser,
  messageService,
  connected,
  reconnecting,
  handleConnectToServer
) => {
  e.preventDefault();
  if (!input.trim()) return false;
  
  // 로컬 메시지 생성 (항상 추가)
  const newMessage = {
    id: Date.now(),
    sender: currentUser.id,
    text: input,
    time: formatMessageTime(new Date()),
    read: false
  };
  
  // 메시지를 UI에 추가 (서버 응답 기다리지 않고)
  setMessages([...messages, newMessage]);
  setInput('');
  
  // 소켓을 통한 메시지 전송
  if (connected && messageService) {
    try {
      const roomId = getRoomId(currentUser.id, selectedUser);
      const message = createSendMessageObject(input, currentUser.id, selectedUser, roomId);
      
      const sent = sendMessage(messageService, message);
      
      if (!sent && !reconnecting) {
        handleConnectToServer();
      }
      
      return sent;
    } catch (error) {
      console.error('메시지 전송 중 오류:', error);
      
      if (!reconnecting) {
        handleConnectToServer();
      }
      
      return false;
    }
  } else if (!connected && !reconnecting) {
    handleConnectToServer();
  }
  
  return true;
};

/**
 * 메시지 서비스 초기화 및 이벤트 핸들러 설정
 * @param {string} socketUrl 소켓 서버 URL
 * @param {Function} setConnected 연결 상태 설정 함수
 * @param {Function} setReconnecting 재연결 상태 설정 함수
 * @param {Function} setConnectError 연결 오류 설정 함수
 * @param {Function} handleJoinChatRoom 채팅방 입장 함수
 * @param {Function} handleReceivedMessage 메시지 수신 처리 함수
 * @param {Function} MessageService 메시지 서비스 클래스
 * @returns {object} 메시지 서비스 인스턴스
 */
export const initializeChatService = (
  socketUrl,
  setConnected,
  setReconnecting,
  setConnectError,
  handleJoinChatRoom,
  handleReceivedMessage,
  MessageService
) => {
  console.log('메시지 서비스 초기화 시작');
  
  // 메시지 서비스 인스턴스 생성
  const messageService = new MessageService(socketUrl);
  
  // 이벤트 핸들러 생성 및 등록
  const eventHandlers = createSocketEventHandlers(
    setConnected,
    setReconnecting,
    setConnectError,
    handleJoinChatRoom,
    handleReceivedMessage
  );
  
  messageService.on('onOpen', eventHandlers.onOpen);
  messageService.on('onMessage', eventHandlers.onMessage);
  messageService.on('onClose', eventHandlers.onClose);
  messageService.on('onError', eventHandlers.onError);
  
  return messageService;
};

/**
 * 연결 오류 처리 함수
 * @param {Error} error 오류 객체
 * @param {Function} setConnectError 연결 오류 설정 함수
 * @param {Function} setReconnecting 재연결 상태 설정 함수
 */
export const handleConnectionError = (error, setConnectError, setReconnecting) => {
  const errorMessage = error.message || '알 수 없는 오류';
  setConnectError('서버 연결 실패: ' + errorMessage);
  setReconnecting(false);
}; 