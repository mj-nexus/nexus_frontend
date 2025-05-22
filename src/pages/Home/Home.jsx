import React, { useEffect, useState } from "react";
import styles from "./Home.module.scss";
import { FaCalendarAlt, FaChartLine, FaUserFriends, FaBell, FaNewspaper, FaRegTimesCircle, FaUserCircle } from "react-icons/fa";
import api from "../../api/axiosInstance";
import TimeTable from "../../components/TimeTable/TimeTable";
import { getUserList } from '../../utils/getUserListUtil';
import { seniorBoardService } from '../../services/seniorBoardService';
import { boardService } from '../../services/boardService';
import { useNavigate } from "react-router-dom";

// 인기 게시글 컴포넌트
const PopularPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularPosts = async () => {
      try {
        // 선배게시판 인기글(좋아요순 2개)
        const seniorRes = await seniorBoardService.getBoards();
        const seniorBoards = seniorRes.data.data || seniorRes.data;
        const seniorPopular = [...seniorBoards]
          .sort((a, b) => (b.likes || 0) - (a.likes || 0))
          .slice(0, 2)
          .map(post => ({ ...post, _boardType: 'senior' }));

        // 학생게시판 인기글(댓글순 2개, commentCount 사용)
        const studentRes = await boardService.getBoards(1, 20); // 20개 정도 충분히 불러옴
        const studentBoards = studentRes.data || studentRes;
        const studentPopular = [...studentBoards]
          .sort((a, b) => (b.commentCount || 0) - (a.commentCount || 0))
          .slice(0, 2)
          .map(post => ({ ...post, _boardType: 'student' }));

        setPosts([...seniorPopular, ...studentPopular]);
      } catch (error) {
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPopularPosts();
  }, []);

  if (loading) return <div className={styles.loading}>로딩 중...</div>;

  return (
    <div className={styles.dashboardCard}>
      <div className={styles.cardHeader}>
        <FaChartLine className={styles.cardIcon} />
        <h2>인기 게시글</h2>
      </div>
      <div className={styles.cardContent}>
        <ul className={styles.postList}>
          {posts.map((post) => (
            <li key={post.id || post.board_id} className={styles.postItem}>
              <div className={styles.postCategory}>
                {post._boardType === 'senior' ? '선배게시판' : '학생게시판'}
              </div>
              <div className={styles.postTitle}>{post.title}</div>
              <div className={styles.postMeta}>
                <span className={styles.postAuthor}>작성자: {post.writer}</span>
                <div className={styles.postStats}>
                  <span>👍 {post.likes || 0}</span>
                  <span>💬 {post._boardType === 'student' ? (post.commentCount || 0) : (post.comments || 0)}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.cardFooter}>
        <button className={styles.moreButton} onClick={() => window.location.href = '/board'}>더보기</button>
      </div>
    </div>
  );
};

// 향상된 시간표 컴포넌트
const EnhancedTimetable = () => {
  const [selectedClass, setSelectedClass] = useState(null);
  
  // 강의 상세 정보를 닫는 함수
  const closeClassDetails = () => {
    setSelectedClass(null);
  };

  // TimeTable 컴포넌트에서 강의 선택 시 호출될 함수
  const handleClassSelect = (classInfo) => {
    setSelectedClass(classInfo);
  };

  return (
    <div className={styles.dashboardCard}>
      <div className={styles.cardHeader}>
        <FaCalendarAlt className={styles.cardIcon} />
        <h2>내 시간표</h2>
      </div>
      <div className={styles.cardContent}>
        <div className={styles.timetableWrapper}>
          <TimeTable onClassSelect={handleClassSelect} />
        </div>
      </div>
      <div className={styles.cardFooter}>
        <button className={styles.moreButton} onClick={() => window.location.href = '/study'}>시간표 상세보기</button>
      </div>
      
      {/* 강의 상세 정보 모달 */}
      {selectedClass && (
        <div className={styles.classDetailsModal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>{selectedClass.name}</h3>
              <button className={styles.closeButton} onClick={closeClassDetails}>
                <FaRegTimesCircle />
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.classInfo}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>교수명:</span>
                  <span className={styles.infoValue}>{selectedClass.professor}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>강의실:</span>
                  <span className={styles.infoValue}>{selectedClass.location}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>강의 시간:</span>
                  <span className={styles.infoValue}>{selectedClass.schedule}</span>
                </div>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.detailButton} onClick={() => window.location.href = '/study'}>자세히 보기</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// 추천 사용자 컴포넌트
const RecommendedUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const currentUserId = localStorage.getItem('userId');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const userList = await getUserList();
        // 현재 로그인한 사용자 제외
        const filteredList = userList.filter(user => user.user_id.toString() !== currentUserId);
        setUsers(filteredList);
        setFilteredUsers(filteredList);
      } catch (error) {
        setUsers([]);
        setFilteredUsers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [currentUserId]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredUsers(users);
      return;
    }
    const lower = searchTerm.toLowerCase();
    setFilteredUsers(
      users.filter(user =>
        (user.nick_name || '').toLowerCase().includes(lower) ||
        (user.user_name || '').toLowerCase().includes(lower) ||
        (user.email || '').toLowerCase().includes(lower)
      )
    );
  }, [searchTerm, users]);

  // 프로필 이미지 렌더링
  const getProfileImage = (user) => {
    if (user.profile_image) {
      return (
        <img
          src={`${process.env.REACT_APP_BACKEND_HOST}/upload/${user.profile_image}`}
          alt={user.nick_name || user.user_name || '사용자'}
          className={styles.userAvatar}
        />
      );
    }
    return <FaUserCircle className={styles.userAvatarIcon} />;
  };

  // 이름/닉네임
  const getUserName = (user) => user.nick_name || user.user_name || `사용자 ${user.user_id}`;
  // 부가정보
  const getUserSubInfo = (user) => {
    const info = [];
    if (user.email) info.push(user.email);
    if (user.company) info.push(user.company);
    return info.join(' • ') || '추가 정보 없음';
  };

  // 사용자 프로필로 이동하는 함수
  const handleUserClick = (userId) => {
    navigate(`/profile/${userId}`);
  };

  return (
    <div className={styles.dashboardCard}>
      <div className={styles.cardHeader}>
        <FaUserFriends className={styles.cardIcon} />
        <h2>사용자 목록</h2>
      </div>
      <div className={styles.cardContent}>
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="이름, 닉네임, 이메일 검색"
          style={{ width: '100%', marginBottom: 16, padding: 8, borderRadius: 6, border: '1px solid #eee' }}
        />
        {loading ? (
          <div className={styles.loading}>로딩 중...</div>
        ) : filteredUsers.length === 0 ? (
          <div className={styles.emptyState}>사용자가 없습니다.</div>
        ) : (
          <ul className={styles.userList} style={{ maxHeight: 260, overflowY: 'auto' }}>
            {filteredUsers.map(user => (
              <li 
                key={user.user_id} 
                className={styles.userItem} 
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid #eee', cursor: 'pointer' }}
                onClick={() => handleUserClick(user.user_id)}
              >
                {getProfileImage(user)}
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500, color: '#333' }}>{getUserName(user)}</div>
                  <div style={{ fontSize: 13, color: '#888' }}>{getUserSubInfo(user)}</div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

// 공지사항 & 이벤트 컴포넌트
const NotificationsAndEvents = () => {
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'notice', title: "2024학년도 1학기 수강신청 안내", date: "2024-05-15" },
    { id: 2, type: 'event', title: "취업박람회 개최 안내", date: "2024-05-20" },
    { id: 3, type: 'notice', title: "도서관 이용 시간 변경 안내", date: "2024-05-18" },
    { id: 4, type: 'event', title: "프로그래밍 경진대회", date: "2024-05-25" },
  ]);

  return (
    <div className={styles.dashboardCard}>
      <div className={styles.cardHeader}>
        <FaBell className={styles.cardIcon} />
        <h2>공지 & 이벤트</h2>
      </div>
      <div className={styles.cardContent}>
        <ul className={styles.notificationList}>
          {notifications.map((item) => (
            <li key={item.id} className={styles.notificationItem}>
              <span className={`${styles.notificationBadge} ${styles[item.type]}`}>
                {item.type === 'notice' ? '공지' : '이벤트'}
              </span>
              <span className={styles.notificationTitle}>{item.title}</span>
              <span className={styles.notificationDate}>{item.date}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.cardFooter}>
        <button className={styles.moreButton}>더보기</button>
      </div>
    </div>
  );
};

// 학교 뉴스 컴포넌트
const SchoolNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false); // 전체 보기 여부
  const [allLoading, setAllLoading] = useState(false); // 전체 불러오기 로딩

  useEffect(() => {
    const fetchSchoolNews = async () => {
      try {
        // 최신 공지사항 5개 가져오기
        const response = await api.get('/api/mjc-notices/latest/list');
        setNews(response.data || []);
        setLoading(false);
      } catch (error) {
        console.error("학교 소식 로딩 실패:", error);
        setError("학교 소식을 불러오는데 실패했습니다.");
        setLoading(false);
      }
    };

    fetchSchoolNews();
  }, []);

  // 더 많은 소식 불러오기
  const handleShowAll = async () => {
    setAllLoading(true);
    try {
      const response = await api.get('/api/mjc-notices');
      setNews(response.data || []);
      setShowAll(true);
    } catch (error) {
      alert('더 많은 소식을 불러오는데 실패했습니다.');
    } finally {
      setAllLoading(false);
    }
  };

  // 링크 클릭 핸들러
  const handleNewsClick = (item) => {
    if (item.link) {
      window.open(item.link, '_blank');
    } else {
      window.open(`/notice/${item.id}`, '_blank');
    }
  };

  if (loading) return <div className={styles.loading}>로딩 중...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.dashboardCard}>
      <div className={styles.cardHeader}>
        <FaNewspaper className={styles.cardIcon} />
        <h2>학교 소식</h2>
      </div>
      <div className={styles.cardContent}>
        {news.length === 0 ? (
          <div className={styles.emptyState}>최신 소식이 없습니다.</div>
        ) : (
          <div className={styles.newsList}>
            {news.map((item) => (
              <div 
                key={item.id} 
                className={styles.newsItem}
                onClick={() => handleNewsClick(item)}
              >
                {item.imageUrl && (
                  <div className={styles.newsImage}>
                    <img src={item.imageUrl} alt={item.title} />
                  </div>
                )}
                <div className={styles.newsContent}>
                  <h3 className={styles.newsTitle}>{item.title}</h3>
                  {item.summary && (
                    <p className={styles.newsSummary}>{item.summary}</p>
                  )}
                  <span className={styles.newsDate}>{new Date(item.date || item.regDate).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className={styles.cardFooter}>
        {!showAll && (
          <button 
            className={styles.moreButton}
            onClick={handleShowAll}
            disabled={allLoading}
          >
            {allLoading ? '불러오는 중...' : '더 많은 소식'}
          </button>
        )}
      </div>
    </div>
  );
};

// 메인 홈 컴포넌트
export const Home = () => {
  return (
    <div className={styles.homeContainer}>
      <div className={styles.pageHeader}>
        <h1>넥서스 대시보드</h1>
        <p>오늘의 인기 정보와 개인화된 콘텐츠를 확인하세요.</p>
      </div>
      
      <div className={styles.dashboardGrid}>
        <div className={styles.mainColumn}>
          <PopularPosts />
          <SchoolNews />
        </div>
        <div className={styles.sideColumn}>
          <EnhancedTimetable />
          <RecommendedUsers />
          <NotificationsAndEvents />
        </div>
      </div>
    </div>
  );
};