import React, { useState, useEffect, useRef } from 'react';
import MessageService from '../services/messageService';
import '../styles/Chat.css';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [connected, setConnected] = useState(false);
  const [username, setUsername] = useState('');
  const [reconnecting, setReconnecting] = useState(false);
  const messageServiceRef = useRef(null);
  const messagesEndRef = useRef(null);

  // 백엔드 웹소켓 서버 URL
  const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'ws://localhost:8080';

  useEffect(() => {
    // 메시지 서비스 초기화
    messageServiceRef.current = new MessageService(SOCKET_URL);
    
    // 메시지 서비스 이벤트 핸들러 등록
    messageServiceRef.current.on('onOpen', handleSocketOpen);
    messageServiceRef.current.on('onMessage', handleSocketMessage);
    messageServiceRef.current.on('onClose', handleSocketClose);
    messageServiceRef.current.on('onError', handleSocketError);

    // 연결 시작
    connectToServer();

    // 컴포넌트 언마운트 시 연결 종료
    return () => {
      if (messageServiceRef.current) {
        messageServiceRef.current.disconnect();
      }
    };
  }, []);

  // 서버 연결 함수
  const connectToServer = () => {
    if (messageServiceRef.current) {
      setReconnecting(true);
      addSystemMessage('서버에 연결 중...');
      messageServiceRef.current.connect();
    }
  };

  // 서버 재연결 함수
  const handleReconnect = () => {
    setReconnecting(true);
    addSystemMessage('서버에 재연결 중...');
    
    if (messageServiceRef.current) {
      messageServiceRef.current.reconnect();
    } else {
      messageServiceRef.current = new MessageService(SOCKET_URL);
      messageServiceRef.current.on('onOpen', handleSocketOpen);
      messageServiceRef.current.on('onMessage', handleSocketMessage);
      messageServiceRef.current.on('onClose', handleSocketClose);
      messageServiceRef.current.on('onError', handleSocketError);
      messageServiceRef.current.connect();
    }
  };

  // 메시지 스크롤 자동화
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 웹소켓 연결 성공 핸들러
  const handleSocketOpen = (event) => {
    setConnected(true);
    setReconnecting(false);
    addSystemMessage('서버에 연결되었습니다.');
    
    // 인증 데이터 전송 (서버에서 필요한 경우)
    if (username) {
      sendAuthMessage();
    }
  };

  // 인증 메시지 전송 (필요한 경우 사용)
  const sendAuthMessage = () => {
    if (messageServiceRef.current && username) {
      messageServiceRef.current.sendMessage({
        type: 'auth',
        username: username
      });
    }
  };

  // 메시지 수신 핸들러
  const handleSocketMessage = (data) => {
    if (data.type === 'error') {
      // 에러 메시지 표시
      addSystemMessage(`오류: ${data.text}`);
      return;
    }
    
    // 서버 메시지 타입에 따른 처리
    if (data.type === 'system') {
      addSystemMessage(data.text);
    } else {
      addMessage(data);
    }
  };

  // 웹소켓 연결 종료 핸들러
  const handleSocketClose = (event) => {
    setConnected(false);
    
    // 1000은 정상 종료 코드
    if (event.code !== 1000) {
      addSystemMessage('서버와의 연결이 끊겼습니다. 자동으로 재연결 중...');
      setReconnecting(true);
    } else {
      addSystemMessage('서버와의 연결이 종료되었습니다.');
      setReconnecting(false);
    }
  };

  // 웹소켓 오류 핸들러
  const handleSocketError = (error) => {
    console.error('웹소켓 오류:', error);
    setConnected(false);
    addSystemMessage(`연결 오류가 발생했습니다: ${error.message || '알 수 없는 오류'}`);
  };

  // 시스템 메시지 추가
  const addSystemMessage = (text) => {
    setMessages(prev => [...prev, {
      id: Date.now(),
      type: 'system',
      text
    }]);
  };

  // 메시지 추가
  const addMessage = (message) => {
    setMessages(prev => [...prev, {
      id: message.id || Date.now(),
      type: message.type || 'user',
      sender: message.sender,
      text: message.text,
      timestamp: message.timestamp || new Date().toISOString()
    }]);
  };

  // 메시지 전송
  const sendMessage = (e) => {
    e.preventDefault();
    
    if (!inputMessage.trim() || !username.trim()) return;

    // 연결이 끊긴 상태면 재연결 시도
    if (!connected && !reconnecting) {
      handleReconnect();
      addSystemMessage('메시지 전송 전 서버에 재연결 중...');
      return;
    }

    const message = {
      type: 'message',
      sender: username,
      text: inputMessage,
      timestamp: new Date().toISOString()
    };

    const sent = messageServiceRef.current.sendMessage(message);
    
    if (sent) {
      // 메시지 전송 성공 시 로컬에 추가
      addMessage({...message, type: 'self'});
      setInputMessage('');
    } else {
      addSystemMessage('메시지 전송에 실패했습니다. 연결 상태를 확인해주세요.');
    }
  };

  // 사용자 이름 설정
  const setUsernameFn = (e) => {
    e.preventDefault();
    if (username.trim()) {
      addSystemMessage(`사용자 이름이 '${username}'으로 설정되었습니다.`);
      
      // 이미 연결된 상태라면 인증 메시지 전송
      if (connected) {
        sendAuthMessage();
      }
    }
  };

  // 메시지 입력 핸들러
  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
  };

  // 유저명 입력 핸들러
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>실시간 채팅</h2>
        <div className="connection-status">
          <span className={`status-indicator ${connected ? 'connected' : 'disconnected'}`}></span>
          <span>{connected ? '연결됨' : '연결 끊김'}</span>
          {!connected && (
            <button 
              className="reconnect-button"
              onClick={handleReconnect}
              disabled={reconnecting}
            >
              {reconnecting ? '재연결 중...' : '재연결'}
            </button>
          )}
        </div>
      </div>

      {!username && (
        <div className="username-form">
          <form onSubmit={setUsernameFn}>
            <input
              type="text"
              placeholder="사용자 이름을 입력하세요"
              value={username}
              onChange={handleUsernameChange}
            />
            <button type="submit">설정</button>
          </form>
        </div>
      )}

      <div className="messages-container">
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.type}`}>
            {msg.type === 'system' ? (
              <div className="system-message">{msg.text}</div>
            ) : (
              <>
                <div className="message-header">
                  <span className="sender">{msg.sender}</span>
                  <span className="timestamp">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                </div>
                <div className="message-text">{msg.text}</div>
              </>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form className="message-form" onSubmit={sendMessage}>
        <input
          type="text"
          placeholder="메시지를 입력하세요..."
          value={inputMessage}
          onChange={handleInputChange}
          disabled={!username || (reconnecting && !connected)}
        />
        <button type="submit" disabled={!username || (reconnecting && !connected)}>
          {reconnecting && !connected ? '연결 중...' : '전송'}
        </button>
      </form>
    </div>
  );
};

export default Chat; 