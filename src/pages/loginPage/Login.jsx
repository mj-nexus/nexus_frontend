import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { loginRequest } from "../../utils/loginUtil";
import NexusLogo from "../../assets/NexusLogo1.png";
import mjcLogo from "../../assets/mjcLogo.png";
import aibigdataLogo from "../../assets/AiBigDataClear.png";
import Toggle from "../../components/Toggle/Toggle";
import BigButton from "../../components/Button/BigButton";
import "./style.scss";
import { useNavigate } from "react-router-dom";

const Input = ({ label, value, onChange }) => {
  return (
    <div className="input_box">
      <p>{label}</p>
      <input
        type={label === "비밀번호" ? "password" : "text"}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export const Login = () => {
  const { login } = useContext(AuthContext);
  const [student_id, setStudentId] = useState(""); // 학번 상태
  const [password, setPassword] = useState(""); // 비밀번호 상태
  const navigate = useNavigate();
  const signUp = () => {
    navigate('/signup')
  }

  const handleLogin = async () => {
    try {
      const { user, accessToken } = await loginRequest(student_id, password);
      const userData = { user, accessToken };
      login(userData);

    } catch (error) {
      console.error("Error:", error);
      // 에러 처리 (예: 사용자에게 에러 메시지 표시)
    }
  };

  return (
    <div className="bg">
      <div className="logo_bg">
        <img src={NexusLogo} alt="logo" />
        <img src={aibigdataLogo} alt="logo" />
        <img src={mjcLogo} alt="logo" />
      </div>
      <div className="right">
        <div className="auth_bg">
          <p>학번과 비밀번호를 입력해주세요.</p>
          <Input label="학번" value={student_id} onChange={(e) => setStudentId(e.target.value)} />
          <Input label="비밀번호" value={password} onChange={(e) => setPassword(e.target.value)} />
          <div className="middle">
            <div className="keep_container">
              <Toggle />
              <p>로그인 유지하기</p>
            </div>
            <p className="link">비밀번호 찾기</p>
          </div>
          <BigButton onClick={handleLogin} label="로그인" width="360px" height="40px" fontSize="15px" />
          <div className="line"></div>
          <p className="link" onClick={signUp}>회원가입</p>
        </div>
      </div>
    </div>
  );
};
