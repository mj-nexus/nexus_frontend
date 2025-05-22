import React from "react";
import { ReactComponent as HomeIcon } from "../../assets/homeIcon.svg"; // SVG 아이콘
import { ReactComponent as MessageIcon } from "../../assets/messageIcon.svg"; // SVG 아이콘
import { ReactComponent as NoticeIcon } from "../../assets/noticeIcon.svg"; // SVG 아이콘
import { ReactComponent as StudyIcon } from "../../assets/studyIcon.svg"; // SVG 아이콘
import { ReactComponent as ProfileIcon } from "../../assets/userIcon.svg"; // SVG 아이콘
import "./style.scss";
import { useLocation, useNavigate } from "react-router-dom";

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path) => {
    if (path === "") return location.pathname === "/";
    return location.pathname.startsWith(`/${path}`);
  };
  

  const handleClick = (path) => {
    navigate(`/${path}`);
  };
  const menuItem = [
    {
      id: 1,
      icon: <HomeIcon className="icon" />,
      label: "Dashboard",
      path: "",
    },
    {
      id: 2,
      icon: <MessageIcon className="icon" />,
      label: "Message",
      path: "message",
    },
    {
      id: 4,
      icon: <NoticeIcon className="icon" />,
      label: "Notice",
      path: "board",
    },
    {
      id: 5,
      icon: <StudyIcon className="icon" />,
      label: "Study",
      path: "study",
    },
    {
      id: 6,
      icon: <ProfileIcon className="icon" />,
      label: "Profile",
      path: "profile",
    },
  ];

  return (
    <div className="sidebar">
      {menuItem.map((item) => (
        <div
          key={item.id}
          className={`menu-item ${isActive(item.path) ? "active" : ""}`}
          onClick={() => handleClick(item.path)}
        >
          <div
            className="indicator"
            style={{ opacity: isActive(item.path) ? "1" : "0" }}
          />
          {React.cloneElement(item.icon, {
            style: {
              fill: isActive(item.path) ? "#0ea300" : "#000",
              filter: isActive(item.path) ? "none" : "grayscale(100%)",
            },
          })}
          {item.label}
        </div>
      ))}
    </div>
  );
};
