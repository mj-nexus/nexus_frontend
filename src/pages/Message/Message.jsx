import React, { useState } from 'react';
import styles from './Message.module.scss';

// 더미 채팅방 데이터
const chatRooms = [
  { id: 1, name: '홍길동', lastMessage: '안녕하세요!', time: '오후 2:30', avatar: 'https://via.placeholder.com/40', isOnline: true },
  { id: 2, name: '김철수', lastMessage: '오늘 뭐해요?', time: '오전 11:15', avatar: 'https://via.placeholder.com/40', isOnline: false },
  { id: 3, name: '이영희', lastMessage: '프로젝트 진행상황 어떻게 되나요?', time: '어제', avatar: 'https://via.placeholder.com/40', isOnline: true },
  { id: 4, name: '박지성', lastMessage: '내일 회의 시간 언제인가요?', time: '3일 전', avatar: 'https://via.placeholder.com/40', isOnline: false },
  { id: 5, name: '최민지', lastMessage: '파일 받았습니다. 감사합니다!', time: '1주일 전', avatar: 'https://via.placeholder.com/40', isOnline: true },
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
    <div className={styles['message-page']}>

      {/* 메시지 영역 */}
      <div className={styles['message-wrapper']}>
        <div className={styles['message-container']}>
          {/* 채팅방 리스트 (왼쪽) */}
          <div className={styles['chat-list']}>
            <div className={styles['chat-list__header']}>
              <h2>메시지</h2>
              <button className={styles['new-message-button']}>
                <span className={styles['new-message-icon']} role="img" aria-label="새 메시지">✏️</span>
              </button>
            </div>
            <div className={styles['chat-list__rooms']}>
              {chatRooms.map((room) => (
                <div
                  key={room.id}
                  className={`${styles['chat-list__room']} ${selectedRoom === room.id ? styles['chat-list__room--active'] : ''}`}
                  onClick={() => handleRoomSelect(room.id)}
                >
                  <div className={styles['chat-list__room-avatar']}>
                    <img src={room.avatar} alt={`${room.name}의 프로필`} />
                    {room.isOnline && <span className={styles['online-indicator']}></span>}
                  </div>
                  <div className={styles['chat-list__room-info']}>
                    <div className={styles['chat-room-name']}>{room.name}</div>
                    <div className={styles['chat-room-last-message']}>{room.lastMessage}</div>
                  </div>
                  <div className={styles['chat-list__room-time']}>{room.time}</div>
                </div>
              ))}
            </div>
          </div>
          
          {/* 채팅방 내용 (오른쪽) */}
          <div className={styles['chat-content']}>
            {selectedRoom ? (
              <>
                <div className={styles['chat-header']}>
                  <div className={styles['chat-header-user']}>
                    <div className={styles['chat-header-avatar']}>
                      <img
                        src={chatRooms.find(room => room.id === selectedRoom).avatar}
                        alt="프로필 사진"
                      />
                      {chatRooms.find(room => room.id === selectedRoom).isOnline && (
                        <span className={`${styles['online-indicator']} ${styles['online-indicator--small']}`}></span>
                      )}
                    </div>
                    <div className={styles['chat-header-info']}>
                      <div className={styles['chat-header-name']}>
                        {chatRooms.find(room => room.id === selectedRoom).name}
                      </div>
                      <div className={styles['chat-header-status']}>
                        {chatRooms.find(room => room.id === selectedRoom).isOnline ? '활동 중' : '오프라인'}
                      </div>
                    </div>
                  </div>
                  <div className={styles['chat-header-actions']}>
                    <button className={styles['chat-action-button']}>
                      <span className={styles['action-icon']} role="img" aria-label="전화">📞</span>
                    </button>
                    <button className={styles['chat-action-button']}>
                      <span className={styles['action-icon']} role="img" aria-label="영상">📹</span>
                    </button>
                    <button className={styles['chat-action-button']}>
                      <span className={styles['action-icon']} role="img" aria-label="정보">ℹ️</span>
                    </button>
                  </div>
                </div>
                <div className={styles['chat-messages']}>
                  {messages[selectedRoom].map((message) => (
                    <div
                      key={message.id}
                      className={`${styles['message']} ${message.isMe ? styles['message--my'] : styles['message--other']}`}
                    >
                      {!message.isMe && (
                        <div className={styles['message-avatar']}>
                          <img
                            src={chatRooms.find(room => room.id === selectedRoom).avatar}
                            alt="프로필 사진"
                          />
                        </div>
                      )}
                      <div className={styles['message-bubble']}>
                        <div className={styles['message-content']}>{message.text}</div>
                        <div className={styles['message-time']}>{message.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className={styles['chat-footer']}>
                  <div className={styles['chat-tools']}>
                    <button className={styles['tool-button']}>
                      <span className={styles['tool-icon']} role="img" aria-label="이모지">😊</span>
                    </button>
                    <button className={styles['tool-button']}>
                      <span className={styles['tool-icon']} role="img" aria-label="이미지">🖼️</span>
                    </button>
                    <button className={styles['tool-button']}>
                      <span className={styles['tool-icon']} role="img" aria-label="하트">❤️</span>
                    </button>
                  </div>
                  <form className={styles['chat-input']} onSubmit={handleMessageSend}>
                    <input
                      type="text"
                      placeholder="메시지를 입력하세요..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <button type="submit" className={styles['send-button']}>전송</button>
                  </form>
                </div>
              </>
            ) : (
              <div className={styles['no-chat-selected']}>
                <div className={styles['no-chat-icon']}>💬</div>
                <h3>메시지를 보내보세요</h3>
                <p>친구에게 메시지를 보내거나 그룹 채팅방을 만들 수 있습니다.</p>
                <button className={styles['new-message-button-large']}>새 메시지 보내기</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
