import React, { useEffect, useState } from "react";
import Notification1 from "../../assets/notiIcon.png";
import nexuslogo1 from "../../assets/NexusLogo1.png";
import "./style.scss";
import { useAuth } from "../../context/AuthContext";
import {getUserInfo} from "../../utils/getUserInfoUtil";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
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

  // 프로필 이미지 URL 생성 함수
  const getProfileImageUrl = () => {
    if (userInfo && userInfo.profile_image) {
      return `${process.env.REACT_APP_BACKEND_HOST}/upload/${userInfo.profile_image}`;
    }
  };

  // 사용자 이름과 닉네임 표시 함수
  const getNickName = () => {
    return userInfo?.nick_name || "사용자";
  };

  const getUserName = () => {
    return userInfo?.user_name || "";
  };

  return (
    <header>
      <div className="logo" onClick={() => navigate('/')}>
        <img className="nexuslogo" src={nexuslogo1} alt="logo" />
      </div>
      <div className="profile_group" onClick={() => navigate('/profile')}>
        <div className="group">
          {(userInfo && userInfo.profile_image) ? 
          (<img
            src={getProfileImageUrl()}
            alt="프로필 이미지"
          />) : (
            <FaUserCircle size={50} color="#ccc" />
          )}
          <div className="text-wrapper">
            <p>{getNickName()}</p>
            <p>{getUserName()}</p>
          </div>
        </div>
        <div className="noti_bg">
          <img src={Notification1} alt="알림 아이콘" />
        </div>
      </div>
    </header>
  );
};