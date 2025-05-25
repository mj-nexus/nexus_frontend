import React, { useEffect, useState } from 'react';
import { getCommentsByBoard, createComment } from '../../services/commentService';
import CommentItem from './CommentItem';
import { validateProfanity } from '../../utils/profanityFilter';

const THEME_COLOR = '#0ea300';
const THEME_COLOR_LIGHT = '#e6fbe6';
const THEME_COLOR_DARK = '#087a00';
const ERROR_COLOR = '#e74c3c';

export default function CommentList({ boardId, userId }) {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [commentError, setCommentError] = useState('');

  // 댓글 목록 불러오기
  const fetchComments = async () => {
    setLoading(true);
    const res = await getCommentsByBoard(boardId);
    setComments(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchComments();
  }, [boardId]);

  // 내용 변경 시 유효성 검사
  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);
    
    if (newContent.trim()) {
      const validationResult = validateProfanity(newContent);
      setCommentError(validationResult.errorMessage);
    } else {
      setCommentError('');
    }
  };

  // 댓글 작성
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    // 제출 전 최종 유효성 검사
    const validationResult = validateProfanity(content);
    
    if (!validationResult.isValid) {
      setCommentError(validationResult.errorMessage);
      return;
    }
    
    try {
      await createComment(boardId, userId, content);
      setContent('');
      setCommentError('');
      fetchComments();
    } catch (error) {
      console.error('댓글 작성 오류:', error);
      alert('댓글 작성에 실패했습니다. 다시 시도해주세요.');
    }
  };

  // 댓글 수정/삭제 후 목록 갱신
  const handleUpdate = () => fetchComments();

  return (
    <div style={{
      marginTop: 40,
      background: '#f9fafb',
      borderRadius: 12,
      padding: 24,
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
    }}>
      <h3 style={{ marginBottom: 18, fontSize: 20, fontWeight: 700, color: THEME_COLOR }}>댓글</h3>
      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          marginBottom: 24
        }}
      >
        <div style={{
          display: 'flex',
          gap: 12,
          alignItems: 'flex-end'
        }}>
          <textarea
            value={content}
            onChange={handleContentChange}
            placeholder="댓글을 입력하세요"
            style={{
              flex: 1,
              minHeight: 44,
              borderRadius: 8,
              border: commentError ? `1.5px solid ${ERROR_COLOR}` : `1.5px solid ${THEME_COLOR}`,
              padding: 12,
              fontSize: 15,
              resize: 'vertical',
              outlineColor: commentError ? ERROR_COLOR : THEME_COLOR,
              backgroundColor: commentError ? '#fff8f8' : '#fff'
            }}
          />
          <button
            type="submit"
            disabled={!content.trim() || commentError}
            style={{
              background: !content.trim() || commentError ? '#ccc' : THEME_COLOR,
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '10px 22px',
              fontWeight: 600,
              fontSize: 15,
              cursor: !content.trim() || commentError ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s',
            }}
            onMouseOver={e => {
              if (!(!content.trim() || commentError)) {
                e.currentTarget.style.background = THEME_COLOR_DARK;
              }
            }}
            onMouseOut={e => {
              if (!(!content.trim() || commentError)) {
                e.currentTarget.style.background = THEME_COLOR;
              }
            }}
          >
            등록
          </button>
        </div>
        
        {commentError && (
          <div style={{
            color: ERROR_COLOR,
            fontSize: 14,
            marginTop: 4,
            padding: '4px 8px',
            backgroundColor: 'rgba(231, 76, 60, 0.1)',
            borderRadius: 4
          }}>
            {commentError}
          </div>
        )}
      </form>
      
      {loading ? (
        <div style={{ color: '#888', padding: 16 }}>로딩 중...</div>
      ) : comments.length === 0 ? (
        <div style={{ color: '#aaa', padding: 16 }}>아직 댓글이 없습니다.</div>
      ) : (
        <div>
          {comments.map(comment => (
            <CommentItem
              key={comment.comment_id}
              comment={comment}
              userId={userId}
              onUpdate={handleUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
} 