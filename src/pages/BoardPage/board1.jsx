// BoardList.js
import React, { useEffect, useState } from "react";
import "./Board.scss";
import { formatDate } from "../../utils/dateFormattingUtil";

export const BoardList = ({
                              title,                    // 게시판 제목
                              fetchDataFn,             // 데이터를 가져오는 함수
                              onWriteClick,            // 글쓰기 버튼 클릭 핸들러
                              showWriteButton = true,  // 글쓰기 버튼 표시 여부
                              showSearch = true,       // 검색 기능 표시 여부
                              onSearch,                // 검색 핸들러
                              customClassName          // 추가 스타일링을 위한 클래스
                          }) => {
    const [boardData, setBoardData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchBoards = async () => {
            try {
                const result = await fetchDataFn();
                setBoardData(result);
            } catch (error) {
                console.error('데이터를 가져오는데 실패했습니다:', error);
            }
        };

        fetchBoards();
    }, [fetchDataFn]);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        if (onSearch) {
            onSearch(e.target.value);
        }
    };

    return (
        <div className={`board-wrapper ${customClassName || ''}`}>
            <div className="board-header">
                <h2>{title}</h2>
                {showWriteButton && (
                    <button
                        className="write-btn"
                        onClick={onWriteClick}
                    >
                        글쓰기
                    </button>
                )}
            </div>

            {showSearch && (
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="검색어를 입력하세요..."
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </div>
            )}

            <div className="board-table">
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
                    {boardData.map((post) => (
                        <tr key={post.id}>
                            <td className="tag">{post.tag}</td>
                            <td className="title">{post.title}</td>
                            <td>{post.writer}</td>
                            <td>{post.views}</td>
                            <td>{formatDate(post.regdate)}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <Pagination
                currentPage={currentPage}
                totalPages={5} // 실제 총 페이지 수로 변경 필요
                onPageChange={setCurrentPage}
            />
        </div>
    );
};

// Pagination 컴포넌트 분리
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    return (
        <div className="pagination">
            {[...Array(totalPages)].map((_, idx) => (
                <button
                    key={idx + 1}
                    onClick={() => onPageChange(idx + 1)}
                    className={currentPage === idx + 1 ? 'active' : ''}
                >
                    {idx + 1}
                </button>
            ))}
            {currentPage < totalPages && (
                <button onClick={() => onPageChange(currentPage + 1)}>
                    다음
                </button>
            )}
        </div>
    );
};