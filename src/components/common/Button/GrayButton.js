// src/components/common/Button/GrayButton.js
import React from 'react';
import styles from './GrayButton.module.scss';

export const GrayButton = ({ children, onClick, className = '' }) => {
    return (
        <button
            className={`${styles.grayButton} ${className}`}
            onClick={onClick}
        >
            {children}
        </button>
    );
};