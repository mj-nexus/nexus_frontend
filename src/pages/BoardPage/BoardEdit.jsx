// src/pages/BoardPage/BoardEdit.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { boardService } from '../../services/boardService';
import styles from './BoardWrite.module.scss';

export const BoardEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [tag, setTag] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchBoardDetail = async () => {
            try {
                setLoading(true);
                const data = await boardService.getBoardDetail(id);
                setTitle(data.title);
                setTag(data.tag);
                setContent(data.content);
            } catch (err) {
                setError(err.message || '게시글을 불러오는데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchBoardDetail();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;
        
        setIsSubmitting(true);
        const boardData = {
            title,
            tag,
            content
        };
        
        try {
            await boardService.updateBoard(id, boardData);
            alert('게시글 수정에 성공했습니다.');
            navigate(`/board/${id}`, { state: { refresh: true } });
        } catch (error) {
            console.error('게시글 수정 오류:', error);
            alert('게시글 수정에 실패했습니다. 다시 시도해주세요.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <div className={styles.loadingContainer}>로딩 중...</div>;
    if (error) return <div className={styles.errorContainer}>에러: {error}</div>;

    return (
        <div className={styles.writeWrapper}>
            <form className={styles.writeForm} onSubmit={handleSubmit}>
                <h2 className={styles.title}>게시글 수정</h2>
                <div className={styles.formGroup}>
                    <label htmlFor="tag">말머리</label>
                    <select id="tag" value={tag} onChange={e => setTag(e.target.value)} required>
                        <option value="">선택</option>
                        <option value="공지">공지</option>
                        <option value="잡담">잡담</option>
                        <option value="정보">정보</option>
                        <option value="질문">질문</option>
                        <option value="모집">모집</option>
                        <option value="후기">후기</option>
                    </select>
                </div>
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
                    <label htmlFor="content">내용</label>
                    <textarea
                        id="content"
                        value={content}
                        onChange={e => setContent(e.target.value)}
                        required
                        placeholder="내용을 입력하세요"
                        rows={8}
                    />
                </div>
                <div className={styles.buttonGroup}>
                    <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                        {isSubmitting ? '저장 중...' : '수정'}
                    </button>
                    <button 
                        type="button" 
                        className={styles.cancelBtn} 
                        onClick={() => navigate(`/board/${id}`)}
                    >
                        취소
                    </button>
                </div>
            </form>
        </div>
    );
};