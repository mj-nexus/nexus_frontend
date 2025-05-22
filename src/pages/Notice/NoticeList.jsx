import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './NoticeList.module.scss';
import api from '../../api/axiosInstance';
import { FaSearch, FaNewspaper, FaExternalLinkAlt } from 'react-icons/fa';

export const NoticeList = () => {
  const navigate = useNavigate();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredNotices, setFilteredNotices] = useState([]);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await api.get('/api/mjc-notices');
        setNotices(response.data || []);
        setFilteredNotices(response.data || []);
        setLoading(false);
      } catch (err) {
        console.error('공지사항 로딩 오류:', err);
        setError('공지사항을 불러오는데 실패했습니다.');
        setLoading(false);
      }
    };

    fetchNotices();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredNotices(notices);
    } else {
      const filtered = notices.filter(notice => 
        notice.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredNotices(filtered);
    }
  }, [searchTerm, notices]);

  const handleSearch = (e) => {
    e.preventDefault();
    // 검색 필터링은 이미 useEffect에서 처리됨
  };

  const handleNoticeClick = (notice) => {
    if (notice.link) {
      window.open(notice.link, '_blank');
    } else {
      navigate(`/notice/${notice.id}`);
    }
  };

  const handleExternalLinkClick = (e, link) => {
    e.stopPropagation();
    window.open(link, '_blank');
  };

  if (loading) return <div className={styles.loadingContainer}>로딩 중...</div>;
  if (error) return <div className={styles.errorContainer}>에러: {error}</div>;

  return (
    <div className={styles.noticeListContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          <FaNewspaper className={styles.icon} />
          학교 공지사항
        </h1>
        <p className={styles.description}>
          학교 홈페이지에서 가져온 최신 공지사항을 확인하세요.
        </p>
        <form className={styles.searchForm} onSubmit={handleSearch}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="공지사항 검색..."
            className={styles.searchInput}
          />
          <button type="submit" className={styles.searchButton}>
            <FaSearch /> 검색
          </button>
        </form>
      </div>

      <div className={styles.content}>
        {filteredNotices.length === 0 ? (
          <div className={styles.emptyState}>
            {searchTerm ? '검색 결과가 없습니다.' : '공지사항이 없습니다.'}
          </div>
        ) : (
          <div className={styles.noticeGrid}>
            {filteredNotices.map((notice) => (
              <div
                key={notice.id}
                className={styles.noticeCard}
                onClick={() => handleNoticeClick(notice)}
              >
                <h3 className={styles.noticeTitle}>{notice.title}</h3>
                <p className={styles.noticeDate}>
                  {new Date(notice.date || notice.regDate).toLocaleDateString()}
                </p>
                {notice.link && (
                  <button
                    className={styles.externalLinkButton}
                    onClick={(e) => handleExternalLinkClick(e, notice.link)}
                  >
                    <FaExternalLinkAlt /> 원문 보기
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}; 