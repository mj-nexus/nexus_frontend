// src/components/common/Pagination/Pagination.js
import styles from './Pagination.module.scss';

export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    return (
        <div className={styles.pagination}>
            {[...Array(totalPages)].map((_, idx) => (
                <button
                    key={idx + 1}
                    onClick={() => onPageChange(idx + 1)}
                    className={currentPage === idx + 1 ? styles.active : ''}
                >
                    {idx + 1}
                </button>
            ))}
        </div>
    );
};