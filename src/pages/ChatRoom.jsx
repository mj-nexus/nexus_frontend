import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { socket, joinChatRoom, sendMessage, readMessages } from '../utils/socketUtil';
import { useAuth } from '../contexts/AuthContext';
import { useWebSocket } from '../contexts/WebSocketContext';
import { useNotification } from '../contexts/NotificationContext';
import '../styles/ChatRoom.css';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SendIcon from '@mui/icons-material/Send';
import DraftsIcon from '@mui/icons-material/Drafts';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import SubjectIcon from '@mui/icons-material/Subject';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import Modal from '@mui/material/Modal';
import { toast } from 'react-toastify';

const ChatRoom = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { fetchNotifications, markChatNotificationsAsRead } = useNotification();
  const { onlineUsers } = useWebSocket();
  
  const [loading, setLoading] = useState(true);
  const [room, setRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [participants, setParticipants] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [showParticipants, setShowParticipants] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [fileAttachment, setFileAttachment] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loadingMoreMessages, setLoadingMoreMessages] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [page, setPage] = useState(1);
  const [readStatus, setReadStatus] = useState({});
  
  const messageContainerRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const fileInputRef = useRef(null);
  const prevScrollHeightRef = useRef(0);
  
  // 채팅방 정보 및 메시지 이력 로드
  useEffect(() => {
    const fetchRoomAndMessages = async () => {
      try {
        setLoading(true);
        // 채팅방 정보 로드
        const roomResponse = await fetch(`${process.env.REACT_APP_BACKEND_HOST}/api/chatrooms/${roomId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (!roomResponse.ok) {
          throw new Error('채팅방을 찾을 수 없습니다');
        }
        
        const roomData = await roomResponse.json();
        setRoom(roomData);
        
        // 채팅방 참여자 정보 로드
        const participantsResponse = await fetch(`${process.env.REACT_APP_BACKEND_HOST}/api/chatrooms/${roomId}/participants`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (participantsResponse.ok) {
          const participantsData = await participantsResponse.json();
          setParticipants(participantsData);
        }
        
        // 메시지 이력 로드
        const messagesResponse = await fetch(`${process.env.REACT_APP_BACKEND_HOST}/api/chatrooms/${roomId}/messages?page=1&limit=30`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (messagesResponse.ok) {
          const messagesData = await messagesResponse.json();
          setMessages(messagesData.messages || messagesData);
          
          // 더 로드할 메시지가 있는지 확인
          if (messagesData.hasMore !== undefined) {
            setHasMoreMessages(messagesData.hasMore);
          } else {
            setHasMoreMessages(messagesData.length >= 30);
          }
          
          // 메시지 읽음 상태 초기화
          const readStatusObj = {};
          messagesData.messages?.forEach(msg => {
            readStatusObj[msg.id] = msg.read_by || [];
          });
          setReadStatus(readStatusObj);
        }
        
        setLoading(false);
        
        // 채팅방 관련 알림 자동 읽음 처리
        if (markChatNotificationsAsRead) {
          try {
            console.log(`채팅방 ${roomId} 알림 읽음 처리 시작`);
            await markChatNotificationsAsRead(roomId);
            console.log(`채팅방 ${roomId} 알림 읽음 처리 완료`);
          } catch (error) {
            console.error('채팅방 알림 읽음 처리 실패:', error);
          }
        }
      } catch (error) {
        console.error('채팅방 정보 로딩 실패:', error);
        toast.error('채팅방 정보를 불러오는데 실패했습니다');
        navigate('/chats');
      }
    };
    
    if (roomId && user) {
      fetchRoomAndMessages();
    }
  }, [roomId, user, navigate, markChatNotificationsAsRead]);
  
  // 이전 메시지 로드
  const loadMoreMessages = async () => {
    if (!hasMoreMessages || loadingMoreMessages) return;
    
    try {
      setLoadingMoreMessages(true);
      const nextPage = page + 1;
      
      const response = await fetch(`${process.env.REACT_APP_BACKEND_HOST}/api/chatrooms/${roomId}/messages?page=${nextPage}&limit=30`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        const olderMessages = data.messages || data;
        
        if (olderMessages.length > 0) {
          // 스크롤 위치 보존을 위해 현재 스크롤 높이 저장
          if (messageContainerRef.current) {
            prevScrollHeightRef.current = messageContainerRef.current.scrollHeight;
          }
          
          // 새 메시지 추가
          setMessages(prev => [...olderMessages, ...prev]);
          
          // 읽음 상태 업데이트
          const newReadStatus = { ...readStatus };
          olderMessages.forEach(msg => {
            newReadStatus[msg.id] = msg.read_by || [];
          });
          setReadStatus(newReadStatus);
          
          // 페이지 업데이트
          setPage(nextPage);
          
          // 더 로드할 메시지가 있는지 확인
          if (data.hasMore !== undefined) {
            setHasMoreMessages(data.hasMore);
          } else {
            setHasMoreMessages(olderMessages.length >= 30);
          }
        } else {
          setHasMoreMessages(false);
        }
      } else {
        throw new Error('이전 메시지를 불러오는데 실패했습니다');
      }
    } catch (error) {
      console.error('이전 메시지 로드 실패:', error);
      toast.error('이전 메시지를 불러오는데 실패했습니다');
    } finally {
      setLoadingMoreMessages(false);
    }
  };
  
  // 이전 메시지 로드 후 스크롤 위치 조정
  useEffect(() => {
    if (loadingMoreMessages === false && prevScrollHeightRef.current > 0 && messageContainerRef.current) {
      const newScrollHeight = messageContainerRef.current.scrollHeight;
      const scrollDiff = newScrollHeight - prevScrollHeightRef.current;
      messageContainerRef.current.scrollTop = scrollDiff;
      prevScrollHeightRef.current = 0;
    }
  }, [loadingMoreMessages, messages]);
  
  // 스크롤 이벤트 처리
  const handleScroll = () => {
    if (messageContainerRef.current) {
      // 스크롤이 상단에 가까워지면 이전 메시지 로드
      if (messageContainerRef.current.scrollTop < 50 && hasMoreMessages && !loadingMoreMessages) {
        loadMoreMessages();
      }
    }
  };
  
  // 스크롤 이벤트 리스너 등록
  useEffect(() => {
    const container = messageContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [hasMoreMessages, loadingMoreMessages]);
  
  // 소켓 연결 및 이벤트 핸들러 설정
  useEffect(() => {
    if (!roomId || !user || !socket) return;
    
    // 채팅방 참여
    const joinRoom = () => {
      const joined = joinChatRoom(roomId);
      if (joined) {
        console.log(`채팅방 ${roomId}에 참여했습니다`);
        setIsJoined(true);
        
        // 채팅방 관련 알림 자동 읽음 처리
        if (fetchNotifications && markChatNotificationsAsRead) {
          fetchNotifications()
            .then(() => markChatNotificationsAsRead(roomId))
            .catch(error => console.error('채팅방 알림 읽음 처리 실패:', error));
          
          // 메시지가 있을 경우 마지막 메시지 읽음 처리
          if (messages.length > 0) {
            const lastMessageId = messages[messages.length - 1].id;
            handleMessageRead(lastMessageId);
          }
        }
      } else {
        // 연결 완료 후 채팅방 참여 시도
        socket.once('connect', () => {
          joinChatRoom(roomId);
          setIsJoined(true);
          
          // 채팅방 관련 알림 자동 읽음 처리
          if (fetchNotifications && markChatNotificationsAsRead) {
            fetchNotifications()
              .then(() => markChatNotificationsAsRead(roomId))
              .catch(error => console.error('채팅방 알림 읽음 처리 실패:', error));
          }
        });
      }
    };
    
    // 이미 소켓이 연결되어 있으면 바로 채팅방 참여
    if (socket.connected) {
      joinRoom();
    } else {
      // 소켓 연결이 되어 있지 않으면 연결 완료 후 채팅방 참여
      socket.on('connect', joinRoom);
    }
    
    // 메시지 수신 이벤트 핸들러
    const handleNewMessage = (message) => {
      if (message.chat_room_id === roomId) {
        setMessages((prevMessages) => [...prevMessages, message]);
        
        // 읽음 상태 초기화
        setReadStatus(prev => ({
          ...prev,
          [message.id]: message.read_by || []
        }));
        
        // 채팅방을 보고 있으면 새 메시지 알림 표시하지 않음 (이미 읽음 처리)
        if (message.sender_id !== user.id) {
          // 메시지 읽음 상태를 서버에 알림
          handleMessageRead(message.id);
          
          // 채팅방 관련 알림 자동 읽음 처리
          if (markChatNotificationsAsRead) {
            markChatNotificationsAsRead(roomId)
              .catch(error => console.error('메시지 알림 읽음 처리 실패:', error));
          }
        }
      }
    };
    
    // 타이핑 상태 이벤트 핸들러
    const handleUserTyping = ({ user_id, username, room_id }) => {
      if (room_id === roomId && user_id !== user.id) {
        setTypingUsers((prev) => {
          if (!prev.some((u) => u.id === user_id)) {
            return [...prev, { id: user_id, username }];
          }
          return prev;
        });
        
        // 3초 후 타이핑 상태 제거
        setTimeout(() => {
          setTypingUsers((prev) => prev.filter((u) => u.id !== user_id));
        }, 3000);
      }
    };
    
    // 읽음 상태 업데이트 이벤트 핸들러
    const handleMessageReadEvent = (data) => {
      if (!data.user_id || !data.last_read_message_id || data.user_id === user.id) return;
      
      // 모든 메시지에 대해 마지막으로 읽은 메시지까지 읽음 상태 업데이트
      const messagesArr = [...messages];
      const lastReadIndex = messagesArr.findIndex(msg => msg.id === data.last_read_message_id);
      
      if (lastReadIndex >= 0) {
        // 마지막으로 읽은 메시지까지 모든 메시지 읽음 상태 업데이트
        setReadStatus(prev => {
          const newReadStatus = { ...prev };
          
          // 0부터 lastReadIndex까지의 모든 메시지를 읽음 처리
          for (let i = 0; i <= lastReadIndex; i++) {
            const msgId = messagesArr[i].id;
            if (newReadStatus[msgId]) {
              if (!newReadStatus[msgId].includes(data.user_id)) {
                newReadStatus[msgId] = [...newReadStatus[msgId], data.user_id];
              }
            } else {
              newReadStatus[msgId] = [data.user_id];
            }
          }
          
          return newReadStatus;
        });
      }
    };
    
    // 이벤트 리스너 등록
    socket.on('newMessage', handleNewMessage);
    socket.on('userTyping', handleUserTyping);
    socket.on('messageRead', handleMessageReadEvent);
    
    // 컴포넌트 언마운트 시 이벤트 리스너 정리 및 채팅방 나가기
    return () => {
      socket.off('connect', joinRoom);
      socket.off('newMessage', handleNewMessage);
      socket.off('userTyping', handleUserTyping);
      socket.off('messageRead', handleMessageReadEvent);
      
      // 채팅방 나가기
      if (socket.connected) {
        socket.emit('leaveRoom', roomId);
        console.log(`채팅방 ${roomId}에서 나갔습니다`);
      }
    };
  }, [roomId, user, fetchNotifications, markChatNotificationsAsRead, messages]);
  
  // 새 메시지가 추가되면 스크롤을 최하단으로 이동
  useEffect(() => {
    if (messageContainerRef.current && !loadingMoreMessages) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages.length, loadingMoreMessages]);
  
  // 메시지 전송 함수를 수정된 socketUtil.js와 호환되도록 변경
  const handleSendMessage = async () => {
    if ((!newMessage.trim() && !fileAttachment) || !user || !roomId) return;
    
    try {
      let fileUrl = null;
      
      // 파일이 첨부된 경우 업로드
      if (fileAttachment) {
        setUploading(true);
        const formData = new FormData();
        formData.append('file', fileAttachment);
        
        const uploadResponse = await fetch(`${process.env.REACT_APP_BACKEND_HOST}/api/uploads`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: formData
        });
        
        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          fileUrl = uploadData.url;
        } else {
          throw new Error('파일 업로드 실패');
        }
        
        setUploading(false);
        setFileAttachment(null);
      }
      
      // 메시지 데이터 준비 (이미지에 나온 형식으로 변경)
      const messageData = {
        chat_room_id: roomId,
        sender_id: user.id,
        content: newMessage.trim(),
        message_type: fileUrl ? 'file' : 'text',
        file_url: fileUrl
      };
      
      // 소켓으로 메시지 전송
      if (socket && socket.connected) {
        socket.emit('sendMessage', messageData);
        
        // 메시지 전송 후 입력창 초기화
        setNewMessage('');
        
        // 타이핑 상태 초기화
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
      } else {
        toast.error('서버에 연결되어 있지 않습니다. 잠시 후 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('메시지 전송 오류:', error);
      toast.error('메시지 전송 중 오류가 발생했습니다');
    }
  };
  
  // 키보드 입력 핸들러
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  // 타이핑 상태 전송 함수 수정
  const handleTyping = () => {
    if (!socket || !socket.connected || !user || !roomId) return;
    
    socket.emit('typing', {
      user_id: user.id,
      username: user.username,
      room_id: roomId
    });
    
    // 타이핑 타임아웃 설정 (중복 이벤트 방지)
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      typingTimeoutRef.current = null;
    }, 2000);
  };
  
  // 파일 첨부 핸들러
  const handleFileAttachment = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 10 * 1024 * 1024) { // 10MB 제한
      setFileAttachment(file);
    } else if (file) {
      toast.error('파일 크기는 10MB 이하여야 합니다');
    }
  };
  
  // 파일 첨부 취소
  const handleCancelAttachment = () => {
    setFileAttachment(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // 채팅방 나가기
  const handleLeaveChat = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_HOST}/api/chatrooms/${roomId}/leave`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        toast.success('채팅방에서 나갔습니다');
        navigate('/chats');
      } else {
        throw new Error('채팅방 나가기 실패');
      }
    } catch (error) {
      console.error('채팅방 나가기 오류:', error);
      toast.error('채팅방에서 나가기를 처리할 수 없습니다');
    }
  };
  
  // 메시지 포맷 변환 (타임스탬프 등)
  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const formatMessageDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };
  
  // 메시지 그룹화 (날짜별)
  const groupMessagesByDate = () => {
    const groups = {};
    
    messages.forEach((message) => {
      const date = formatMessageDate(message.sent_at);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    
    return Object.entries(groups).map(([date, messages]) => ({
      date,
      messages
    }));
  };
  
  // 사용자가 온라인인지 확인
  const isUserOnline = (userId) => {
    return onlineUsers.includes(userId);
  };
  
  // 메시지 읽음 처리 함수 정의
  const handleMessageRead = (messageId) => {
    if (!socket.connected || !user || !roomId || !messageId) return;
    
    // socketUtil의 readMessages 함수 사용
    readMessages(user.id, roomId, messageId);
  };
  
  // 로딩 중 표시
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  // 참여자 목록 모달
  const participantsModal = (
    <Modal
      open={showParticipants}
      onClose={() => setShowParticipants(false)}
      aria-labelledby="participants-modal-title"
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: 2
      }}>
        <Typography id="participants-modal-title" variant="h6" component="h2" gutterBottom>
          대화 참여자 ({participants.length})
        </Typography>
        <List>
          {participants.map((participant) => (
            <ListItem key={participant.id}>
              <ListItemAvatar>
                <Avatar src={participant.avatar_url || '/default-avatar.png'} />
              </ListItemAvatar>
              <ListItemText
                primary={participant.username}
                secondary={isUserOnline(participant.id) ? '온라인' : '오프라인'}
              />
              <Chip
                size="small"
                color={isUserOnline(participant.id) ? 'success' : 'default'}
                label={isUserOnline(participant.id) ? '온라인' : '오프라인'}
              />
            </ListItem>
          ))}
        </List>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button onClick={() => setShowParticipants(false)}>닫기</Button>
        </Box>
      </Box>
    </Modal>
  );
  
  // 메시지 그룹 렌더링
  const messageGroups = groupMessagesByDate();
  
  return (
    <Container maxWidth="md" sx={{ mt: 2, mb: 4 }}>
      {room && (
        <Paper elevation={3} sx={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
          {/* 채팅방 헤더 */}
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
            <Grid container alignItems="center" spacing={1}>
              <Grid item>
                <Avatar>{room.name[0]}</Avatar>
              </Grid>
              <Grid item xs>
                <Typography variant="h6">{room.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {participants.length}명 참여 중
                </Typography>
              </Grid>
              <Grid item>
                <IconButton color="primary" onClick={() => setShowParticipants(true)}>
                  <SubjectIcon />
                </IconButton>
                <IconButton color="error" onClick={handleLeaveChat}>
                  <ExitToAppIcon />
                </IconButton>
              </Grid>
            </Grid>
          </Box>
          
          {/* 메시지 컨테이너 */}
          <Box
            ref={messageContainerRef}
            sx={{
              p: 2,
              flexGrow: 1,
              overflow: 'auto',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* 이전 메시지 로딩 표시 */}
            {loadingMoreMessages && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <CircularProgress size={24} />
              </Box>
            )}
            
            {/* 더 이상 메시지가 없음 표시 */}
            {!hasMoreMessages && !loadingMoreMessages && (
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  이전 메시지가 없습니다
                </Typography>
              </Box>
            )}
            
            {messageGroups.map((group, groupIndex) => (
              <Box key={groupIndex} sx={{ mb: 2 }}>
                <Divider sx={{ my: 2 }}>
                  <Chip label={group.date} size="small" />
                </Divider>
                
                {group.messages.map((message, index) => {
                  const isCurrentUser = message.sender_id === user.id;
                  const sender = participants.find(p => p.id === message.sender_id) || { username: '알 수 없음' };
                  const hasBeenRead = readStatus[message.id]?.some(id => id !== user.id) || false;
                  
                  return (
                    <Box
                      key={message.id || index}
                      sx={{
                        display: 'flex',
                        flexDirection: isCurrentUser ? 'row-reverse' : 'row',
                        mb: 2,
                        alignItems: 'flex-end'
                      }}
                    >
                      {!isCurrentUser && (
                        <Avatar
                          src={sender.avatar_url || '/default-avatar.png'}
                          sx={{ width: 36, height: 36, mr: 1 }}
                        />
                      )}
                      
                      <Box>
                        {!isCurrentUser && (
                          <Typography variant="body2" sx={{ mb: 0.5, ml: 1 }}>
                            {sender.username}
                          </Typography>
                        )}
                        
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: isCurrentUser ? 'row-reverse' : 'row',
                            alignItems: 'flex-end'
                          }}
                        >
                          <Paper
                            variant="outlined"
                            sx={{
                              p: 1.5,
                              maxWidth: '70%',
                              borderRadius: 2,
                              bgcolor: isCurrentUser ? 'primary.light' : 'background.default',
                              color: isCurrentUser ? 'primary.contrastText' : 'text.primary'
                            }}
                          >
                            {message.file_url && (
                              <Box sx={{ mb: 1 }}>
                                {message.file_url.match(/\.(jpeg|jpg|gif|png)$/i) ? (
                                  <img
                                    src={message.file_url}
                                    alt="첨부 이미지"
                                    style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px' }}
                                  />
                                ) : (
                                  <Button
                                    variant="outlined"
                                    size="small"
                                    startIcon={<AttachFileIcon />}
                                    href={message.file_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    첨부 파일
                                  </Button>
                                )}
                              </Box>
                            )}
                            
                            {message.content && (
                              <Typography variant="body1" sx={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
                                {message.content}
                              </Typography>
                            )}
                          </Paper>
                          
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ mx: 1 }}
                          >
                            {formatMessageTime(message.sent_at)}
                          </Typography>
                          
                          {isCurrentUser && hasBeenRead && (
                            <DraftsIcon fontSize="small" color="primary" sx={{ fontSize: 16 }} />
                          )}
                        </Box>
                      </Box>
                      
                      {isCurrentUser && (
                        <Avatar
                          src={user.avatar_url || '/default-avatar.png'}
                          sx={{ width: 36, height: 36, ml: 1 }}
                        />
                      )}
                    </Box>
                  );
                })}
              </Box>
            ))}
            
            {/* 타이핑 표시 */}
            {typingUsers.length > 0 && (
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <HourglassEmptyIcon fontSize="small" sx={{ mr: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  {typingUsers.map(u => u.username).join(', ')}님이 입력 중...
                </Typography>
              </Box>
            )}
          </Box>
          
          {/* 메시지 입력 영역 */}
          <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
            {fileAttachment && (
              <Box sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                <Chip
                  label={fileAttachment.name}
                  onDelete={handleCancelAttachment}
                  color="primary"
                  variant="outlined"
                  size="small"
                />
              </Box>
            )}
            
            <Grid container spacing={1} alignItems="center">
              <Grid item>
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleFileAttachment}
                  accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
                />
                <IconButton
                  color="primary"
                  component="span"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  <AttachFileIcon />
                </IconButton>
              </Grid>
              
              <Grid item xs>
                <TextField
                  fullWidth
                  multiline
                  maxRows={3}
                  placeholder="메시지를 입력하세요..."
                  value={newMessage}
                  onChange={(e) => {
                    setNewMessage(e.target.value);
                    handleTyping();
                  }}
                  onKeyPress={handleKeyPress}
                  disabled={uploading}
                  InputProps={{
                    sx: { borderRadius: 3 }
                  }}
                />
              </Grid>
              
              <Grid item>
                <IconButton
                  color="primary"
                  onClick={handleSendMessage}
                  disabled={(!newMessage.trim() && !fileAttachment) || uploading}
                >
                  {uploading ? <CircularProgress size={24} /> : <SendIcon />}
                </IconButton>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      )}
      
      {participantsModal}
    </Container>
  );
};

export default ChatRoom; 