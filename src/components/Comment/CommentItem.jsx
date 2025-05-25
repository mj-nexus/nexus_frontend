import React, { useState } from 'react';
import { updateComment, deleteComment } from '../../services/commentService';
import { validateProfanity } from '../../utils/profanityFilter';

const THEME_COLOR = '#0ea300';
const THEME_COLOR_LIGHT = '#e6fbe6';
const THEME_COLOR_DARK = '#087a00';
const BORDER_COLOR = '#e0e0e0';
const ERROR_COLOR = '#e74c3c';

export default function CommentItem({ comment, userId, onUpdate }) {
  const [isEdit, setIsEdit] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [editError, setEditError] = useState('');

  // 날짜 포맷 (예시)
  const date = comment.regdate
    ? new Date(comment.regdate).toLocaleString()
    : '';

  // 작성자 이름/닉네임
  const profile = comment.User && comment.User.Profile ? comment.User.Profile : {};
  const displayName = profile.nick_name && profile.nick_name.trim()
    ? profile.nick_name
    : profile.user_name || `user${comment.user_id}`;

  // 수정 내용 변경 시 유효성 검사
  const handleEditChange = (e) => {
    const newContent = e.target.value;
    setEditContent(newContent);
    
    if (newContent.trim()) {
      const validationResult = validateProfanity(newContent);
      setEditError(validationResult.errorMessage);
    } else {
      setEditError('');
    }
  };

  // 댓글 수정
  const handleEdit = async () => {
    if (!editContent.trim()) {
      setEditError('댓글 내용을 입력해주세요.');
      return;
    }
    
    // 제출 전 최종 유효성 검사
    const validationResult = validateProfanity(editContent);
    
    if (!validationResult.isValid) {
      setEditError(validationResult.errorMessage);
      return;
    }
    
    try {
      await updateComment(comment.comment_id, editContent);
      setIsEdit(false);
      setEditError('');
      onUpdate();
    } catch (error) {
      console.error('댓글 수정 오류:', error);
      alert('댓글 수정에 실패했습니다. 다시 시도해주세요.');
    }
  };

  // 댓글 삭제
  const handleDelete = async () => {
    if (window.confirm('댓글을 삭제하시겠습니까?')) {
      try {
        await deleteComment(comment.comment_id);
        onUpdate();
      } catch (error) {
        console.error('댓글 삭제 오류:', error);
        alert('댓글 삭제에 실패했습니다. 다시 시도해주세요.');
      }
    }
  };

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 8,
        padding: '14px 18px',
        marginBottom: 14,
        boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
        border: `1.5px solid ${BORDER_COLOR}`
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 6 }}>
        <span style={{ fontWeight: 600, color: THEME_COLOR, marginRight: 10 }}>
          {displayName}
        </span>
        <span style={{ color: '#bbb', fontSize: 13 }}>{date}</span>
      </div>
      {isEdit ? (
        <div>
          <textarea
            value={editContent}
            onChange={handleEditChange}
            style={{
              width: '100%',
              minHeight: 40,
              borderRadius: 6,
              border: editError ? `1.5px solid ${ERROR_COLOR}` : `1.5px solid ${BORDER_COLOR}`,
              padding: 8,
              fontSize: 15,
              backgroundColor: editError ? '#fff8f8' : '#fff'
            }}
          />
          {editError && (
            <div style={{
              color: ERROR_COLOR,
              fontSize: 13,
              marginTop: 4,
              marginBottom: 8,
              padding: '4px 8px',
              backgroundColor: 'rgba(231, 76, 60, 0.1)',
              borderRadius: 4
            }}>
              {editError}
            </div>
          )}
          <div style={{ marginTop: 8 }}>
            <button
              onClick={handleEdit}
              disabled={!editContent.trim() || editError}
              style={{
                background: !editContent.trim() || editError ? '#ccc' : THEME_COLOR,
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                padding: '6px 16px',
                fontWeight: 600,
                marginRight: 8,
                cursor: !editContent.trim() || editError ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s',
              }}
              onMouseOver={e => {
                if (!(!editContent.trim() || editError)) {
                  e.currentTarget.style.background = THEME_COLOR_DARK;
                }
              }}
              onMouseOut={e => {
                if (!(!editContent.trim() || editError)) {
                  e.currentTarget.style.background = THEME_COLOR;
                }
              }}
            >
              저장
            </button>
            <button
              onClick={() => {
                setIsEdit(false);
                setEditContent(comment.content);
                setEditError('');
              }}
              style={{
                background: '#eee',
                color: '#333',
                border: 'none',
                borderRadius: 6,
                padding: '6px 16px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              취소
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 15, color: '#222' }}>{comment.content}</div>
          {String(userId) === String(comment.user_id) && (
            <div>
              <button
                onClick={() => setIsEdit(true)}
                style={{
                  background: THEME_COLOR_LIGHT,
                  color: THEME_COLOR,
                  border: `1.5px solid ${THEME_COLOR}`,
                  borderRadius: 6,
                  padding: '5px 12px',
                  fontWeight: 600,
                  marginRight: 6,
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
                onMouseOver={e => (e.currentTarget.style.background = THEME_COLOR)}
                onMouseOut={e => (e.currentTarget.style.background = THEME_COLOR_LIGHT)}
              >
                수정
              </button>
              <button
                onClick={handleDelete}
                style={{
                  background: '#ffeaea',
                  color: '#e74c3c',
                  border: 'none',
                  borderRadius: 6,
                  padding: '5px 12px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                삭제
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 