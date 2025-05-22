import { useState } from "react";
import { useLocation } from "react-router-dom";
import { StudentBoard } from "../../pages/BoardPage/StudentBoard";
import { SeniorBoard } from "../../pages/BoardPage/SeniorBoard";
import "./BoardLayout.scss";

export const BoardLayout = () => {
    const location = useLocation();
    // location.state?.tab === 'senior'이면 선배탭, 아니면 학생탭
    const [boardType, setBoardType] = useState(location.state?.tab === 'senior' ? 2 : 1);
    return (
        <div className="board_layout">
            <div className="span_wrap">
                <span className="board-span" onClick={() => setBoardType(1)} style={boardType === 1 ? {fontWeight:700} : {}}>학생</span>
                <span className="board-span" onClick={() => setBoardType(2)} style={boardType === 2 ? {fontWeight:700} : {}}>선배</span>
            </div>
            <div className="board_content">
                {boardType === 1 ? <StudentBoard /> : <SeniorBoard />}
            </div>
        </div>
    );
};