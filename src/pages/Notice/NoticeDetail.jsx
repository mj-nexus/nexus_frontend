import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './NoticeDetail.module.scss';
import api from '../../api/axiosInstance';
import { FaArrowLeft, FaCalendarAlt, FaLink } from 'react-icons/fa';

export const NoticeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNoticeDetail = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/mjc-notices/${id}`);
        setNotice(response.data);
        
        // 링크가 있으면 자동으로 외부 링크로 리다이렉트
        if (response.data && response.data.link) {
          window.open(response.data.link, '_blank');
          // 이전 페이지로 돌아가기
          navigate(-1);
          return;
        }
        
        setLoading(false);
      } catch (err) {
        console.error('공지사항 상세 로딩 오류:', err);
        setError('공지사항을 불러오는데 실패했습니다.');
        setLoading(false);
      }
    };

    fetchNoticeDetail();
  }, [id, navigate]);

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleLinkClick = () => {
    if (notice && notice.link) {
      window.open(notice.link, '_blank');
    }
  };

  if (loading) return <div className={styles.loadingContainer}>로딩 중...</div>;
  if (error) return <div className={styles.errorContainer}>에러: {error}</div>;
  if (!notice) return <div className={styles.errorContainer}>공지사항을 찾을 수 없습니다.</div>;

  return (
    <div className={styles.noticeDetailContainer}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={handleBackClick}>
          <FaArrowLeft /> 뒤로가기
        </button>
        <h1 className={styles.title}>{notice.title}</h1>
        <div className={styles.meta}>
          <div className={styles.dateInfo}>
            <FaCalendarAlt />
            <span className={styles.date}>{new Date(notice.date || notice.regDate).toLocaleDateString()}</span>
          </div>
          {notice.link && (
            <button className={styles.linkButton} onClick={handleLinkClick}>
              <FaLink /> 원문 보기
            </button>
          )}
        </div>
      </div>

      <div className={styles.content}>
        {notice.imageUrl && (
          <div className={styles.imageContainer}>
            <img src={notice.imageUrl} alt={notice.title} />
          </div>
        )}
        <div className={styles.textContent}>
          {notice.content}
        </div>
      </div>

      <div className={styles.footer}>
        <button className={styles.listButton} onClick={() => navigate('/notices')}>
          목록으로
        </button>
      </div>
    </div>
  );
}; 