// src/pages/BoardPage/BoardWrite.js
import React, { useState } from 'react';
import styles from './BoardWrite.module.scss';
import { boardService } from '../../services/boardService';
import { useNavigate } from 'react-router-dom';

export const BoardWrite = () => {
    const [title, setTitle] = useState('');
    const [tag, setTag] = useState('');
    const [content, setContent] = useState('');
    const navigate = useNavigate();
    const writer_id = localStorage.getItem('userId');
    const writer = localStorage.getItem('name');

    const handleSubmit = (e) => {
        e.preventDefault();
        const boardData = {
            writer_id,
            writer,
            title,
            tag,
            content
        };
        try {
            boardService.writeBoard(boardData);
            alert('게시글 작성에 성공했습니다.');
            navigate('/board');
        }
        catch (error) {
            console.error('게시글 작성 오류:', error);
            alert('게시글 작성에 실패했습니다. 다시 시도해주세요.');
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
                    <button type="submit" className={styles.submitBtn}>등록</button>
                </div>
            </form>
        </div>
    );
};