// src/components/board/BoardSearch/BoardSearch.js
import { useState } from 'react';
import styles from './BoardSearch.module.scss';

export const BoardSearch = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(searchTerm);
    };

    return (
        <form className={styles.searchForm} onSubmit={handleSubmit}>
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
        </form>
    );
};