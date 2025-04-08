import React, { useEffect, useState } from "react";
import Notification1 from "../../assets/notiIcon.png";
import nexuslogo1 from "../../assets/NexusLogo1.png";
import "./style.scss";
import { useProfile } from "../../hooks/useProfile";
import { headerinfoUtil } from "../../utils/headerinfoUtil";

export const Header = () => {
  const { user } = useProfile();
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (user && user.user_id) {
        try {
          const data = await headerinfoUtil(user.user_id);
          setUserInfo(data);
        } catch (err) {
          console.error("Error fetching user info:", err);
        }
      }
    };

    fetchUserInfo();
  }, [user]);

  if (!userInfo) {
    return null; // Or render a loading indicator
  }

  return (
    <header>
      <div className="logo">
        <img className="nexuslogo" src={nexuslogo1} alt="logo" />
      </div>
      <div className="profile_group">
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