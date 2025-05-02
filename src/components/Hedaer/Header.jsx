import React, { useEffect, useState } from "react";
import Notification1 from "../../assets/notiIcon.png";
import nexuslogo1 from "../../assets/NexusLogo1.png";
import "./style.scss";
import { useAuth } from "../../context/AuthContext";
import {getUserInfo} from "../../utils/getUserInfoUtil";
import { useNavigate } from "react-router-dom";

export const Header = () => {
  const { userId } = useAuth();
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
        try {
          const data = await getUserInfo();
          setUserInfo(data.Profile);
        } catch (err) {
          console.error("Error fetching user info:", err);
        }
      
    };

    fetchUserInfo();
  }, [userId]);

  if (!userInfo) {
    return null; // Or render a loading indicator
  }

  return (
    <header>
      <div className="logo" onClick={() => navigate('/')}>
        <img className="nexuslogo" src={nexuslogo1} alt="logo" />
      </div>
      <div className="profile_group" onClick={() => navigate('/profile')}>
        <div className="group">
          <img
            src={`${process.env.REACT_APP_BACKEND_HOST}/upload/${userInfo.profile_image}`}
            alt="프로필 이미지"
          />
          <div className="text-wrapper">
            <p>{userInfo.nick_name}</p>
            <p>{userInfo.user_name}</p>
          </div>
        </div>
        <div className="noti_bg">
          <img src={Notification1} alt="알림 아이콘" />
        </div>
      </div>
    </header>
  );
};