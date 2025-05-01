import { useState } from "react";
import { StudentBoard } from "../../pages/BoardPage/StudentBoard";
import { SeniorBoard } from "../../pages/BoardPage/SeniorBoard";
import "./BoardLayout.scss";

export const BoardLayout = () => {
    const [boardType, setBoardType] = useState(1);
    return (
        <div className="board_layout">
            <div className="span_wrap">
                <span className="board-span" onClick={() => setBoardType(1)}>학생</span>
                <span className="board-span" onClick={() => setBoardType(2)}>선배</span>
            </div>
            <div className="board_content">
                {boardType === 1 ? <StudentBoard /> : <SeniorBoard />}
            </div>
        </div>
    );
};