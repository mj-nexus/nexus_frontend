// src/pages/BoardPage/BoardWrite.js
import React, { useState } from 'react';
import styles from './BoardWrite.module.scss';
import { boardService } from '../../services/boardService';
import { useNavigate } from 'react-router-dom';
import { validateProfanity } from '../../utils/profanityFilter';

export const BoardWrite = () => {
    const [title, setTitle] = useState('');
    const [tag, setTag] = useState('');
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({ title: '', content: '' });
    const navigate = useNavigate();
    const writer_id = localStorage.getItem('userId');
    const writer = localStorage.getItem('name');

    // 입력값 변경 시 유효성 검사
    const validateInput = (name, value) => {
        const validationResult = validateProfanity(value);
        
        setErrors(prev => ({
            ...prev,
            [name]: validationResult.errorMessage
        }));
        
        return validationResult.isValid;
    };

    // 제목 변경 핸들러
    const handleTitleChange = (e) => {
        const newTitle = e.target.value;
        setTitle(newTitle);
        validateInput('title', newTitle);
    };

    // 내용 변경 핸들러
    const handleContentChange = (e) => {
        const newContent = e.target.value;
        setContent(newContent);
        validateInput('content', newContent);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;
        
        // 제출 전 최종 유효성 검사
        const isTitleValid = validateInput('title', title);
        const isContentValid = validateInput('content', content);
        
        if (!isTitleValid || !isContentValid) {
            alert('부적절한 표현이 포함되어 있습니다. 수정 후 다시 시도해주세요.');
            return;
        }
        
        setIsSubmitting(true);
        const boardData = {
            writer_id,
            writer,
            title,
            tag,
            content
        };
        try {
            await boardService.writeBoard(boardData);
            alert('게시글 작성에 성공했습니다.');
            navigate('/board', { state: { refresh: true } });
        }
        catch (error) {
            console.error('게시글 작성 오류:', error);
            alert('게시글 작성에 실패했습니다. 다시 시도해주세요.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.writeWrapper}>
            <form className={styles.writeForm} onSubmit={handleSubmit}>
                <h2 className={styles.title}>게시글 작성</h2>
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
                        onChange={handleTitleChange}
                        required
                        placeholder="제목을 입력하세요"
                        className={errors.title ? styles.errorInput : ''}
                    />
                    {errors.title && <p className={styles.errorText}>{errors.title}</p>}
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="content">내용</label>
                    <textarea
                        id="content"
                        value={content}
                        onChange={handleContentChange}
                        required
                        placeholder="내용을 입력하세요"
                        rows={8}
                        className={errors.content ? styles.errorInput : ''}
                    />
                    {errors.content && <p className={styles.errorText}>{errors.content}</p>}
                </div>
                <div className={styles.buttonGroup}>
                    <button type="submit" className={styles.submitBtn} disabled={isSubmitting || errors.title || errors.content}>
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