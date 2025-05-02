// src/components/board/BoardList/BoardList.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GrayButton } from '../../common/Button/GrayButton';
import { BoardSearch } from '../BoardSearch/BoardSearch';
import { Pagination } from '../../common/Pagination/Pagination';
import { formatDate } from '../../../utils/dateFormattingUtil';
import { boardService } from '../../../services/boardService';
import styles from './BoardList.module.scss';

export const BoardList = ({
                              title,
                              fetchDataFn,
                              onWriteClick,
                              showWriteButton = true,
                              showSearch = true,
                          }) => {
    const navigate = useNavigate();
    const [boardData, setBoardData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const fetchBoards = async (page) => {
        if (!fetchDataFn) {
            setError('데이터를 불러오는 함수가 제공되지 않았습니다.');
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            // boardService에서 직접 데이터를 반환하므로 result.data가 아닌 result를 사용
            const result = await fetchDataFn(page);
            setBoardData(result || []);
            // 페이지네이션 계산 로직 수정 필요 시 여기에 추가
        } catch (err) {
            setError('데이터를 불러오는데 실패했습니다.');
            setBoardData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBoards(currentPage);
    }, [currentPage]);

    const handleSearch = async (searchTerm) => {
        setCurrentPage(1);
        setLoading(true);
        try {
            const result = await boardService.searchBoards(searchTerm);
            setBoardData(result || []);
        } catch (err) {
            setError('검색에 실패했습니다.');
            setBoardData([]);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className={styles.loading}>로딩 중...</div>;
    if (error) return <div className={styles.error}>{error}</div>;

    return (
        <div className={styles.boardWrapper}>
            <div className={styles.boardHeader}>
                <h2>{title}</h2>
                {showWriteButton && (
                    <GrayButton onClick={onWriteClick}>
                        글쓰기
                    </GrayButton>
                )}
            </div>

            {showSearch && (
                <BoardSearch onSearch={handleSearch} />
            )}

            <div className={styles.boardTable}>
                <table>
                    <thead>
                    <tr>
                        <th>말머리</th>
                        <th>제목</th>
                        <th>작성자</th>
                        <th>조회수</th>
                        <th>작성일</th>
                    </tr>
                    </thead>
                    <tbody>
                    {boardData.length === 0 ? (
                        <tr>
                            <td colSpan="5" style={{ textAlign: 'center' }}>
                                게시글이 없습니다.
                            </td>
                        </tr>
                    ) : (
                        boardData.map((post, index) => (
                            <tr key={post.id || `post-${index}`} onClick={() => navigate(`/board/${post.board_id}`)}>
                                <td className={styles.tag} data-label="말머리">{post.tag}</td>
                                <td className={styles.title} data-label="제목">{post.title}</td>
                                <td data-label="작성자">{post.writer}</td>
                                <td data-label="조회수">{post.views}</td>
                                <td data-label="작성일">{formatDate(post.regdate)}</td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
        </div>
    );
};