import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { seniorBoardService } from '../../services/seniorBoardService';
import { formatDate } from '../../utils/dateFormattingUtil';
import {
  Note,
  GridNote,
  LinedNote,
  TornNote,
  PostcardNote
} from '../../components/Memo/styles';

const NOTE_TYPE_MAP = {
  Note,
  GridNote,
  LinedNote,
  TornNote,
  PostcardNote
};

const SeniorBoardDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);

  useEffect(() => {
    const fetchBoardDetail = async () => {
      try {
        setLoading(true);
        const res = await seniorBoardService.getBoard(id);
        setBoard(res.data);
        setLiked(!!res.data.liked);
        setLikes(res.data.likes || 0);
      } catch (err) {
        setError('게시글을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchBoardDetail();
  }, [id]);

  const handleEdit = () => {
    navigate(`/board/senior/write?id=${id}`);
  };

  const handleDelete = async () => {
    if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      try {
        setIsDeleting(true);
        await seniorBoardService.deleteBoard(id);
        alert('게시글이 삭제되었습니다.');
        navigate('/board', { state: { refresh: true } });
      } catch (err) {
        alert('게시글 삭제에 실패했습니다.');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleBackToList = () => {
    navigate('/board', { state: { tab: 'senior' } });
  };

  const handleLike = async () => {
    if (likeLoading) return;
    setLikeLoading(true);
    try {
      if (liked) {
        await seniorBoardService.unlike(Number(id), localStorage.getItem('userId'));
        setLiked(false);
        setLikes(likes - 1);
      } else {
        await seniorBoardService.like(Number(id), localStorage.getItem('userId'));
        setLiked(true);
        setLikes(likes + 1);
      }
    } catch (err) {
      alert('추천 처리에 실패했습니다.');
    } finally {
      setLikeLoading(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: 60, fontSize: 20 }}>로딩 중...</div>;
  if (error) return <div style={{ textAlign: 'center', color: 'red', padding: 60, fontSize: 20 }}>에러: {error}</div>;
  if (!board) return <div style={{ textAlign: 'center', color: 'red', padding: 60, fontSize: 20 }}>게시글을 찾을 수 없습니다.</div>;

  const isWriter = board.writer_id === localStorage.getItem('userId');
  const MemoComponent = NOTE_TYPE_MAP[board.note_type] || Note;

  return (
    <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f8faf8', padding: '40px 0' }}>
      <MemoComponent
        bgColor={board.note_color}
        style={{
          width: 'min(700px, 95vw)',
          minHeight: 420,
          boxShadow: '0 8px 32px rgba(0,0,0,0.13)',
          padding: '48px 40px 56px 40px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        <div style={{
          fontWeight: 800,
          fontSize: 32,
          marginBottom: 10,
          color: '#222',
          textAlign: 'center',
          wordBreak: 'break-all',
          lineHeight: 1.2,
        }}>{board.title}</div>
        <div style={{
          fontSize: 17,
          color: '#bfa76a',
          marginBottom: 24,
          textAlign: 'center',
          fontFamily: 'inherit',
          letterSpacing: 1.1,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}>
          {(() => {
            const studentId = board.User?.student_id;
            const year = studentId && studentId.length >= 4 ? studentId.slice(2, 4) : null;
            const company = board.User?.Profile?.company || '-';
            return (
              <span style={{fontWeight:600}}>
                {year ? `${year}학번` : '-'} {board.writer} {company}
              </span>
            );
          })()}
          <span style={{ fontSize: 15, color: '#c2b280', marginTop: 2 }}>
            {formatDate(board.regdate)} · 조회 {board.views}
          </span>
        </div>
        <div style={{
          fontSize: 20,
          color: '#222',
          whiteSpace: 'pre-line',
          textAlign: 'left',
          width: '100%',
          lineHeight: 1.7,
          wordBreak: 'break-all',
          flex: 1,
        }}>{board.content}</div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 36, marginBottom: 8 }}>
          <button
            onClick={handleLike}
            disabled={likeLoading}
            style={{
              background: 'none',
              border: 'none',
              outline: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 20,
              fontWeight: 600,
              color: liked ? '#e74c3c' : '#888',
              transition: 'color 0.2s',
              marginBottom: 2,
              userSelect: 'none',
            }}
            aria-label={liked ? '추천 취소' : '추천'}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill={liked ? '#e74c3c' : 'none'}
              stroke={liked ? '#e74c3c' : '#888'}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                filter: liked ? 'drop-shadow(0 2px 8px #e74c3c33)' : 'none',
                transition: 'all 0.2s',
                transform: liked ? 'scale(1.15)' : 'scale(1)',
              }}
            >
              <path d="M12 21C12 21 4 13.5 4 8.5C4 5.42 6.42 3 9.5 3C11.04 3 12.54 3.81 13.35 5.08C14.16 3.81 15.66 3 17.2 3C20.28 3 22.7 5.42 22.7 8.5C22.7 13.5 15 21 12 21Z" />
            </svg>
            <span style={{ fontSize: 19, fontWeight: 700, color: liked ? '#e74c3c' : '#888', minWidth: 24, textAlign: 'center' }}>{likes}</span>
            <span style={{ fontSize: 16, color: '#888', fontWeight: 400, marginLeft: 2 }}>{liked ? '추천됨' : '추천'}</span>
          </button>
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 20, justifyContent: 'center' }}>
          <button
            style={{
              background: 'linear-gradient(90deg, #f8faf8 60%, #e6f9e6 100%)',
              color: '#2563eb',
              fontWeight: 700,
              fontSize: 18,
              border: 'none',
              borderRadius: 24,
              padding: '14px 38px',
              cursor: 'pointer',
              boxShadow: '0 2px 12px rgba(37,99,235,0.08)',
              transition: 'background 0.2s, color 0.2s, box-shadow 0.2s, transform 0.15s',
              outline: 'none',
              marginRight: 8,
            }}
            onMouseOver={e => {
              e.currentTarget.style.background = 'linear-gradient(90deg, #e6f9e6 60%, #c3e6f7 100%)';
              e.currentTarget.style.color = '#0ea300';
              e.currentTarget.style.boxShadow = '0 4px 18px rgba(14,163,0,0.13)';
              e.currentTarget.style.transform = 'translateY(-2px) scale(1.04)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.background = 'linear-gradient(90deg, #f8faf8 60%, #e6f9e6 100%)';
              e.currentTarget.style.color = '#2563eb';
              e.currentTarget.style.boxShadow = '0 2px 12px rgba(37,99,235,0.08)';
              e.currentTarget.style.transform = 'none';
            }}
            onClick={handleBackToList}
          >
            목록으로
          </button>
          {isWriter && (
            <>
              <button
                style={{
                  background: '#f8f9fa',
                  color: '#495057',
                  fontWeight: 600,
                  fontSize: 18,
                  border: '1px solid #dee2e6',
                  borderRadius: 10,
                  padding: '12px 32px',
                  cursor: 'pointer',
                  marginLeft: 8,
                  marginRight: 8,
                  transition: 'background 0.2s, transform 0.2s',
                }}
                onClick={handleEdit}
              >
                수정
              </button>
              <button
                style={{
                  background: '#fff',
                  color: '#dc3545',
                  fontWeight: 600,
                  fontSize: 18,
                  border: '1px solid #dc3545',
                  borderRadius: 10,
                  padding: '12px 32px',
                  cursor: 'pointer',
                  transition: 'background 0.2s, color 0.2s',
                }}
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? '삭제 중...' : '삭제'}
              </button>
            </>
          )}
        </div>
      </MemoComponent>
    </div>
  );
};

export default SeniorBoardDetail; 