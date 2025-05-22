import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Note,
  GridNote,
  LinedNote,
  TornNote,
  PostcardNote
} from '../../components/Memo/styles';
import styles from './BoardWrite.module.scss';
import { seniorBoardService } from '../../services/seniorBoardService';
import api from '../../api/axiosInstance';

const NOTE_TYPES = [
  { label: '기본', value: 'Note', component: Note },
  { label: '격자', value: 'GridNote', component: GridNote },
  { label: '줄', value: 'LinedNote', component: LinedNote },
  { label: '찢어진', value: 'TornNote', component: TornNote },
  { label: '엽서', value: 'PostcardNote', component: PostcardNote },
];

const NOTE_COLORS = [
  '#e8f5e9', '#fff9c4', '#bbdefb', '#e0f2f1', '#ffccbc', '#e6ee9c', '#ffffff', '#f8bbd0',
];

const SeniorBoardWrite = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [note_type, setNoteType] = useState('Note');
  const [note_color, setNoteColor] = useState(NOTE_COLORS[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const writer_id = localStorage.getItem('userId');
  const writer = localStorage.getItem('name');

  // 현재 사용자의 학번 확인
  useEffect(() => {
    const checkUserPermission = async () => {
      try {
        setLoading(true);
        const userId = localStorage.getItem('userId');
        if (!userId) {
          navigate('/board');
          return;
        }
        
        const response = await api.get(`/api/user/getUserById/${userId}`);
        const studentId = response.data.student_id;
        
        if (studentId && studentId.length >= 4) {
          const yearPart = studentId.slice(2, 4); // 학번에서 년도 부분(2자리) 추출
          const currentYear = new Date().getFullYear() % 100; // 현재 년도의 뒤 2자리
          
          // 현재 년도와 학번의 년도가 같은 경우 권한 없음
          if (Number(yearPart) === currentYear) {
            alert('현재 학번 년도의 학생은 선배게시판에 글을 작성할 수 없습니다.');
            navigate('/board', { state: { tab: 'senior' } });
          }
        }
      } catch (error) {
        console.error('사용자 정보를 확인하는 중 오류 발생:', error);
        navigate('/board');
      } finally {
        setLoading(false);
      }
    };
    
    checkUserPermission();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    const boardData = {
      writer_id,
      writer,
      title,
      content,
      note_type,
      note_color,
    };
    try {
      await seniorBoardService.createBoard(boardData);
      alert('게시글 작성에 성공했습니다.');
      navigate('/board', { state: { refresh: true } });
    } catch (error) {
      console.error('게시글 작성 오류:', error);
      alert('게시글 작성에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 선택된 메모지 컴포넌트
  const SelectedNote = NOTE_TYPES.find(nt => nt.value === note_type).component;

  if (loading) {
    return <div className={styles.loading}>로딩 중...</div>;
  }

  return (
    <div className={styles.writeWrapper}>
      <form className={styles.writeForm} onSubmit={handleSubmit}>
        <h2 className={styles.title}>선배게시판 글쓰기</h2>
        <div className={styles.formGroup}>
          <label htmlFor="title">제목</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            placeholder="제목을 입력하세요"
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="noteType">메모지 모양</label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {NOTE_TYPES.map(nt => (
              <button
                type="button"
                key={nt.value}
                onClick={() => setNoteType(nt.value)}
                style={{
                  border: note_type === nt.value ? '2px solid #2563eb' : '1px solid #ccc',
                  background: '#fff',
                  padding: 4,
                  borderRadius: 6,
                  cursor: 'pointer',
                }}
              >
                <nt.component bgColor={note_color} style={{ width: 40, height: 40, margin: 0, padding: 0 }} />
                <div style={{ fontSize: 12 }}>{nt.label}</div>
              </button>
            ))}
          </div>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="noteColor">메모지 색상</label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {NOTE_COLORS.map(color => (
              <button
                type="button"
                key={color}
                onClick={() => setNoteColor(color)}
                style={{
                  width: 32,
                  height: 32,
                  background: color,
                  border: note_color === color ? '2px solid #2563eb' : '1px solid #ccc',
                  borderRadius: '50%',
                  cursor: 'pointer',
                }}
              />
            ))}
          </div>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="content">내용</label>
          <SelectedNote bgColor={note_color} style={{ minHeight: 180, marginBottom: 12 }}>
            <textarea
              id="content"
              value={content}
              onChange={e => setContent(e.target.value)}
              required
              placeholder="내용을 입력하세요"
              rows={6}
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
                background: 'transparent',
                resize: 'none',
                fontSize: 16,
                outline: 'none',
              }}
            />
          </SelectedNote>
        </div>
        <div className={styles.buttonGroup}>
          <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
            {isSubmitting ? '저장 중...' : '등록'}
          </button>
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={() => navigate('/board')}
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
};

export default SeniorBoardWrite; 