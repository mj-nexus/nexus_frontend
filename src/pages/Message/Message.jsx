import React, { useEffect, useState } from "react";
import ChatRoom from "./ChatRoom";
import { getChatList, getChatInfo } from "../../utils/messageUtil";
import styles from "./Message.module.scss"; // 스타일 모듈 사용
import GroupChatInvite from "./GroupChatInvite"; // 초대 컴포넌트 임포트
import { FaUserCircle, FaTimes } from "react-icons/fa"; // 아이콘 추가

export const Message = () => {
  const [roomList, setRoomList] = useState([]);
  const [roomInfoList, setRoomInfoList] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [showGroupChatInvite, setShowGroupChatInvite] = useState(false); // 단체채팅 초대 모달 표시 여부
  const [showRoomDetails, setShowRoomDetails] = useState(false); // 방 상세정보 표시 여부
  const currentUserId = localStorage.getItem('userId');

  // 단체채팅 모달 토글 함수
  const toggleGroupChatInvite = () => {
    setShowGroupChatInvite(!showGroupChatInvite);
  };

  // 방 상세 정보 토글 함수
  const toggleRoomDetails = () => {
    setShowRoomDetails(!showRoomDetails);
  };

  // 단체채팅 생성 후 처리 함수
  const handleGroupChatCreated = (newRoomId) => {
    fetchRoomList(); // 채팅방 목록 새로고침
    setSelectedRoomId(newRoomId); // 새 채팅방 선택
    setShowGroupChatInvite(false); // 모달 닫기
  };

  const roomListUpdate = async (roomIdArr) => {
    try {
      if (!roomIdArr || roomIdArr.length === 0) {
        setRoomInfoList([]);
        return;
      }
      
      const results = await Promise.all(
        roomIdArr.map(id => getChatInfo(id))
      );
      
      // null 값 필터링 및 추가 속성 확인
      const validResults = results.filter(room => room !== null && room !== undefined);
      
      setRoomInfoList(validResults);  // ✅ 상태로 업데이트
      console.log("Room info loaded:", validResults);
    } catch (err) {
      console.error("방 정보 불러오기 실패:", err);
      setRoomInfoList([]);
    }
  };
  
  const fetchRoomList = async () => {
    try {
      const rooms = await getChatList(currentUserId);  // 비동기 결과 기다리기
      
      if (!rooms || rooms.length === 0) {
        setRoomList([]);
        setSelectedRoomId(null);
        return;
      }
      
      setRoomList(rooms);                              // 상태 업데이트
      setSelectedRoomId(rooms[0]);              // 첫 방 선택
      console.log("채팅방 목록:", rooms);              // 여기서 로그 찍기
      roomListUpdate(rooms);
    } catch (error) {
      console.error("채팅방 목록 불러오기 실패:", error);
      setRoomList([]);
      setSelectedRoomId(null);
    }
  };
  
  // 참여 중인 채팅방 목록 불러오기
  useEffect(() => {
    fetchRoomList();
  }, [currentUserId]);

  // 이름에서 이니셜 추출
  const getInitials = (name) => {
    if (!name) return "";
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('');
  };

  // 채팅방 정보를 그룹과 개인으로 분류
  const groupChatRooms = roomInfoList ? roomInfoList.filter(room => room && room.is_group === true) : [];
  const personalChatRooms = roomInfoList ? roomInfoList.filter(room => room && room.is_group === false) : [];

  // 선택된 채팅방 정보 가져오기
  const getRoomInfo = () => {
    if (!roomInfoList || !selectedRoomId) {
      console.log("No roomInfoList or selectedRoomId");
      return null;
    }
    
    try {
      const filteredRoom = roomInfoList.find(room => room && room.id === selectedRoomId);
      console.log("Selected Room Info:", filteredRoom);
      
      // 기본 속성 확인 및 생성
      if (filteredRoom) {
        // 필수 속성이 없는 경우 기본값 제공
        if (!filteredRoom.name) {
          filteredRoom.name = "채팅방";
        }
      }
      
      return filteredRoom || null;
    } catch (err) {
      console.error("방 정보를 가져오는 중 오류 발생:", err);
      return null;
    }
  };

  // 날짜 형식 변환 함수
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  // 채팅방 항목 렌더링 함수
  const renderChatRoom = (data) => {
    if (!data) return null;
    
    return (
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
            <span className={styles["user-name"]}>{data.name || "채팅방"}</span>
            <span className={styles["user-time"]}>{data.time || ""}</span>
          </div>
        </div>
      </div>
    );
  };

  // 방 정보 모달 배경 클릭 처리
  const handleModalBackgroundClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowRoomDetails(false);
    }
  };

  // 방 세부 정보 렌더링
  const renderRoomDetails = () => {
    const roomInfo = getRoomInfo();
    if (!roomInfo) return null;

    return (
      <div className={styles["room-details-modal-background"]} onClick={handleModalBackgroundClick}>
        <div className={styles["room-details-modal"]}>
          <div className={styles["room-details-header"]}>
            <h3>방 정보</h3>
            <button className={styles["close-button"]} onClick={toggleRoomDetails}>
              <FaTimes />
            </button>
          </div>
          
          <div className={styles["room-details-content"]}>
            <div className={styles["detail-item"]}>
              <span className={styles["detail-label"]}>방 ID:</span>
              <span className={styles["detail-value"]}>{roomInfo.id}</span>
            </div>
            
            <div className={styles["detail-item"]}>
              <span className={styles["detail-label"]}>방 이름:</span>
              <span className={styles["detail-value"]}>{roomInfo.name}</span>
            </div>
            
            <div className={styles["detail-item"]}>
              <span className={styles["detail-label"]}>그룹채팅:</span>
              <span className={styles["detail-value"]}>{roomInfo.is_group ? "예" : "아니오"}</span>
            </div>
            
            <div className={styles["detail-item"]}>
              <span className={styles["detail-label"]}>생성일:</span>
              <span className={styles["detail-value"]}>{formatDate(roomInfo.created_at)}</span>
            </div>
            
            <div className={styles["detail-item"]}>
              <span className={styles["detail-label"]}>참여자 수:</span>
              <span className={styles["detail-value"]}>{roomInfo.userCount || 0}명</span>
            </div>
            
            <div className={styles["detail-item"]}>
              <span className={styles["detail-label"]}>마지막 메시지:</span>
              <span className={styles["detail-value"]}>
                {roomInfo.lastMessage ? roomInfo.lastMessage.content : "없음"}
              </span>
            </div>
            
            <div className={styles["users-details"]}>
              <div className={styles["detail-label"]}>참여자 목록:</div>
              <div className={styles["users-list"]}>
                {roomInfo.users && roomInfo.users.map(user => (
                  <div key={user.user_id} className={styles["user-detail-item"]}>
                    <div className={styles["user-detail-avatar"]}>
                      {user.profile_image ? (
                        <img 
                          src={`${process.env.REACT_APP_BACKEND_HOST}/upload/${user.profile_image}`}
                          alt={user.user_name}
                          className={styles["user-detail-img"]}
                        />
                      ) : (
                        <FaUserCircle className={styles["user-detail-icon"]} />
                      )}
                    </div>
                    <div className={styles["user-detail-info"]}>
                      <div className={styles["user-detail-name"]}>
                        {user.nick_name || user.user_name}
                      </div>
                      <div className={styles["user-detail-email"]}>
                        {user.email || "이메일 없음"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={styles["chat-container"]}>
      {selectedRoomId ? (
        <div className={styles["chat-content-container"]}>
          <ChatRoom 
            roomId={selectedRoomId} 
            currentUserId={currentUserId} 
            roomInfo={getRoomInfo()}
            onToggleRoomDetails={toggleRoomDetails}
          />
        </div>
      ) : (
        <div className={styles["chat-content"]}>
          <p className={styles["chat-placeholder"]}>메시지를 선택하세요</p>
        </div>
      )}
      
      <div className={styles.inbox}>
        <div className={styles["inbox-header"]}>
          <div className={styles["inbox-title"]}>메시지</div>
          <div className={styles["header-actions"]}>
            <button 
              className={styles["create-group-btn"]}
              onClick={toggleGroupChatInvite}
              title="새로운 채팅방 만들기"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="4"></circle>
                <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8"></path>
              </svg>
              <span>새채팅</span>
            </button>
            <div className={styles["settings-icon"]}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="1"></circle>
                <circle cx="19" cy="12" r="1"></circle>
                <circle cx="5" cy="12" r="1"></circle>
              </svg>
            </div>
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
          {/* 단체 채팅방 섹션 */}
          {groupChatRooms.length > 0 && (
            <div className={styles["chat-section"]}>
              <div className={styles["section-header"]}>단체 채팅</div>
              {groupChatRooms.map(room => renderChatRoom(room))}
            </div>
          )}
          
          {/* 개인 채팅방 섹션 */}
          {personalChatRooms.length > 0 && (
            <div className={styles["chat-section"]}>
              <div className={styles["section-header"]}>개인 메시지</div>
              {personalChatRooms.map(room => renderChatRoom(room))}
            </div>
          )}
          
          {/* 채팅방이 없는 경우 */}
          {(!roomInfoList || roomInfoList.length === 0) && (
            <div className={styles["empty-chat-list"]}>
              <p>채팅방이 없습니다</p>
            </div>
          )}
        </div>
      </div>
      
      {/* 단체 채팅방 초대 모달 */}
      {showGroupChatInvite && (
        <GroupChatInvite 
          onClose={toggleGroupChatInvite} 
          currentUserId={currentUserId}
          onChatCreated={handleGroupChatCreated}
        />
      )}
      
      {/* 방 정보 모달 */}
      {showRoomDetails && renderRoomDetails()}
    </div>
  );
};

