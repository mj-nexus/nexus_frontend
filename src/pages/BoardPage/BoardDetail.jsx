// src/pages/BoardPage/BoardDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { boardService } from '../../services/boardService';
import { formatDate } from '../../utils/dateFormattingUtil';
import styles from './BoardDetail.module.scss';
import writerCheck from '../../utils/boardUtil';
import CommentList from '../../components/Comment/CommentList';
import { ReportButton } from '../../components/Report/ReportButton';

export const BoardDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [board, setBoard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const fetchBoardDetail = async () => {
            try {
                setLoading(true);
                const data = await boardService.getBoardDetail(id);
                setBoard(data);
            } catch (err) {
                console.error('게시글 상세 로딩 오류:', err);
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

    const handleDelete = async () => {
        if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
            try {
                setIsDeleting(true);
                await boardService.deleteBoard(id);
                alert('게시글이 삭제되었습니다.');
                navigate('/board', { state: { refresh: true } });
            } catch (err) {
                console.error('게시글 삭제 오류:', err);
                alert('게시글 삭제에 실패했습니다.');
            } finally {
                setIsDeleting(false);
            }
        }
    };

    const handleBackToList = () => {
        navigate('/board');
    };

    if (loading) return <div className={styles.loadingContainer}>로딩 중...</div>;
    if (error) return <div className={styles.errorContainer}>에러: {error}</div>;
    if (!board) return <div className={styles.errorContainer}>게시글을 찾을 수 없습니다.</div>;

    const isWriter = writerCheck(board.writer_id);

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
                        {!isWriter && (
                            <span className={styles.reportButton}>
                                <ReportButton boardType="board" postId={id} />
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className={styles.content}>
                {board.content}
            </div>

            <div className={styles.footer}>
                <button className={styles.backBtn} onClick={handleBackToList}>
                    목록으로
                </button>
                
                {isWriter && (
                    <div className={styles.actions}>
                        <button className={styles.editBtn} onClick={handleEdit}>
                            수정
                        </button>
                        <button className={styles.deleteBtn} onClick={handleDelete} disabled={isDeleting}>
                            {isDeleting ? '삭제 중...' : '삭제'}
                        </button>
                    </div>
                )}
            </div>
            <CommentList boardId={id} userId={localStorage.getItem('userId')} />
        </div>
    );
};