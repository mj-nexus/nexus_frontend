// src/components/board/BoardSearch/BoardSearch.js
import { useState } from 'react';
import styles from './BoardSearch.module.scss';

export const BoardSearch = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchType, setSearchType] = useState('title');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(searchTerm, searchType);
    };

    return (
        <form className={styles.searchForm} onSubmit={handleSubmit}>
            <div className={styles.searchTypeContainer}>
                <select 
                    value={searchType} 
                    onChange={(e) => setSearchType(e.target.value)}
                    className={styles.searchTypeSelect}
                >
                    <option value="title">제목</option>
                    <option value="content">내용</option>
                    <option value="writer">작성자</option>
                    <option value="tag">말머리</option>
                </select>
            </div>
            <div className={styles.searchInputContainer}>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="검색어를 입력하세요..."
                    className={styles.searchInput}
                />
                <button type="submit" className={styles.searchButton}>
                    검색
                </button>
            </div>
        </form>
    );
};