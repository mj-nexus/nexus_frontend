// src/components/board/BoardList/BoardList.js
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
    const location = useLocation();
    const [boardData, setBoardData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [refreshKey, setRefreshKey] = useState(0);
    const itemsPerPage = 10;

    const fetchBoards = async (page) => {
        if (!fetchDataFn) {
            setError('데이터를 불러오는 함수가 제공되지 않았습니다.');
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const result = await fetchDataFn(page, itemsPerPage);
            
            if (result && Array.isArray(result.data)) {
                // 새로운 API 응답 형식: {data: Array, length: number, page: number, total: number, totalPages: number}
                setBoardData(result.data);
                if (result.totalPages) {
                    setTotalPages(result.totalPages);
                } else if (result.total) {
                    setTotalPages(Math.ceil(result.total / itemsPerPage));
                } else {
                    // 페이지네이션 정보가 없는 경우 데이터 길이로 추정
                    setTotalPages(Math.max(Math.ceil(result.data.length / itemsPerPage), 1));
                }
            } else if (Array.isArray(result)) {
                // 기존 방식: API가 직접 배열을 반환하는 경우
                setBoardData(result);
                
                // 배열 길이가 itemsPerPage보다 작으면 현재 페이지가 마지막 페이지로 추정
                if (result.length < itemsPerPage) {
                    setTotalPages(currentPage);
                } else {
                    // 더 많은 페이지가 있을 수 있으므로 최소한 현재 페이지 다음 페이지까지
                    setTotalPages(Math.max(currentPage + 1, totalPages));
                }
            } else {
                // 결과가 예상 형식이 아닌 경우
                console.error("API 응답 형식이 올바르지 않습니다:", result);
                setBoardData([]);
                setTotalPages(1);
            }
        } catch (err) {
            console.error("데이터 로딩 에러:", err);
            setError('데이터를 불러오는데 실패했습니다.');
            setBoardData([]);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    };

    // 페이지나 fetchDataFn, 또는 refreshKey가 변경될 때마다 데이터를 다시 불러옴
    useEffect(() => {
        fetchBoards(currentPage);
    }, [currentPage, fetchDataFn, refreshKey]);

    // 위치(URL)가 변경될 때마다 refreshKey를 증가시켜 데이터 새로고침
    useEffect(() => {
        setRefreshKey(prev => prev + 1);
    }, [location.pathname]);

    // location.state를 확인하여 새로고침이 필요한 경우 처리
    useEffect(() => {
        // state에 refresh: true가 있으면 데이터 새로고침
        if (location.state?.refresh) {
            setRefreshKey(prev => prev + 1);
            // state 초기화 (새로고침 후에는 상태 제거)
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location.state, navigate, location.pathname]);

    const handleSearch = async (searchTerm, searchType = 'title') => {
        setCurrentPage(1);
        setLoading(true);
        try {
            const result = await boardService.searchBoards(searchTerm, 1, itemsPerPage, searchType);
            
            if (result && Array.isArray(result.data)) {
                // 새로운 API 응답 형식: {data: Array, length: number, page: number, total: number, totalPages: number}
                setBoardData(result.data);
                if (result.totalPages) {
                    setTotalPages(result.totalPages);
                } else if (result.total) {
                    setTotalPages(Math.ceil(result.total / itemsPerPage));
                } else {
                    // 페이지네이션 정보가 없는 경우 데이터 길이로 추정
                    setTotalPages(Math.max(Math.ceil(result.data.length / itemsPerPage), 1));
                }
            } else if (Array.isArray(result)) {
                // 기존 방식: API가 직접 배열을 반환하는 경우
                setBoardData(result);
                
                // 배열 길이가 itemsPerPage보다 작으면 1페이지만 있음
                if (result.length < itemsPerPage) {
                    setTotalPages(1);
                } else {
                    // 더 많은 페이지가 있을 수 있음
                    setTotalPages(2);
                }
            } else {
                // 결과가 예상 형식이 아닌 경우
                console.error("검색 API 응답 형식이 올바르지 않습니다:", result);
                setBoardData([]);
                setTotalPages(1);
            }
        } catch (err) {
            console.error("검색 에러:", err);
            setError('검색에 실패했습니다.');
            setBoardData([]);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    };

    // 수동 새로고침 기능
    const handleRefresh = () => {
        setRefreshKey(prev => prev + 1);
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