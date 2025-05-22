// src/pages/ProfilePage/MyPosts.js
import { BoardList } from '../../components/Board/BoardList';
import { boardService } from '../../services/boardService';

export const MyBoard = () => {
    const userId = localStorage.getItem('userId');
    const fetchMyPosts = () => boardService.getMyBoard(userId);

    return (
        <BoardList
            title="내가 쓴 글"
            fetchDataFn={fetchMyPosts}
            showWriteButton={false}
            showSearch={false}
            customClassName="my-posts"
        />
    );
};