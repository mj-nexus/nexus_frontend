import React, { useEffect, useState, useRef } from "react";
import { socket, sendMessage as sendSocketMessage } from "../../utils/socketUtil"
import { getChatLog } from "../../utils/messageUtil";
import styles from "./Message.module.scss";

const ChatRoom = ({ roomId, currentUserId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

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

  return (
    <div className={styles["chat-content"]}>
      <div className={styles["chat-header"]}>
        <div className={styles["chat-title"]}>AI · 빅데이터학과</div>
        <div className={styles["last-seen"]}>iMessage</div>
      </div>
      
      <div className={styles["messages-container"]}>
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <div 
              key={index} 
              className={`${styles.message} ${msg.sender_id == currentUserId ? styles["message-sent"] : styles["message-received"]}`}
            >
              <div>{msg.content}</div>
              <div className={styles["message-time"]}>
                {formatTime(msg.sent_at)}
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
            <p>SMS/MMS</p>
            <p style={{fontSize: '14px', marginTop: '5px', color: '#34c759'}}>오늘부터 메시지를 주고 받을 수 있습니다</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className={styles["message-input"]}>
      <input
  value={input}
  onChange={(e) => setInput(e.target.value)}
  onKeyUp={(e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  }}
  placeholder="텍스트 메시지"
/>


        <button onClick={handleSendMessage} aria-label="메시지 전송">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;
