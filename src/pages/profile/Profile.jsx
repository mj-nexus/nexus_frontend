import React, { useEffect, useState } from "react";
import "./style.scss";
import { getUserInfo } from "../../utils/getUserInfoUtil";
import { useAuth } from "../../context/AuthContext";
import { 
  FaUserCircle, 
  FaSignOutAlt, 
  FaPencilAlt, 
  FaSpinner, 
  FaCamera
} from "react-icons/fa";
import { Info } from "../../components/Info/Info";
import { GrayButton } from "../../components/Button/GrayButton";
import { MyBoard } from "./MyBoard";
import { useNavigate } from "react-router-dom";
import { SetProfile } from "./SetProfile";

const INFO_LIST = ["user_name", "company", "student_id", "email", "bio", "skill", "phone"];

const Avatar = ({ profileImage }) => {
  const [imgError, setImgError] = React.useState(false);
  const [hover, setHover] = React.useState(false);
  const [imgLoading, setImgLoading] = React.useState(!!profileImage);
  return (
    <div
      className="avatar"
      style={{
        width: 140,
        height: 140,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #e6f9e6 60%, #c6f7d0 100%)',
        boxShadow: '0 2px 12px rgba(14,163,0,0.10)',
        border: '4px solid #fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'transform 0.3s',
        transform: hover ? 'scale(1.04)' : 'none',
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {profileImage && !imgError ? (
        <>
          <img
            src={`${process.env.REACT_APP_BACKEND_HOST}/upload/${profileImage}`}
            alt="avatar"
            onError={() => setImgError(true)}
            onLoad={() => setImgLoading(false)}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              objectFit: 'cover',
              opacity: imgLoading ? 0 : 1,
              transition: 'opacity 0.2s',
              position: 'absolute',
              top: 0, left: 0
            }}
          />
          {imgLoading && (
            <FaSpinner className="spinning" size={40} color="#0ea300" style={{ position: 'absolute' }} />
          )}
        </>
      ) : (
        <FaUserCircle size={80} color="#0ea300" style={{ background: '#fff', borderRadius: '50%' }} />
      )}
      <div
        className="avatar-overlay"
        style={{
          position: 'absolute',
          top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity: hover ? 1 : 0, transition: 'opacity 0.3s',
        }}
      >
        <FaCamera size={24} color="#fff" />
      </div>
    </div>
  );
};

const InfoContainer = ({ userInfo, handleClick }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    if (window.confirm('로그아웃 하시겠습니까?')) {
      try {
        await logout();
        navigate('/login');
      } catch (error) {
        console.error('로그아웃 처리 중 오류 발생:', error);
        alert('로그아웃 처리 중 오류가 발생했습니다.');
      }
    }
  }
  
  return (
    <div className="info-container">
      <div className="header-wrapper">
        <h1>{userInfo.Profile?.nick_name || userInfo.Profile?.user_name}</h1>
        <button className="edit-profile-btn" onClick={handleClick} style={{
          background: '#f8faf8',
          border: 'none',
          borderRadius: 8,
          padding: '8px 16px',
          marginRight: 8,
          fontWeight: 500,
          boxShadow: '0 2px 8px rgba(14,163,0,0.04)',
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}>
          <FaPencilAlt size={14} />
          <span style={{ marginLeft: 6 }}>Edit Profile</span>
        </button>
        <button className="logout-btn" onClick={handleLogout} style={{
          background: '#f8faf8',
          border: 'none',
          borderRadius: 8,
          padding: '8px 16px',
          fontWeight: 500,
          boxShadow: '0 2px 8px rgba(14,163,0,0.04)',
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}>
          <FaSignOutAlt size={18} color="#888" />
        </button>
      </div>
      <div className="info-wrapper">
        {INFO_LIST.map((type) => (
          <Info key={type} type={type} userInfo={userInfo} />
        ))}
      </div>
    </div>
  );
}

export const Profile = () => {
  const { userId } = useAuth();
  const [userInfo, setUserInfo] = useState(null);
  const [handleTogle, setHandleTogle] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setLoading(true);
        const data = await getUserInfo();
        setUserInfo(data);
      } catch (err) {
        console.error("Error fetching user info:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserInfo();
  }, [userId]);

  if (loading) return (
    <div className="profile-loading">
      <FaSpinner className="spinning" size={40} color="#0ea300" />
      <p>프로필 정보를 불러오는 중...</p>
    </div>
  );

  if (!userInfo) return (
    <div className="profile-error">
      <p>프로필 정보를 불러올 수 없습니다.</p>
    </div>
  );

  const handleClick = () => {
    setHandleTogle(!handleTogle);
  }

  return (
    <div className="profile">
      <div className="profile-header">
        <Avatar profileImage={userInfo.Profile?.profile_image} />
        <InfoContainer userInfo={userInfo} handleClick={handleClick} />
      </div>
      <div style={{ marginTop: 32 }}>
        <MyBoard />
      </div>
      {handleTogle && <SetProfile handleTogle={handleTogle} setHandleTogle={setHandleTogle} userInfo={userInfo} />}
    </div>
  );
};

export default Profile;
