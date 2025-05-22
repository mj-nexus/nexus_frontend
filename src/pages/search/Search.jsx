import React, { useState } from 'react';
import axios from 'axios';
import api from '../../api/axiosInstance.js'
import ProfileMini from '../../components/Profile_mini/Profile_mini.jsx';
import styles from './Search.module.scss';

const UserCard = ({ user }) => (
  <div className={styles.userCard}>
    <ProfileMini user={user} />
    <div className={styles.userInfo}>
      <div className={styles.nickName}>{user.Profile?.nick_name}</div>
      <div className={styles.name}>{user.Profile?.user_name}</div>
      <div className={styles.email}>{user.Profile?.email}</div>
      {/* 필요시 Info 컴포넌트로 스킬 등 추가 정보 표시 */}
    </div>
  </div>
);

const Search = () => {
  const [keyword, setKeyword] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!keyword.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/api/user/search?keyword=${encodeURIComponent(keyword)}`);
      setUsers(Array.isArray(res.data) ? res.data : res.data.data || []);
    } catch (err) {
      setError('검색 중 오류가 발생했습니다.');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.searchPage}>
      <form className={styles.searchForm} onSubmit={handleSearch}>
        <input
          className={styles.searchInput}
          type="text"
          placeholder="유저 이름, 닉네임, 이메일 등으로 검색..."
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
        />
        <button className={styles.searchButton} type="submit">검색</button>
      </form>
      <div className={styles.resultSection}>
        <h2>유저 검색 결과</h2>
        {loading && <div>검색 중...</div>}
        {error && <div className={styles.error}>{error}</div>}
        {!loading && users.length === 0 && !error && <div>검색 결과가 없습니다.</div>}
        <div className={styles.userList}>
          {users.map(user => (
            <UserCard key={user.user_id} user={user} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Search; 