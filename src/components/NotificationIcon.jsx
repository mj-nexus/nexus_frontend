import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../contexts/NotificationContext';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Popover from '@mui/material/Popover';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import CloseIcon from '@mui/icons-material/Close';
import ChatIcon from '@mui/icons-material/Chat';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EventIcon from '@mui/icons-material/Event';
import CircularProgress from '@mui/material/CircularProgress';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { toast } from 'react-toastify';

const NotificationIcon = () => {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead,
    deleteNotification,
    fetchNotifications,
    isLoading
  } = useNotification();
  
  const navigate = useNavigate();
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [localNotifications, setLocalNotifications] = useState([]);
  const [isLocalLoading, setIsLocalLoading] = useState(false);
  const open = Boolean(anchorEl);
  
  // 로컬 알림 상태 업데이트
  useEffect(() => {
    if (notifications && Array.isArray(notifications)) {
      setLocalNotifications(notifications);
    } else {
      console.error('알림 데이터가 유효한 배열이 아닙니다:', notifications);
      setLocalNotifications([]);
    }
  }, [notifications]);
  
  // 컴포넌트 마운트 시 알림 데이터 로드
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        setIsLocalLoading(true);
        if (fetchNotifications) {
          await fetchNotifications();
        }
      } catch (error) {
        console.error('알림 데이터 로드 중 오류 발생:', error);
        toast.error('알림을 불러오는 중 오류가 발생했습니다');
      } finally {
        setIsLocalLoading(false);
      }
    };
    
    loadNotifications();
  }, [fetchNotifications]);
  
  const handleClick = useCallback(async (event) => {
    try {
      setAnchorEl(event.currentTarget);
      setIsLocalLoading(true);
      
      // 알림 팝업이 열리면 최신 알림 데이터 가져오기
      if (fetchNotifications) {
        await fetchNotifications();
      }
    } catch (error) {
      console.error('알림 데이터 새로고침 중 오류 발생:', error);
    } finally {
      setIsLocalLoading(false);
    }
  }, [fetchNotifications]);
  
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  // 알림 클릭 처리
  const handleNotificationClick = useCallback(async (notification) => {
    try {
      if (!notification) {
        console.error('알림 객체가 유효하지 않습니다');
        return;
      }
      
      console.log('클릭한 알림:', notification);
      
      // 읽음 표시
      if (!notification.read && markAsRead) {
        await markAsRead(notification.id);
      }
      
      // 알림 유형에 따른 네비게이션
      if (notification.type === 'message') {
        // 메시지 알림의 경우 채팅방으로 이동
        const roomId = notification.data?.roomId || notification.chat_room_id;
        if (roomId) {
          navigate(`/chat/${roomId}`);
        } else {
          console.error('메시지 알림에 채팅방 ID가 없습니다', notification);
          toast.error('채팅방을 찾을 수 없습니다');
        }
      } else if (notification.type === 'friend_request') {
        navigate('/friends');
      } else if (notification.type === 'event' && notification.data?.eventId) {
        navigate(`/events/${notification.data.eventId}`);
      } else if (notification.data?.url) {
        // 알림에 URL이 포함된 경우 해당 URL로 이동
        navigate(notification.data.url);
      } else {
        console.log('알림에 이동할 경로가 지정되지 않았습니다');
      }
      
      handleClose();
    } catch (error) {
      console.error('알림 처리 오류:', error);
      toast.error('알림 처리 중 오류가 발생했습니다');
    }
  }, [markAsRead, navigate]);
  
  // 알림 삭제
  const handleDeleteNotification = useCallback(async (e, notificationId) => {
    if (!notificationId) {
      console.error('삭제할 알림 ID가 유효하지 않습니다');
      return;
    }
    
    e.stopPropagation(); // 클릭 이벤트 전파 방지
    try {
      if (deleteNotification) {
        await deleteNotification(notificationId);
        toast.success('알림이 삭제되었습니다');
      }
    } catch (error) {
      console.error('알림 삭제 오류:', error);
      toast.error('알림 삭제 중 오류가 발생했습니다');
    }
  }, [deleteNotification]);
  
  // 모든 알림 읽음 처리
  const handleMarkAllAsRead = useCallback(async () => {
    try {
      if (markAllAsRead) {
        await markAllAsRead();
        toast.success('모든 알림을 읽음 처리했습니다');
      }
    } catch (error) {
      console.error('알림 읽음 처리 오류:', error);
      toast.error('알림 읽음 처리 중 오류가 발생했습니다');
    }
  }, [markAllAsRead]);
  
  // 알림 시간 포맷팅
  const formatNotificationTime = useCallback((timestamp) => {
    if (!timestamp) return '알 수 없는 시간';
    
    try {
      return formatDistanceToNow(new Date(timestamp), { 
        addSuffix: true,
        locale: ko 
      });
    } catch (error) {
      console.error('날짜 포맷팅 오류:', error, timestamp);
      return '알 수 없는 시간';
    }
  }, []);

  // 알림 목록 렌더링
  const renderNotificationList = () => {
    if (isLoading || isLocalLoading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress size={40} />
        </Box>
      );
    }
    
    if (!localNotifications || localNotifications.length === 0) {
      return (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <NotificationsOffIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
          <Typography color="text.secondary">알림이 없습니다</Typography>
        </Box>
      );
    }
    
    return (
      <List sx={{ p: 0, maxHeight: 400, overflow: 'auto' }}>
        {localNotifications.map((notification, index) => {
          if (!notification) return null;
          
          return (
            <React.Fragment key={notification.id || `notification-${index}`}>
              <ListItem
                alignItems="flex-start"
                sx={{ 
                  cursor: 'pointer',
                  py: 1.5,
                  px: 2,
                  bgcolor: notification.read ? 'transparent' : 'action.hover',
                  '&:hover': { bgcolor: 'action.selected' }
                }}
                onClick={() => handleNotificationClick(notification)}
                secondaryAction={
                  <IconButton 
                    edge="end" 
                    aria-label="삭제" 
                    size="small" 
                    onClick={(e) => handleDeleteNotification(e, notification.id)}
                    sx={{ '&:hover': { color: 'error.main' } }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                }
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: getNotificationColor(notification.type) }}>
                    {getNotificationIcon(notification.type)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography
                      variant="subtitle2"
                      color="text.primary"
                      sx={{ 
                        fontWeight: notification.read ? 'normal' : 'bold',
                        mb: 0.5
                      }}
                    >
                      {notification.title || getDefaultTitle(notification.type)}
                    </Typography>
                  }
                  secondary={
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      {notification.sender_name && (
                        <Typography
                          component="span"
                          variant="body2"
                          color="primary.main"
                          sx={{ fontWeight: 'medium' }}
                        >
                          {notification.sender_name}
                        </Typography>
                      )}
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.primary"
                        sx={{ 
                          mb: 0.5,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          wordBreak: 'break-word'
                        }}
                      >
                        {notification.content}
                      </Typography>
                      <Typography
                        component="span"
                        variant="caption"
                        color="text.secondary"
                      >
                        {formatNotificationTime(notification.created_at)}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
              <Divider component="li" />
            </React.Fragment>
          );
        })}
      </List>
    );
  };

  return (
    <div>
      <IconButton
        color="inherit"
        onClick={handleClick}
        aria-label="알림"
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        <Badge badgeContent={unreadCount || 0} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            width: { xs: 300, sm: 360 },
            maxHeight: 500,
            overflow: 'hidden',
            mt: 1,
            boxShadow: 3,
            borderRadius: 2
          }
        }}
      >
        <Box sx={{ 
          p: 2, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          bgcolor: 'primary.main', 
          color: 'white',
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8
        }}>
          <Typography variant="h6">
            알림 {unreadCount > 0 && `(${unreadCount})`}
          </Typography>
          {unreadCount > 0 && (
            <Button 
              size="small" 
              variant="outlined" 
              color="inherit" 
              onClick={handleMarkAllAsRead}
              startIcon={<NotificationsOffIcon />}
            >
              모두 읽음
            </Button>
          )}
        </Box>
        
        <Divider />
        
        {renderNotificationList()}
      </Popover>
    </div>
  );
};

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

// 알림 유형에 따른 색상 설정
const getNotificationColor = (type) => {
  switch (type) {
    case 'message':
      return 'primary.main';
    case 'friend_request':
      return 'success.main';
    case 'event':
      return 'warning.main';
    default:
      return 'info.main';
  }
};

// 알림 유형에 따른 아이콘 설정
const getNotificationIcon = (type) => {
  switch (type) {
    case 'message':
      return <ChatIcon />;
    case 'friend_request':
      return <PersonAddIcon />;
    case 'event':
      return <EventIcon />;
    default:
      return <NotificationsIcon />;
  }
};

export default NotificationIcon; 