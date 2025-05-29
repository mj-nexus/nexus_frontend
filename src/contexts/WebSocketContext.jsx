import React, { createContext, useContext, useState, useEffect } from 'react';
import { socket } from '../utils/socketUtil';
import { toast } from 'react-toastify';

// 컨텍스트 생성
export const WebSocketContext = createContext();

// 컨텍스트 사용을 위한 커스텀 훅
export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider = ({ children }) => {
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  
  // 소켓 연결 및 이벤트 리스너 설정
  useEffect(() => {
    // 이미 연결되어 있는 경우
    if (socket.connected) {
      setConnected(true);
      setConnecting(false);
      
      if (connectionAttempts > 0) {
        toast.success('서버에 성공적으로 연결되었습니다');
        setConnectionAttempts(0);
      }
    } else {
      setConnecting(true);
      
      // 연결 이벤트
      socket.on('connect', () => {
        console.log('WebSocketContext: 소켓 연결됨');
        setConnected(true);
        setConnecting(false);
        
        if (connectionAttempts > 0) {
          toast.success('서버에 성공적으로 연결되었습니다');
          setConnectionAttempts(0);
        }
      });
    }
    
    // 연결 에러 이벤트
    socket.on('connect_error', (error) => {
      console.error('WebSocketContext: 소켓 연결 오류:', error);
      setConnected(false);
      setConnecting(false);
      setConnectionAttempts(prev => prev + 1);
      
      // 첫 번째 실패 또는 5번째 실패마다 사용자에게 알림
      if (connectionAttempts === 0 || connectionAttempts % 5 === 0) {
        toast.error('서버 연결에 실패했습니다. 네트워크 상태를 확인해주세요.');
      }
    });
    
    // 연결 끊김 이벤트
    socket.on('disconnect', () => {
      console.log('WebSocketContext: 소켓 연결 끊김');
      setConnected(false);
      
      // 사용자가 명시적으로 연결을 끊은 경우가 아니라면 알림 표시
      if (!socket.disconnected) {
        toast.warning('서버와의 연결이 끊겼습니다. 자동으로 재연결을 시도합니다.');
      }
    });
    
    // 온라인 사용자 목록 업데이트 이벤트
    socket.on('onlineUsers', (userList) => {
      console.log('WebSocketContext: 온라인 사용자 목록 업데이트:', userList);
      setOnlineUsers(userList);
    });
    
    // 사용자 접속 이벤트
    socket.on('userConnected', (userId) => {
      console.log('WebSocketContext: 사용자 접속:', userId);
      setOnlineUsers(prev => {
        if (!prev.includes(userId)) {
          return [...prev, userId];
        }
        return prev;
      });
    });
    
    // 사용자 접속 종료 이벤트
    socket.on('userDisconnected', (userId) => {
      console.log('WebSocketContext: 사용자 접속 종료:', userId);
      setOnlineUsers(prev => prev.filter(id => id !== userId));
    });
    
    // 컴포넌트 언마운트 시 이벤트 리스너 정리
    return () => {
      socket.off('connect');
      socket.off('connect_error');
      socket.off('disconnect');
      socket.off('onlineUsers');
      socket.off('userConnected');
      socket.off('userDisconnected');
    };
  }, [connectionAttempts]);
  
  // 소켓 재연결 시도
  const reconnect = () => {
    if (!socket.connected) {
      setConnecting(true);
      socket.connect();
      toast.info('서버에 재연결을 시도합니다...');
    }
  };
  
  // 사용자가 온라인 상태인지 확인
  const isUserOnline = (userId) => {
    return onlineUsers.includes(userId);
  };
  
  // 제공할 값
  const value = {
    connected,
    connecting,
    onlineUsers,
    isUserOnline,
    reconnect
  };
  
  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
}; 