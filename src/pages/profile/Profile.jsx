import React, { useEffect, useState } from "react";
import "./style.scss";
import { getUserInfo } from "../../utils/getUserInfoUtil";
import { useAuth } from "../../context/AuthContext";
import { FaUserCircle } from "react-icons/fa";
import { Info } from "../../components/Info/Info";
import { GrayButton } from "../../components/Button/GrayButton";
import {MyPosts} from "./MyBoard";
import Logout from "../../assets/profile_logout.svg"
import {useNavigate} from "react-router-dom";
import {SetProfile} from "./SetProfile";


const INFO_LIST = ["name", "company", "student_id", "email", "bio", "skill"];

const Avatar = ({ profileImage }) => (
  <div className="avatar">
    {profileImage ? (
      <img
        src={`${process.env.REACT_APP_BACKEND_HOST}/upload/${profileImage}`}
        alt="avatar"
      />
    ) : (
      <FaUserCircle size={50} color="#ccc" />
    )}
  </div>
);

const InfoContainer = ({ userInfo, handleClick }) => {
    const { logout } = useAuth();
    const navigate = useNavigate();
  const handleLogout = () => {
    if (window.confirm('로그아웃 하시겠습니까?')) {
      logout();
      navigate('/login');
    }
  }
    return (
  <div className="info-container">
    <div className="header-wrapper">
      <h1>{userInfo.Profile?.nick_name}</h1>
      <GrayButton lable="Edit Profile" handleClick={handleClick}/>
      <img className="LogOut" src={Logout} alt="logout" onClick={handleLogout}/>
    </div>
    <div className="info-wrapper">
      {INFO_LIST.map((type) => (
        <Info key={type} type={type} userInfo={userInfo} />
      ))}
    </div>
  </div>
);
}

const TabSection = ({ isPostActive, setIsPostActive, isNoticeActive, setIsNoticeActive }) => {
  const handleTabClick = (tab) => {
    if (tab === 'POSTS') {
      setIsPostActive(true);
      setIsNoticeActive(false);
    } else {
      setIsPostActive(false);
      setIsNoticeActive(true);
    }
  };

  return (
      <div className="tab">
        <div className="line"></div>
      <span
          className={isPostActive ? "active" : ""}
          onClick={() => handleTabClick('POSTS')}
      >
        POSTS
      </span>
        <span
            className={isNoticeActive ? "active" : ""}
            onClick={() => handleTabClick('NOTICE')}
        >
        NOTICE
      </span>
        <div className="line"></div>
      </div>
  );
};

const Posts = () => (
  <div className="posts">
    {[1, 2, 3].map((num) => (
      <div key={num} className="post">
        <img src={`/path/to/image${num}.jpg`} alt={`post ${num}`} />
      </div>
    ))}
  </div>
);

export const Profile = () => {
  const [isPostActive, setIsPostActive] = useState(true);
  const [isNoticeActive, setIsNoticeActive] = useState(false);
  const { userId } = useAuth();
  const [userInfo, setUserInfo] = useState(null);
  const [ handleTogle, setHandleTogle ] = useState(false);
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const data = await getUserInfo();
        setUserInfo(data);
      } catch (err) {
        console.error("Error fetching user info:", err);
      }
    };
    fetchUserInfo();
  }, [userId]);

  if (!userInfo) return null;

  const handleClick = () => {
    setHandleTogle(!handleTogle);
  }

  return (
    <div className="profile">
      <div className="profile-header">
        <Avatar profileImage={userInfo.Profile?.profile_image} />
        <InfoContainer userInfo={userInfo} handleClick={handleClick}/>
      </div>
      <TabSection
          isPostActive={isPostActive}
          setIsPostActive={setIsPostActive}
          isNoticeActive={isNoticeActive}
          setIsNoticeActive={setIsNoticeActive}
      />
      {isPostActive && <Posts />}
      {isNoticeActive && <MyPosts />}
      {handleTogle && <SetProfile handleTogle={handleTogle} setHandleTogle={setHandleTogle} userInfo={userInfo}/>}
    </div>
  );
};

export default Profile;
