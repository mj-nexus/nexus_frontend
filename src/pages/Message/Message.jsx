import React, { useState, useRef, useEffect } from 'react';
import styles from './Message.module.scss';

const users = [
  { id: 1, name: '김성진 교수님', role: 'professor', avatar: 'https://via.placeholder.com/40?text=P', online: true },
  { id: 2, name: '박찬유', role: 'student', avatar: 'https://via.placeholder.com/40?text=U', online: true },
  { id: 3, name: '박찬혁', role: 'student', avatar: '', online: false },
  { id: 4, name: '강윤선', role: 'student', avatar: '', online: true },
  { id: 5, name: '김태빈', role: 'student', avatar: '', online: false },
  { id: 6, name: '학생', role: 'student', avatar: '', online: false },
];

const chatData = [
  { id: 1, sender: 2, text: '하이하이.', time: '11:31 AM', read: true },
  { id: 2, sender: 2, text: '교수님 질문이 있어서 연락드립니다 !', time: '11:31 AM', read: true },
  { id: 3, sender: 1, text: '하이', time: '11:31 AM', read: true },
  { id: 4, sender: 2, text: '교수님 질문이 있어서 연락드립니다 !', time: '11:31 AM', read: true },
  { id: 5, sender: 2, text: '교수님 질문이 있어서 연락드립니다 !', time: '11:31 AM', read: true },
];

export default function Message() {
  const [selectedUser, setSelectedUser] = useState(1);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState(chatData);
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState(false);
  const messagesEndRef = useRef(null);

  // 메시지 입력 시 자동 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages([
      ...messages,
      { id: messages.length + 1, sender: 2, text: input, time: '11:32 AM', read: false },
    ]);
    setInput('');
  };

  // 채팅방 UI에 파동 효과 추가
  const createRipple = (e) => {
    const rippleContainer = document.createElement('span');
    const rect = e.target.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    rippleContainer.style.cssText = `
      position: absolute;
      top: ${y}px;
      left: ${x}px;
      width: ${size}px;
      height: ${size}px;
      background: rgba(255, 255, 255, 0.4);
      border-radius: 50%;
      transform: scale(0);
      animation: ripple 0.6s linear;
      pointer-events: none;
    `;
    
    e.target.appendChild(rippleContainer);
    
    setTimeout(() => {
      rippleContainer.remove();
    }, 600);
  };

  return (
    <div className={styles.container}>
      
      {/* 좌측 채팅 영역 */}
      <div className={styles.chatArea}>
        <div className={styles.chatHeader}>
          <div className={styles.headerLeft}>
            <div 
              className={styles.userAvatar} 
              onClick={() => setExpanded(!expanded)}
            >
              <img 
                src={users.find(u => u.id === selectedUser)?.avatar || 'https://via.placeholder.com/40?text=?'} 
                alt="profile" 
              />
              <div className={styles.expandIcon}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points={expanded ? "18 15 12 9 6 15" : "6 9 12 15 18 9"}></polyline>
                </svg>
              </div>
            </div>
            
            <div className={styles.userInfo}>
              <h3>{users.find(u => u.id === selectedUser)?.name}</h3>
              <span className={styles.userStatus}>
                {users.find(u => u.id === selectedUser)?.online ? 
                  <><span className={styles.statusDot}></span>온라인</> : '오프라인'}
              </span>
            </div>
          </div>
          
          <div className={styles.headerControls}>
            <button className={styles.iconBtn}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="1"></circle>
                <circle cx="19" cy="12" r="1"></circle>
                <circle cx="5" cy="12" r="1"></circle>
              </svg>
            </button>
          </div>
        </div>
        
        <div className={styles.messagesContainer}>
          <div className={styles.timelineLabel}>
            <span>오늘</span>
          </div>
          
          <div className={styles.messagesWrapper}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`${styles.messageItem} ${msg.sender === 2 ? styles.sent : styles.received}`}
                onClick={createRipple}
              >
                {msg.sender !== 2 && (
                  <div className={styles.messageAvatar}>
                    <img 
                      src={users.find(u => u.id === msg.sender)?.avatar || 'https://via.placeholder.com/40?text=?'} 
                      alt="avatar" 
                    />
                  </div>
                )}
                <div className={styles.messageContent}>
                  <span>{msg.text}</span>
                  <span className={styles.messageInfo}>
                    <span className={styles.messageTime}>{msg.time}</span>
                    {msg.sender === 2 && msg.read && (
                      <span className={styles.readStatus}>
                        <svg width="14" height="14" viewBox="0 0 24 24">
                          <path fill="none" stroke="currentColor" strokeWidth="2" d="M16 8L10 16L8 14" />
                        </svg>
                      </span>
                    )}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
        
        <form className={styles.messageInput} onSubmit={handleSend}>
          <button type="button" className={styles.attachBtn}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l8.57-8.57A4 4 0 1118.8 8.61l-8.57 8.57a2 2 0 01-2.83-2.83l8.57-8.57"></path>
            </svg>
          </button>
          <input
            type="text"
            placeholder="메시지를 입력하세요..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" className={styles.sendBtn} disabled={!input.trim()}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </form>
      </div>

      {/* 사용자 목록 사이드바 */}
      <aside className={`${styles.usersSidebar} ${expanded ? styles.expanded : ''}`}>
        <div className={styles.sidebarHeader}>
          <h2>Inbox</h2>
          <div className={styles.badgeNew}>2 New</div>
        </div>
        
        <div className={styles.searchWrapper}>
          <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            placeholder="사용자 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        
        <div className={styles.usersList}>
          {users
            .filter(u => u.name.toLowerCase().includes(search.toLowerCase()))
            .map(user => (
              <div
                key={user.id}
                className={`${styles.userCard} ${selectedUser === user.id ? styles.active : ''}`}
                onClick={() => setSelectedUser(user.id)}
              >
                <div className={styles.userCardAvatar}>
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} />
                  ) : (
                    <div className={styles.avatarInitial}>{user.name.charAt(0)}</div>
                  )}
                  {user.online && <span className={styles.onlineIndicator}></span>}
                </div>
                
                <div className={styles.userCardInfo}>
                  <div className={styles.userCardName}>{user.name}</div>
                  <div className={styles.userCardRole}>{user.role}</div>
                </div>
                
                <div className={styles.userCardMeta}>
                  <span className={styles.userCardTime}>11:31</span>
                  {user.id === 1 && <span className={styles.userCardUnread}>3</span>}
                </div>
              </div>
            ))}
        </div>
      </aside>
    </div>
  );
}
