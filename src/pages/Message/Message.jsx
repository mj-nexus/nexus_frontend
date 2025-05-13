import React, { useEffect, useState } from "react";
import ChatRoom from "./ChatRoom";
import { getChatList, getChatInfo } from "../../utils/messageUtil";
import styles from "./Message.module.scss"; // 스타일 모듈 사용

export const Message = () => {
  const [roomList, setRoomList] = useState([]);
  const [roomInfoList, setRoomInfoList] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const currentUserId = localStorage.getItem('userId');

  const roomListUpdate = async (roomIdArr) => {
    try {
      const results = await Promise.all(
        roomIdArr.map(id => getChatInfo(id))
      );
      setRoomInfoList(results);  // ✅ 상태로 업데이트
    } catch (err) {
      console.error("방 정보 불러오기 실패:", err);
    }
  };
  
  const fetchRoomList = async () => {
    try {
      const rooms = await getChatList(currentUserId);  // 비동기 결과 기다리기
      setRoomList(rooms);                              // 상태 업데이트
      setSelectedRoomId(rooms[0]);              // 첫 방 선택
      console.log("채팅방 목록:", rooms);              // 여기서 로그 찍기
      roomListUpdate(rooms)
    } catch (error) {
      console.error("채팅방 목록 불러오기 실패:", error);
    }
  };
  
  // 참여 중인 채팅방 목록 불러오기
  useEffect(() => {
    fetchRoomList();
  }, [currentUserId]);

  // 이름에서 이니셜 추출
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('');
  };

  return (
    <div className={styles["chat-container"]}>
      {selectedRoomId ? (
        <ChatRoom roomId={selectedRoomId} currentUserId={currentUserId} />
      ) : (
        <div className={styles["chat-content"]}>
          <p className={styles["chat-placeholder"]}>메시지를 선택하세요</p>
        </div>
      )}
      
      <div className={styles.inbox}>
        <div className={styles["inbox-header"]}>
          <div className={styles["inbox-title"]}>메시지</div>
          <div className={styles["settings-icon"]}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="1"></circle>
              <circle cx="19" cy="12" r="1"></circle>
              <circle cx="5" cy="12" r="1"></circle>
            </svg>
          </div>
        </div>
        
        <div className={styles["search-container"]}>
          <input 
            type="text" 
            className={styles["search-input"]} 
            placeholder="검색" 
          />
        </div>
        
        <div className={styles["user-list"]}>
          {roomInfoList.map(data => (
            <div 
              key={data.id}
              className={`${styles["user-item"]} ${selectedRoomId === data.id ? styles.selected : ''}`}
              onClick={() => setSelectedRoomId(data.id)}
            >
              <div className={styles["user-avatar"]}>
                {getInitials(data.name)}
              </div>
              <div className={styles["user-info"]}>
                <div className={styles["user-header"]}>
                  <span className={styles["user-name"]}>{data.name}</span>
                  <span className={styles["user-time"]}>{data.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

