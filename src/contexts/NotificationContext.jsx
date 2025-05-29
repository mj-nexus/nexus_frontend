import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { socket, authenticateUser } from '../utils/socketUtil';
import { toast } from 'react-toastify';

// 컨텍스트 생성
export const NotificationContext = createContext();

// 컨텍스트 사용을 위한 커스텀 훅
export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const userId = localStorage.getItem('userId');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 기본 알림 제목 가져오기
  const getDefaultTitle = (type) => {
    switch (type) {
      case 'message':
        return '새 메시지';
      case 'friend_request':
        return '친구 요청';
      case 'event':
        return '이벤트 알림';
      default:
        return '알림';
    }
  };

  // 알림 목록 가져오기 (REST API 사용)
  const fetchNotifications = useCallback(async (page = 1, limit = 20, unreadOnly = false) => {
    if (!userId) {
      console.error('사용자 ID가 없습니다');
      return [];
    }
    
    try {
      setIsLoading(true);
      
      const queryParams = new URLSearchParams({
        page,
        limit,
        unread_only: unreadOnly
      }).toString();
      
      // URL에 user_id를 포함
      const response = await fetch(`${process.env.REACT_APP_BACKEND_HOST}/api/notifications/${userId}?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        
        // 데이터가 배열인지 확인
        const notificationsArray = Array.isArray(data) ? data : 
                                  (data.notifications ? data.notifications : []);
        
        // 알림 데이터 가공 및 필수 필드 확인
        const processedData = notificationsArray.map(notification => ({
          ...notification,
          id: notification.id || `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          title: notification.title || getDefaultTitle(notification.type),
          created_at: notification.created_at || new Date().toISOString(),
          read: notification.read || false
        }));
        
        setNotifications(processedData);
        setUnreadCount(processedData.filter(n => !n.read).length);
        return processedData;
      } else {
        const errorData = await response.json();
        console.error('알림 목록 가져오기 실패:', errorData);
        return [];
      }
    } catch (error) {
      console.error('알림 목록 가져오기 실패:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // 읽지 않은 알림 개수 가져오기 (REST API 사용)
  const fetchUnreadCount = useCallback(async () => {
    if (!userId) {
      console.error('사용자 ID가 없습니다');
      return 0;
    }
    
    try {
      setIsLoading(true);
      
      // URL에 user_id를 포함
      const response = await fetch(`${process.env.REACT_APP_BACKEND_HOST}/api/notifications/${userId}/unread-count`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('받은 읽지 않은 알림 개수 데이터:', data);
        
        // 서버 응답 형식에 따라 처리
        let count = 0;
        if (typeof data === 'number') {
          count = data;
        } else if (data && typeof data.count === 'number') {
          count = data.count;
        } else if (data && typeof data.unread_count === 'number') {
          count = data.unread_count;
        } else if (Array.isArray(data)) {
          count = data.filter(n => !n.read).length;
        }
        
        setUnreadCount(count);
        return count;
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('읽지 않은 알림 개수 가져오기 실패:', errorData);
        return 0;
      }
    } catch (error) {
      console.error('읽지 않은 알림 개수 가져오기 실패:', error);
      return 0;
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // 알림 읽음 처리 (REST API 사용)
  const markAsRead = useCallback(async (notificationId) => {
    if (!userId || !notificationId) {
      console.error('사용자 ID 또는 알림 ID가 없습니다');
      return false;
    }
    
    try {
      setIsLoading(true);
      
      // 임시 ID인 경우 (서버에 저장되지 않은 알림)
      if (notificationId.startsWith('temp-')) {
        setNotifications(prev => 
          prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
        return true;
      }
      
      // URL에 user_id와 notification_id를 포함
      const response = await fetch(`${process.env.REACT_APP_BACKEND_HOST}/api/notifications/${userId}/${notificationId}/read`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        // 성공적으로 읽음 처리된 경우 상태 업데이트
        setNotifications(prev => 
          prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
        return true;
      } else {
        const errorData = await response.json();
        console.error('알림 읽음 처리 실패:', errorData);
        return false;
      }
    } catch (error) {
      console.error('알림 읽음 처리 실패:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // 채팅방 관련 알림 읽음 처리
  const markChatNotificationsAsRead = useCallback(async (roomId) => {
    if (!roomId) {
      console.error('채팅방 ID가 없습니다');
      return false;
    }
    
    try {
      // 해당 채팅방 관련 알림 찾기
      const chatNotifications = notifications.filter(n => 
        !n.read && 
        (
          (n.type === 'message' && n.data?.roomId === roomId) ||
          (n.type === 'message' && n.chat_room_id === roomId)
        )
      );
      
      if (chatNotifications.length === 0) return true;
      
      console.log(`채팅방 ${roomId}의 알림 ${chatNotifications.length}개 읽음 처리 시작`);
      
      // 모든 채팅방 알림 읽음 처리
      const promises = chatNotifications.map(notification => 
        markAsRead(notification.id)
      );
      
      const results = await Promise.all(promises);
      const success = results.every(result => result === true);
      
      // Socket.io로 서버에 읽음 상태 알림
      if (success && socket.connected) {
        socket.emit('readMessages', {
          user_id: userId,
          chat_room_id: roomId,
          last_read_message_id: chatNotifications[chatNotifications.length - 1].id
        });
      }
      
      if (success) {
        console.log(`채팅방 ${roomId}의 알림 모두 읽음 처리 완료`);
        return true;
      } else {
        console.error(`채팅방 ${roomId}의 일부 알림 읽음 처리 실패`);
        return false;
      }
    } catch (error) {
      console.error('채팅방 알림 읽음 처리 실패:', error);
      return false;
    }
  }, [notifications, markAsRead, userId]);

  // 모든 알림 읽음 처리 (REST API 사용)
  const markAllAsRead = useCallback(async () => {
    if (!userId) {
      console.error('사용자 ID가 없습니다');
      return false;
    }
    
    try {
      setIsLoading(true);
      
      // URL에 user_id를 포함
      const response = await fetch(`${process.env.REACT_APP_BACKEND_HOST}/api/notifications/${userId}/read-all`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        // 모든 알림 읽음 처리
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        setUnreadCount(0);
        return true;
      } else {
        const errorData = await response.json();
        console.error('모든 알림 읽음 처리 실패:', errorData);
        return false;
      }
    } catch (error) {
      console.error('모든 알림 읽음 처리 실패:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // 알림 삭제 (REST API 사용)
  const deleteNotification = useCallback(async (notificationId) => {
    if (!userId || !notificationId) {
      console.error('사용자 ID 또는 알림 ID가 없습니다');
      return false;
    }
    
    try {
      setIsLoading(true);
      
      // 임시 ID인 경우 (서버에 저장되지 않은 알림)
      if (notificationId.startsWith('temp-')) {
        const deletedNotification = notifications.find(n => n.id === notificationId);
        setNotifications(prev => prev.filter(n => n.id !== notificationId));
        
        // 읽지 않은 알림이었다면 카운트 감소
        if (deletedNotification && !deletedNotification.read) {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
        
        return true;
      }
      
      // URL에 user_id와 notification_id를 포함
      const response = await fetch(`${process.env.REACT_APP_BACKEND_HOST}/api/notifications/${userId}/${notificationId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        // 삭제된 알림 제거
        const deletedNotification = notifications.find(n => n.id === notificationId);
        setNotifications(prev => prev.filter(n => n.id !== notificationId));
        
        // 읽지 않은 알림이었다면 카운트 감소
        if (deletedNotification && !deletedNotification.read) {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
        
        return true;
      } else {
        const errorData = await response.json();
        console.error('알림 삭제 실패:', errorData);
        return false;
      }
    } catch (error) {
      console.error('알림 삭제 실패:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [userId, notifications]);

  // 브라우저 알림 표시
  const showBrowserNotification = useCallback((notification) => {
    // 브라우저 알림 권한 확인 및 요청
    if (Notification.permission === 'granted') {
      const title = notification.title || getDefaultTitle(notification.type);
      const options = {
        body: notification.content,
        icon: '/logo192.png',
        tag: notification.id || `notification-${Date.now()}`
      };
      
      const browserNotification = new Notification(title, options);
      
      // 알림 클릭 시 처리
      browserNotification.onclick = () => {
        window.focus();
        
        // 알림 유형에 따른 네비게이션
        if (notification.type === 'message' && notification.data?.roomId) {
          window.location.href = `/chat/${notification.data.roomId}`;
        } else if (notification.type === 'message' && notification.chat_room_id) {
          window.location.href = `/chat/${notification.chat_room_id}`;
        } else if (notification.type === 'friend_request') {
          window.location.href = '/friends';
        } else if (notification.data?.url) {
          window.location.href = notification.data.url;
        }
        
        // 읽음 처리
        markAsRead(notification.id);
      };
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
  }, [markAsRead]);

  // 소켓 연결 및 이벤트 리스너 설정
  useEffect(() => {
    if (!userId) return;

    // 소켓 연결 상태 확인
    const handleConnect = () => {
      console.log('소켓 연결됨:', socket.id);
      if (!isAuthenticated) {
        // authenticate 이벤트 발생 (이미지에 나온 형식 그대로 사용)
        socket.emit('authenticate', userId);
        setIsAuthenticated(true);
      }
    };

    // 이미 연결되어 있으면 인증 수행
    if (socket.connected && !isAuthenticated) {
      socket.emit('authenticate', userId);
      setIsAuthenticated(true);
    }

    // 이벤트 리스너 등록
    socket.on('connect', handleConnect);
    
    // 알림 수신 (이미지에 나온 형식 그대로 사용)
    const handleNotification = (data) => {
      console.log('알림 수신:', data);
      
      // 필수 필드 확인 및 기본값 설정
      const processedNotification = {
        id: data.id || `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: data.type || 'message',
        sender_id: data.sender_id,
        sender_name: data.sender_name,
        content: data.content || '새 알림이 있습니다',
        title: data.title || getDefaultTitle(data.type),
        created_at: data.created_at || new Date().toISOString(),
        read: data.read || false,
        chat_room_id: data.chat_room_id,
        data: data.data || {}
      };
      
      setNotifications(prev => {
        // 이미 동일한 알림이 있는지 확인 (중복 방지)
        const isDuplicate = prev.some(n => 
          n.id === processedNotification.id || 
          (n.type === processedNotification.type && 
           n.content === processedNotification.content && 
           n.sender_id === processedNotification.sender_id &&
           Math.abs(new Date(n.created_at) - new Date(processedNotification.created_at)) < 10000)
        );
        
        if (isDuplicate) return prev;
        
        // 현재 URL이 채팅방인지 확인하여 자동 읽음 처리
        if (processedNotification.type === 'message') {
          const currentPath = window.location.pathname;
          const isInChatRoom = currentPath.startsWith('/chat/');
          
          if (isInChatRoom) {
            const currentRoomId = currentPath.split('/chat/')[1];
            const notificationRoomId = 
              processedNotification.data?.roomId || 
              processedNotification.chat_room_id;
            
            // 현재 보고 있는 채팅방의 메시지인 경우 읽음 처리
            if (currentRoomId === notificationRoomId) {
              processedNotification.read = true;
              
              // 서버에 읽음 상태 알림
              if (!processedNotification.id.startsWith('temp-')) {
                fetch(`${process.env.REACT_APP_BACKEND_HOST}/api/notifications/${userId}/${processedNotification.id}/read`, {
                  method: 'PATCH',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                  }
                }).catch(error => console.error('알림 읽음 처리 실패:', error));
                
                // Socket.io로 서버에 읽음 상태 알림
                if (socket.connected) {
                  socket.emit('readMessages', {
                    user_id: userId,
                    chat_room_id: notificationRoomId,
                    last_read_message_id: processedNotification.id
                  });
                }
              }
              
              return [processedNotification, ...prev];
            }
          }
        }
        
        // 기본 처리 (새 알림 추가)
        return [processedNotification, ...prev];
      });
      
      // 읽지 않은 경우만 카운트 증가
      if (!processedNotification.read) {
        setUnreadCount(prev => prev + 1);
        
        // 브라우저 알림 표시
        showBrowserNotification(processedNotification);
        
        // toast 알림
        if (processedNotification.type === 'message') {
          toast.info(`${processedNotification.sender_name || '알 수 없음'}: ${processedNotification.content}`);
        } else {
          toast.info(processedNotification.content);
        }
      }
    };
    
    socket.on('notification', handleNotification);

    // 읽지 않은 알림 수신 (이미지에 나온 형식 그대로 사용)
    socket.on('pending_notifications', (data) => {
      console.log('읽지 않은 알림 수신:', data);
      
      // 데이터 형식 확인 및 처리
      const notificationsArray = Array.isArray(data) ? data : 
                               (data && data.notifications ? data.notifications : []);
      
      if (notificationsArray.length === 0) {
        console.log('받은 알림이 없습니다');
        return;
      }
      
      // 알림 데이터 가공 및 필수 필드 확인
      const processedNotifications = notificationsArray.map(notification => ({
        ...notification,
        id: notification.id || `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: notification.title || getDefaultTitle(notification.type),
        created_at: notification.created_at || new Date().toISOString(),
        read: notification.read || false
      }));
      
      setNotifications(processedNotifications);
      setUnreadCount(processedNotifications.filter(n => !n.read).length);
    });

    // 메시지 읽음 상태 수신 (이미지에 나온 형식 그대로 사용)
    socket.on('messageRead', (data) => {
      console.log('메시지 읽음 상태 수신:', data);
      // data = { user_id, last_read_message_id }
      
      // 채팅방 컴포넌트에서 처리하므로 여기서는 필요한 작업만 수행
      // 필요시 구현 추가
    });

    // 연결 끊김 이벤트
    socket.on('disconnect', () => {
      console.log('소켓 연결 끊김');
      setIsAuthenticated(false);
    });

    // 컴포넌트 언마운트 시 이벤트 리스너 정리
    return () => {
      socket.off('connect', handleConnect);
      socket.off('notification', handleNotification);
      socket.off('pending_notifications');
      socket.off('messageRead');
      socket.off('disconnect');
    };
  }, [userId, isAuthenticated, showBrowserNotification]);

  // 초기 데이터 로드
  useEffect(() => {
    if (userId) {
      fetchNotifications();
      fetchUnreadCount();
    }
  }, [userId, fetchNotifications, fetchUnreadCount]);

  // 브라우저 알림 권한 요청
  useEffect(() => {
    if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
  }, []);

  // 제공할 값
  const value = {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    markChatNotificationsAsRead,
    deleteNotification,
    fetchNotifications,
    fetchUnreadCount
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}; 