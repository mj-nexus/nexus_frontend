import React, { useState, useEffect } from 'react';
import styles from './GroupChatInvite.module.scss';
import api from '../../api/axiosInstance';
import { FaUserCircle, FaSearch, FaTimes } from 'react-icons/fa';
import { getUserList } from '../../utils/getUserListUtil';

const GroupChatInvite = ({ onClose, currentUserId, onChatCreated }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isGroupChat, setIsGroupChat] = useState(true); // 그룹 채팅 여부 (기본값: 그룹)

  // 모든 사용자 정보 가져오기
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getUserList();
        
        // 현재 사용자 제외
        const filteredUserList = response.filter(user => 
          user.user_id.toString() !== currentUserId
        );
        
        setAllUsers(filteredUserList);
        setFilteredUsers(filteredUserList);
      } catch (err) {
        console.error('사용자 목록 가져오기 실패:', err);
        setError('사용자 목록을 불러오는데 실패했습니다');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [currentUserId]);

  // 검색어에 따라 사용자 필터링
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredUsers(allUsers);
      return;
    }

    const filtered = allUsers.filter(user => {
      // user_name과 nick_name으로 검색
      const userName = user.user_name || '';
      const nickName = user.nick_name || '';
      const email = user.email || '';
      const searchTermLower = searchTerm.toLowerCase();
      
      return (
        userName.toLowerCase().includes(searchTermLower) || 
        nickName.toLowerCase().includes(searchTermLower) ||
        email.toLowerCase().includes(searchTermLower)
      );
    });

    setFilteredUsers(filtered);
  }, [searchTerm, allUsers]);

  // 사용자 선택 처리
  const handleUserSelect = (user) => {
    // 일반 채팅일 경우 한 명만 선택 가능
    if (!isGroupChat && selectedUsers.length > 0) {
      // 이미 선택된 사용자가 있으면 교체
      if (selectedUsers[0].user_id !== user.user_id) {
        setSelectedUsers([user]);
      } else {
        // 같은 사용자를 다시 클릭하면 선택 취소
        setSelectedUsers([]);
      }
      return;
    }

    // 그룹 채팅일 경우 다중 선택 가능
    const isAlreadySelected = selectedUsers.some(
      selectedUser => selectedUser.user_id === user.user_id
    );

    if (isAlreadySelected) {
      // 이미 선택된 경우 제거
      setSelectedUsers(selectedUsers.filter(
        selectedUser => selectedUser.user_id !== user.user_id
      ));
    } else {
      // 선택되지 않은 경우 추가
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  // 선택된 사용자 제거
  const removeSelectedUser = (userId) => {
    setSelectedUsers(selectedUsers.filter(user => user.user_id !== userId));
  };

  // 채팅방 생성
  const createChatRoom = async () => {
    if (!groupName.trim()) {
      setError('채팅방 이름을 입력해주세요');
      return;
    }

    if (selectedUsers.length === 0) {
      setError('초대할 사용자를 선택해주세요');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // 선택된 사용자 ID 목록 (+현재 사용자 포함)
      const userIds = [
        parseInt(currentUserId),
        ...selectedUsers.map(user => user.user_id)
      ];

      // 초대한 사용자 수에 따라 자동으로 그룹 채팅 여부 결정
      // 현재 사용자 포함 총 인원이 3명 이상이면 그룹 채팅, 아니면 일반 채팅
      const isGroup = userIds.length > 2;

      // 채팅방 생성 API 호출
      const response = await api.post('api/messages/chat-room', {
        name: groupName,
        is_group: isGroup,
        user_ids: userIds
      });

      console.log('API 응답:', response.data); // 디버깅용 로그 추가

      // 응답 구조 확인 및 안전한 접근
      if (response.data) {
        // 응답에서 채팅방 ID 찾기 (구조에 따라 다를 수 있음)
        let roomId;
        
        if (response.data.success && response.data.room && response.data.room.id) {
          // {success: true, room: {id: 123, ...}} 구조
          roomId = response.data.room.id;
        } else if (response.data.success && response.data.chatRoom && response.data.chatRoom.id) {
          // {success: true, chatRoom: {id: 123, ...}} 구조
          roomId = response.data.chatRoom.id;
        } else if (response.data.id) {
          // {id: 123, ...} 구조
          roomId = response.data.id;
        } else if (response.data.roomId) {
          // {roomId: 123, ...} 구조
          roomId = response.data.roomId;
        } else if (typeof response.data === 'number') {
          // 숫자 ID만 반환하는 경우
          roomId = response.data;
        }
        
        if (roomId) {
          onChatCreated(roomId);
        } else {
          console.error('응답에서 방 ID를 찾을 수 없습니다:', response.data);
          setError('채팅방을 찾을 수 없습니다');
        }
      } else {
        throw new Error('채팅방 생성 응답에 데이터가 없습니다');
      }
    } catch (err) {
      console.error('채팅방 생성 실패:', err);
      setError('채팅방 생성에 실패했습니다');
    } finally {
      setIsLoading(false);
    }
  };

  // 배경 클릭 시 모달 닫기
  const handleBackgroundClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // 사용자 이름 표시
  const getUserName = (user) => {
    // 닉네임이 있으면 닉네임 표시, 없으면 실명 표시
    return user.nick_name || user.user_name || `사용자 ${user.user_id}`;
  };

  // 사용자 부가 정보 표시
  const getUserSubInfo = (user) => {
    // 부가 정보로 이메일과 회사 표시
    const infoItems = [];
    
    if (user.email) {
      infoItems.push(user.email);
    }
    
    if (user.company) {
      infoItems.push(user.company);
    }
    
    return infoItems.join(' • ') || '추가 정보 없음';
  };

  // 프로필 이미지가 있는 경우 표시
  const getProfileImage = (user) => {
    if (user.profile_image) {
      return (
        <img 
          src={`${process.env.REACT_APP_BACKEND_HOST}/upload/${user.profile_image}`}
          alt={getUserName(user)}
          className={styles.userAvatar}
        />
      );
    }
    // 이미지가 없으면 기본 아이콘 사용
    return <FaUserCircle className={styles.userAvatarIcon} />;
  };

  // 채팅방 유형 변경 처리
  const handleChatTypeChange = (isGroup) => {
    setIsGroupChat(isGroup);
    
    // 일반 채팅으로 변경 시 선택된 사용자가 2명 이상이면 첫 번째 사용자만 유지
    if (!isGroup && selectedUsers.length > 1) {
      setSelectedUsers([selectedUsers[0]]);
    }
  };

  return (
    <div className={styles.modalBackground} onClick={handleBackgroundClick}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>채팅방 만들기</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {error && <div className={styles.errorMessage}>{error}</div>}

        <div className={styles.chatTypeInfo}>
          <p>참여자 수에 따라 채팅 유형이 자동으로 결정됩니다.</p>
          <p>• 1:1 채팅: 사용자 1명 선택</p>
          <p>• 그룹 채팅: 사용자 2명 이상 선택</p>
        </div>

        <div className={styles.groupNameInput}>
          <label htmlFor="groupName">채팅방 이름</label>
          <input
            id="groupName"
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="채팅방 이름 입력"
          />
        </div>

        <div className={styles.selectedUsers}>
          <h3>초대할 사용자 ({selectedUsers.length}명)</h3>
          <div className={styles.selectedUsersList}>
            {selectedUsers.map(user => (
              <div key={user.user_id} className={styles.selectedUserItem}>
                {getProfileImage(user)}
                <span>{getUserName(user)}</span>
                <button 
                  onClick={() => removeSelectedUser(user.user_id)}
                  className={styles.removeUserButton}
                >
                  <FaTimes />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.userSearchContainer}>
          <div className={styles.searchInputWrapper}>
            <FaSearch className={styles.searchIcon} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="이름, 닉네임 또는 이메일 검색"
              className={styles.searchInput}
            />
          </div>

          <div className={styles.userList}>
            {isLoading ? (
              <div className={styles.loadingMessage}>사용자 정보를 불러오는 중...</div>
            ) : filteredUsers.length === 0 ? (
              <div className={styles.emptyMessage}>검색 결과가 없습니다</div>
            ) : (
              filteredUsers.map(user => {
                const isSelected = selectedUsers.some(selectedUser => 
                  selectedUser.user_id === user.user_id
                );
                
                return (
                  <div 
                    key={user.user_id} 
                    className={`${styles.userItem} ${isSelected ? styles.selected : ''}`}
                    onClick={() => handleUserSelect(user)}
                  >
                    {getProfileImage(user)}
                    <div className={styles.userInfo}>
                      <div className={styles.userName}>{getUserName(user)}</div>
                      <div className={styles.userEmail}>{getUserSubInfo(user)}</div>
                    </div>
                    {isSelected && (
                      <div className={styles.selectedCheck}>✓</div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className={styles.actionButtons}>
          <button 
            className={styles.cancelButton} 
            onClick={onClose}
            disabled={isLoading}
          >
            취소
          </button>
          <button 
            className={styles.createButton} 
            onClick={createChatRoom}
            disabled={isLoading || selectedUsers.length === 0 || !groupName.trim()}
          >
            {isLoading ? '생성 중...' : '채팅방 만들기'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupChatInvite; 