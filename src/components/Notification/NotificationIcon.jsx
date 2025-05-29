import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNotification } from "../../contexts/NotificationContext";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import './NotificationIcon.scss';

const NotificationIcon = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification, 
    fetchNotifications, 
    fetchUnreadCount 
  } = useNotification();
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const bellAnimationControls = useAnimation();
  
  // 새 알림이 오면 벨 아이콘 애니메이션 시작
  useEffect(() => {
    if (unreadCount > 0) {
      bellAnimationControls.start({
        rotate: [0, -10, 10, -10, 10, 0],
        transition: { duration: 0.5, ease: "easeInOut" }
      });
    }
  }, [unreadCount, bellAnimationControls]);

  // 컴포넌트 마운트 시 알림 목록과 읽지 않은 알림 개수 가져오기
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        setIsLoading(true);
        await Promise.all([fetchNotifications(), fetchUnreadCount()]);
      } catch (error) {
        console.error('알림 로드 오류:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadNotifications();
    
    // 1분마다 알림 개수 업데이트
    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 60000);
    
    return () => clearInterval(interval);
  }, [fetchNotifications, fetchUnreadCount]);

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 알림 아이콘 클릭 시 최신 데이터 가져오기
  const handleIconClick = useCallback(async () => {
    try {
      setShowDropdown(!showDropdown);
      
      if (!showDropdown) {
        setIsLoading(true);
        await Promise.all([fetchNotifications(), fetchUnreadCount()]);
      }
    } catch (error) {
      console.error('알림 새로고침 오류:', error);
    } finally {
      setIsLoading(false);
    }
  }, [showDropdown, fetchNotifications, fetchUnreadCount]);

  // 알림 클릭 처리
  const handleNotificationClick = useCallback(async (notification) => {
    try {
      if (!notification) return;
      
      // 읽음 처리
      if (!notification.read) {
        await markAsRead(notification.id);
      }

      // 알림 유형에 따라 다른 페이지로 이동
      if (notification.type === 'message') {
        const roomId = notification.data?.roomId || notification.chat_room_id;
        if (roomId) {
          navigate(`/chat/${roomId}`);
        } else {
          toast.info('해당 채팅방을 찾을 수 없습니다');
        }
      } else if (notification.type === 'board') {
        const postId = notification.data?.postId || notification.post_id;
        if (postId) {
          navigate(`/board/${postId}`);
        }
      } else if (notification.type === 'study') {
        const studyId = notification.data?.studyId || notification.study_id;
        if (studyId) {
          navigate(`/study/${studyId}`);
        }
      } else if (notification.type === 'friend_request') {
        navigate('/friends');
      } else if (notification.data?.url) {
        navigate(notification.data.url);
      }

      setShowDropdown(false);
    } catch (error) {
      console.error('알림 처리 오류:', error);
      toast.error('알림 처리 중 오류가 발생했습니다');
    }
  }, [markAsRead, navigate]);

  // 모든 알림 읽음 처리
  const handleMarkAllAsRead = useCallback(async (e) => {
    try {
      e.stopPropagation();
      setIsLoading(true);
      await markAllAsRead();
      toast.success('모든 알림을 읽음 처리했습니다');
    } catch (error) {
      console.error('모든 알림 읽음 처리 오류:', error);
      toast.error('알림 읽음 처리 중 오류가 발생했습니다');
    } finally {
      setIsLoading(false);
    }
  }, [markAllAsRead]);

  // 알림 삭제
  const handleDeleteNotification = useCallback(async (e, notificationId) => {
    try {
      e.stopPropagation();
      e.preventDefault();
      setIsLoading(true);
      await deleteNotification(notificationId);
      toast.success('알림이 삭제되었습니다');
    } catch (error) {
      console.error('알림 삭제 오류:', error);
      toast.error('알림 삭제 중 오류가 발생했습니다');
    } finally {
      setIsLoading(false);
    }
  }, [deleteNotification]);

  // 날짜 형식 변환
  const formatDate = useCallback((dateString) => {
    if (!dateString) return '알 수 없음';
    
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diff = now - date;

      // 1시간 이내
      if (diff < 3600000) {
        const minutes = Math.floor(diff / 60000);
        return `${minutes}분 전`;
      }
      // 24시간 이내
      else if (diff < 86400000) {
        const hours = Math.floor(diff / 3600000);
        return `${hours}시간 전`;
      }
      // 7일 이내
      else if (diff < 604800000) {
        const days = Math.floor(diff / 86400000);
        return `${days}일 전`;
      }
      // 그 외
      else {
        return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
      }
    } catch (error) {
      console.error('날짜 포맷팅 오류:', error, dateString);
      return '알 수 없음';
    }
  }, []);

  // 알림 타입에 따른 아이콘 클래스 가져오기
  const getNotificationIconClass = (type) => {
    switch (type) {
      case 'message':
        return 'notification-icon message';
      case 'board':
        return 'notification-icon board';
      case 'study':
        return 'notification-icon study';
      case 'friend_request':
        return 'notification-icon friend';
      default:
        return 'notification-icon default';
    }
  };

  // 알림 유형에 따른 기본 제목 가져오기
  const getNotificationType = (type) => {
    switch (type) {
      case 'message':
        return '새 메시지';
      case 'board':
        return '게시판 알림';
      case 'study':
        return '스터디 알림';
      case 'friend_request':
        return '친구 요청';
      default:
        return '알림';
    }
  };

  // 알림 렌더링
  const renderNotifications = () => {
    if (isLoading) {
      return (
        <div className="notification-loading">
          <div className="notification-loader"></div>
          <p>알림을 불러오는 중...</p>
        </div>
      );
    }
    
    if (!notifications || notifications.length === 0) {
      return (
        <div className="notification-empty">
          <div className="notification-empty-icon"></div>
          <p>알림이 없습니다</p>
          <span>새로운 알림이 오면 여기에 표시됩니다</span>
        </div>
      );
    }
    
    return (
      <ul className="notification-list">
        {notifications.map((notification, index) => {
          if (!notification) return null;
          
          return (
            <motion.li
              key={notification.id || `notification-${Math.random()}`}
              className={`notification-item ${notification.read ? 'read' : 'unread'}`}
              onClick={() => handleNotificationClick(notification)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ 
                duration: 0.2, 
                delay: index * 0.05 // 순차적으로 나타나는 효과
              }}
              whileHover={{ 
                scale: 1.01,
                boxShadow: "0 2px 5px rgba(0,0,0,0.05)" 
              }}
            >
              <div className={getNotificationIconClass(notification.type)}></div>
              <div className="notification-content">
                <div className="notification-header">
                  <h4>{notification.title || getNotificationType(notification.type)}</h4>
                  <div className="notification-time">{formatDate(notification.created_at)}</div>
                </div>
                <p className="notification-message">{notification.content}</p>
                {notification.sender_name && (
                  <div className="notification-sender">{notification.sender_name}</div>
                )}
              </div>
              <motion.button
                className="notification-delete"
                onClick={(e) => handleDeleteNotification(e, notification.id)}
                aria-label="알림 삭제"
                whileHover={{ scale: 1.1, backgroundColor: "rgba(244, 67, 54, 0.1)" }}
                whileTap={{ scale: 0.95 }}
              >
                <span></span>
              </motion.button>
            </motion.li>
          );
        })}
      </ul>
    );
  };

  return (
    <div className="notification-container" ref={dropdownRef}>
      <motion.button
        className={`notification-bell ${showDropdown ? 'active' : ''} ${unreadCount > 0 ? 'has-badge' : ''}`}
        onClick={handleIconClick}
        aria-label="알림"
        animate={bellAnimationControls}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="notification-bell-icon"></span>
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span 
              className="notification-badge"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
      
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            className="notification-dropdown"
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.2, type: "spring", stiffness: 350, damping: 25 }}
          >
            <div className="notification-header-bar">
              <h3>알림 센터</h3>
              {unreadCount > 0 && (
                <motion.button 
                  className="mark-all-read"
                  onClick={handleMarkAllAsRead}
                  disabled={isLoading}
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.3)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  모두 읽음
                </motion.button>
              )}
            </div>
            <motion.div 
              className="notification-body"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              {renderNotifications()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationIcon; 