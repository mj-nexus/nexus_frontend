// src/pages/BoardPage/StudentBoard.js
import { useNavigate } from 'react-router-dom';
import { BoardList } from '../../components/Board/BoardList';
import { boardService } from '../../services/boardService';
import styles from './StudentBoard.module.scss';

export const StudentBoard = () => {
    const navigate = useNavigate();

    const handleWriteClick = () => {
        navigate('/board/write');
    };

    return (
        <div className={styles.studentBoardPage}>
            <BoardList
                title="학생 게시판"
                fetchDataFn={boardService.getBoards}
                onWriteClick={handleWriteClick}
            />
        </div>
    );
};