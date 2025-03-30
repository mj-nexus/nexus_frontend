import React, { useState } from "react";
import { ReactComponent as HomeIcon } from "../../assets/homeIcon.svg"; // SVG 아이콘
import { ReactComponent as MessageIcon } from "../../assets/messageIcon.svg"; // SVG 아이콘
import { ReactComponent as SearchIcon } from "../../assets/searchIcon.svg"; // SVG 아이콘
import { ReactComponent as NoticeIcon } from "../../assets/noticeIcon.svg"; // SVG 아이콘
import { ReactComponent as StudyIcon } from "../../assets/studyIcon.svg"; // SVG 아이콘
import { ReactComponent as ProfileIcon } from "../../assets/userIcon.svg"; // SVG 아이콘
import "./style.scss";

export const Sidebar = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const menuItem = [
        { id: 1, icon: <HomeIcon className="icon" />, label: 'Dashboard' },
        { id: 2, icon: <MessageIcon className="icon" />, label: 'Message' },
        { id: 3, icon: <SearchIcon className="icon" />, label: 'Search' },
        { id: 4, icon: <NoticeIcon className="icon" />, label: 'Notice' },
        { id: 5, icon: <StudyIcon className="icon" />, label: 'Study' },
        { id: 6, icon: <ProfileIcon className="icon" />, label: 'Profile' },
    ];

    return (
        <div className="sidebar">
            {menuItem.map((item, index) => (
                <div
                    key={item.id}
                    className={`menu-item ${activeIndex === index ? "active" : ""}`}
                    onClick={() => setActiveIndex(index)}
                >
                    <div
                        className="indicator"
                        style={{ opacity: activeIndex === index ? "1" : "0" }}
                    />
                    {React.cloneElement(item.icon, {
                        style: {
                            fill: activeIndex === index ? "#0ea300" : "#000",
                            filter: activeIndex === index ? "none" : "grayscale(100%)", // 비활성 아이콘 회색 처리
                        },
                    })}
                    {item.label}
                </div>
            ))}
        </div>
    );
};
