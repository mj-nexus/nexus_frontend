import React, { useEffect, useState } from 'react';
import { getCommentsByBoard, createComment } from '../../services/commentService';
import CommentItem from './CommentItem';

const THEME_COLOR = '#0ea300';
const THEME_COLOR_LIGHT = '#e6fbe6';
const THEME_COLOR_DARK = '#087a00';

export default function CommentList({ boardId, userId }) {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

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

  // 댓글 작성
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    await createComment(boardId, userId, content);
    setContent('');
    fetchComments();
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
          gap: 12,
          marginBottom: 24,
          alignItems: 'flex-end'
        }}
      >
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="댓글을 입력하세요"
          style={{
            flex: 1,
            minHeight: 44,
            borderRadius: 8,
            border: `1.5px solid ${THEME_COLOR}`,
            padding: 12,
            fontSize: 15,
            resize: 'vertical',
            outlineColor: THEME_COLOR
          }}
        />
        <button
          type="submit"
          style={{
            background: THEME_COLOR,
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '10px 22px',
            fontWeight: 600,
            fontSize: 15,
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}
          onMouseOver={e => (e.currentTarget.style.background = THEME_COLOR_DARK)}
          onMouseOut={e => (e.currentTarget.style.background = THEME_COLOR)}
        >
          등록
        </button>
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