import React, { useEffect, useState, useRef } from "react";
import { socket, sendMessage as sendSocketMessage } from "../../utils/socketUtil"
import { getChatLog } from "../../utils/messageUtil";
import { messageService } from "../../services/messageService";
import styles from "./Message.module.scss";
import { FaUserCircle, FaPaperPlane, FaEllipsisV, FaRegSmile, FaPaperclip, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ChatRoom = ({ roomId, currentUserId, roomInfo, onToggleRoomDetails }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const fetchChatLog = async (roomId) => {
    try {
      const res = await getChatLog(roomId);
      setMessages(res);
      scrollToBottom();
    }
    catch (err) {
      console.log("채팅로그 로딩 오류", err)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    socket.emit("joinRoom", roomId);

    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [roomId]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const payload = {
      chat_room_id: roomId,
      sender_id: currentUserId,
      content: input,
      message_type: "text",
    };

    sendSocketMessage({ data: payload });
    setInput("");
    
    // 메시지 전송 후 입력 필드에 포커스
    inputRef.current?.focus();
  };

  useEffect(() => {
    fetchChatLog(roomId);
  }, [roomId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 날짜 포맷팅 함수
  const formatTime = (date) => {
    const now = new Date(date || new Date());
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const period = hours >= 12 ? '오후' : '오전';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    
    return `${period} ${formattedHours}:${formattedMinutes}`;
  };

  // 채팅방 이름 가져오기
  const getChatRoomName = () => {
    if (!roomInfo) return "채팅방";
    return roomInfo.name || "채팅방";
  };

  // 그룹 채팅방인지 확인
  const isGroupChat = () => {
    return roomInfo && roomInfo.is_group === true;
  };

  // 발신자 이름 가져오기
  const getSenderName = (senderId) => {
    if (!roomInfo || !roomInfo.users) return "사용자";
    
    const sender = roomInfo.users.find(user => user.user_id.toString() === senderId.toString());
    if (!sender) return "사용자";
    
    return sender.nick_name || sender.user_name || `사용자 ${senderId}`;
  };

  // 메시지 그룹화 처리
  const groupMessages = (messages) => {
    if (!messages || messages.length === 0) return [];
    
    const groupedMessages = [];
    let currentGroup = null;
    
    messages.forEach((msg) => {
      const isCurrentUser = msg.sender_id == currentUserId;
      
      // 새 그룹 시작 조건: 첫 메시지이거나 이전 메시지와 발신자가 다른 경우
      if (
        !currentGroup || 
        currentGroup.isCurrentUser !== isCurrentUser ||
        currentGroup.senderId !== msg.sender_id
      ) {
        if (currentGroup) {
          groupedMessages.push(currentGroup);
        }
        
        currentGroup = {
          isCurrentUser,
          senderId: msg.sender_id,
          senderName: getSenderName(msg.sender_id),
          messages: [msg],
          time: formatTime(msg.sent_at)
        };
      } else {
        // 같은 발신자가 연속으로 보낸 메시지는 그룹에 추가
        currentGroup.messages.push(msg);
        // 그룹의 시간은 가장 마지막 메시지 시간으로 업데이트
        currentGroup.time = formatTime(msg.sent_at);
      }
    });
    
    // 마지막 그룹 추가
    if (currentGroup) {
      groupedMessages.push(currentGroup);
    }
    
    return groupedMessages;
  };

  const messageGroups = groupMessages(messages);

  // 메뉴 토글 함수
  const toggleMenu = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  // 채팅방 삭제 함수
  const handleDeleteRoom = async () => {
    if (window.confirm('정말로 이 채팅방을 삭제하시겠습니까?')) {
      try {
        await messageService.deleteChatRoom(roomId);
        navigate('/message'); // 메시지 목록 페이지로 이동
        window.location.reload(); // 채팅방 목록 새로고침
      } catch (error) {
        console.error('채팅방 삭제 실패:', error);
        alert('채팅방 삭제에 실패했습니다.');
      }
    }
  };

  // 메뉴 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={styles["chat-content"]}>
      <div className={styles["chat-header"]}>
        <div 
          className={styles["chat-avatar"]} 
          onClick={onToggleRoomDetails}
          title="방 정보 보기"
        >
          {isGroupChat() ? (
            <div className={styles["group-avatar"]}>
              <span>{getChatRoomName().charAt(0)}</span>
            </div>
          ) : (
            <FaUserCircle className={styles["user-avatar-icon"]} />
          )}
        </div>
        <div className={styles["chat-info"]}>
          <div className={styles["chat-title"]}>{getChatRoomName()}</div>
          <div className={styles["chat-subtitle"]}>
            {isGroupChat() ? "그룹 채팅방" : "일반 채팅"}
          </div>
        </div>
        <div className={styles["chat-actions"]} ref={menuRef}>
          <button 
            className={styles["chat-action-button"]}
            onClick={toggleMenu}
          >
            <FaEllipsisV />
          </button>
          {showMenu && (
            <div className={styles["chat-action-menu"]}>
              <button 
                className={styles["menu-item"]}
                onClick={handleDeleteRoom}
              >
                <FaTrash /> 채팅방 삭제
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className={styles["messages-container"]}>
        {messageGroups.length > 0 ? (
          messageGroups.map((group, groupIndex) => (
            <div 
              key={groupIndex} 
              className={`${styles["message-group"]} ${group.isCurrentUser ? styles["message-group-sent"] : styles["message-group-received"]}`}
            >
              {!group.isCurrentUser && (
                <div className={styles["message-sender-avatar"]}>
                  <FaUserCircle />
                </div>
              )}
              <div className={styles["message-bubble-container"]}>
                {!group.isCurrentUser && (
                  <div className={styles["message-sender-name"]}>
                    {group.senderName}
                  </div>
                )}
                {group.messages.map((msg, msgIndex) => {
                  const messageContent = typeof msg.content === 'object' 
                    ? JSON.stringify(msg.content) 
                    : msg.content;
                    
                  return (
                    <div 
                      key={msgIndex} 
                      className={`${styles.message} ${styles["message-bubble"]} ${group.isCurrentUser ? styles["message-sent"] : styles["message-received"]}`}
                    >
                      <div className={styles["message-content"]}>
                        {messageContent}
                      </div>
                    </div>
                  );
                })}
                <div className={`${styles["message-time"]} ${group.isCurrentUser ? styles["time-sent"] : styles["time-received"]}`}>
                  {group.time}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className={styles["messages-empty"]}>
            <div className={styles["messages-empty-icon"]}>
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <p>대화가 없습니다</p>
            <p className={styles["empty-subtitle"]}>첫 메시지를 보내보세요</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className={styles["message-input-container"]}>
        <div className={styles["message-actions"]}>
          <button className={styles["message-action-button"]}>
            <FaPaperclip />
          </button>
        </div>
        <div className={styles["message-input-wrapper"]}>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="메시지를 입력하세요..."
            className={styles["message-input-field"]}
          />
          <button className={styles["emoji-button"]}>
            <FaRegSmile />
          </button>
        </div>
        <button 
          onClick={handleSendMessage} 
          className={styles["send-button"]}
          disabled={!input.trim()}
        >
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;
