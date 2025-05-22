import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../profile/style.scss";
import { FaUserCircle } from "react-icons/fa";
import { Info } from "../../components/Info/Info";
import api from "../../api/axiosInstance";

const INFO_LIST = ["user_name", "company", "student_id", "email", "bio", "skill", "phone"];

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

const InfoContainer = ({ userInfo }) => {
  return (
    <div className="info-container">
      <div className="header-wrapper">
        <h1>{userInfo.Profile?.nick_name || userInfo.Profile?.user_name}</h1>
      </div>
      <div className="info-wrapper">
        {INFO_LIST.map((type) => (
          <Info key={type} type={type} userInfo={userInfo} />
        ))}
      </div>
    </div>
  );
}

export const UserProfile = () => {
  const { userId } = useParams();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/user/getUserById/${userId}`);
        setUserInfo(response.data);
        setError(null);
      } catch (err) {
        console.error("사용자 정보를 불러오는 중 오류 발생:", err);
        setError("사용자 정보를 불러올 수 없습니다.");
      } finally {
        setLoading(false);
      }
    };
    
    if (userId) {
      fetchUserInfo();
    }
  }, [userId]);

  if (loading) return <div className="profile-loading">로딩 중...</div>;
  if (error) return <div className="profile-error">{error}</div>;
  if (!userInfo) return <div className="profile-error">사용자 정보를 찾을 수 없습니다.</div>;

  return (
    <div className="profile">
      <div className="profile-header">
        <Avatar profileImage={userInfo.Profile?.profile_image} />
        <InfoContainer userInfo={userInfo} />
      </div>
    </div>
  );
};

export default UserProfile; 