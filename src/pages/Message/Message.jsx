import React, { useState } from 'react';
import './Message.css';

// 더미 채팅방 데이터
const chatRooms = [
  { id: 1, name: '홍길동', lastMessage: '안녕하세요!', time: '오후 2:30', avatar: 'https://via.placeholder.com/40' },
  { id: 2, name: '김철수', lastMessage: '오늘 뭐해요?', time: '오전 11:15', avatar: 'https://via.placeholder.com/40' },
  { id: 3, name: '이영희', lastMessage: '프로젝트 진행상황 어떻게 되나요?', time: '어제', avatar: 'https://via.placeholder.com/40' },
  { id: 4, name: '박지성', lastMessage: '내일 회의 시간 언제인가요?', time: '3일 전', avatar: 'https://via.placeholder.com/40' },
  { id: 5, name: '최민지', lastMessage: '파일 받았습니다. 감사합니다!', time: '1주일 전', avatar: 'https://via.placeholder.com/40' },
];

// 더미 메시지 데이터
const messages = {
  1: [
    { id: 1, text: '안녕하세요!', isMe: false, time: '오후 2:30' },
    { id: 2, text: '안녕하세요, 무슨 일이신가요?', isMe: true, time: '오후 2:31' },
    { id: 3, text: '프로젝트 관련해서 문의드립니다.', isMe: false, time: '오후 2:32' },
  ],
  2: [
    { id: 1, text: '오늘 뭐해요?', isMe: false, time: '오전 11:15' },
    { id: 2, text: '일하고 있어요. 왜요?', isMe: true, time: '오전 11:20' },
  ],
  3: [
    { id: 1, text: '프로젝트 진행상황 어떻게 되나요?', isMe: false, time: '어제' },
    { id: 2, text: '50% 정도 완료되었습니다.', isMe: true, time: '어제' },
  ],
  4: [
    { id: 1, text: '내일 회의 시간 언제인가요?', isMe: false, time: '3일 전' },
    { id: 2, text: '오후 3시입니다.', isMe: true, time: '3일 전' },
  ],
  5: [
    { id: 1, text: '파일 받았습니다. 감사합니다!', isMe: false, time: '1주일 전' },
    { id: 2, text: '네, 천만에요!', isMe: true, time: '1주일 전' },
  ],
};

export const Message = () => {
  const [selectedRoom, setSelectedRoom] = useState(1);
  const [newMessage, setNewMessage] = useState('');

  const handleRoomSelect = (roomId) => {
    setSelectedRoom(roomId);
  };

  const handleMessageSend = (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;
    
    // 실제 구현에서는 API 호출 등으로 메시지 전송 처리
    console.log('메시지 전송:', newMessage);
    setNewMessage('');
  };

  return (
    <div className="message-container">
      {/* 채팅방 리스트 (왼쪽) */}
      <div className="chat-list">
        <div className="chat-list-header">
          <h2>메시지</h2>
        </div>
        <div className="chat-rooms">
          {chatRooms.map((room) => (
            <div 
              key={room.id} 
              className={`chat-room ${selectedRoom === room.id ? 'active' : ''}`}
              onClick={() => handleRoomSelect(room.id)}
            >
              <div className="chat-room-avatar">
                <img src={room.avatar} alt={`${room.name}의 프로필`} />
              </div>
              <div className="chat-room-info">
                <div className="chat-room-name">{room.name}</div>
                <div className="chat-room-last-message">{room.lastMessage}</div>
              </div>
              <div className="chat-room-time">{room.time}</div>
            </div>
          ))}
        </div>
      </div>
      
      {/* 채팅방 내용 (오른쪽) */}
      <div className="chat-content">
        {selectedRoom ? (
          <>
            <div className="chat-header">
              <div className="chat-header-avatar">
                <img 
                  src={chatRooms.find(room => room.id === selectedRoom).avatar} 
                  alt="프로필 사진" 
                />
              </div>
              <div className="chat-header-name">
                {chatRooms.find(room => room.id === selectedRoom).name}
              </div>
            </div>
            <div className="chat-messages">
              {messages[selectedRoom].map((message) => (
                <div 
                  key={message.id} 
                  className={`message ${message.isMe ? 'my-message' : 'other-message'}`}
                >
                  <div className="message-content">{message.text}</div>
                  <div className="message-time">{message.time}</div>
                </div>
              ))}
            </div>
            <form className="chat-input" onSubmit={handleMessageSend}>
              <input
                type="text"
                placeholder="메시지를 입력하세요..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button type="submit">전송</button>
            </form>
          </>
        ) : (
          <div className="no-chat-selected">
            <p>채팅방을 선택하세요</p>
          </div>
        )}
      </div>
    </div>
  );
};
