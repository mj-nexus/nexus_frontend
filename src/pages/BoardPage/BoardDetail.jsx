// src/pages/BoardPage/BoardDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { boardService } from '../../services/boardService';
import { formatDate } from '../../utils/dateFormattingUtil';
import styles from './BoardDetail.module.scss';
import writerCheck from '../../utils/boardUtil';
export const BoardDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [board, setBoard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBoardDetail = async () => {
            try {
                setLoading(true);
                const data = await boardService.getBoardDetail(id);
                setBoard(data);
            } catch (err) {
                setError(err.message || '게시글을 불러오는데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchBoardDetail();
    }, [id]);

    const handleEdit = () => {
        navigate(`/board/edit/${id}`);
    };

    const handleDelete = () => {
        if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
            boardService.deleteBoard(id)
                .then(() => {
                    navigate('/board');
                })
                .catch((err) => {
                    alert('게시글 삭제에 실패했습니다.');
                });
        }
    };

    if (loading) return <div className={styles.loadingContainer}>로딩 중...</div>;
    if (error) return <div className={styles.errorContainer}>에러: {error}</div>;
    if (!board) return <div className={styles.errorContainer}>게시글을 찾을 수 없습니다.</div>;

    return (
        <div className={styles.boardDetailContainer}>
            <div className={styles.header}>
                <h1 className={styles.title}>{board.title}</h1>
                <div className={styles.meta}>
                    <div className={styles.authorInfo}>
                        <span className={styles.author}>{board.writer}</span>
                        <span className={styles.date}>{formatDate(board.regdate)}</span>
                    </div>
                    <div className={styles.stats}>
                        <span>
                            <i className="fas fa-eye"></i>
                            조회 {board.views}
                        </span>
                    </div>
                </div>
            </div>

            <div className={styles.content}>
                {board.content}
            </div>

            <div className={styles.footer}>
                {writerCheck(board.writer_id) && (
                    <div className={styles.actions}>
                        <button className={styles.editBtn} onClick={handleEdit}>
                            수정
                    </button>
                    <button className={styles.deleteBtn} onClick={handleDelete}>
                        삭제
                    </button>
                </div>
                )}
            </div>
        </div>
    );
};