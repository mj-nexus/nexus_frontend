import React from "react";
import { useLoginForm } from "../../hooks/useLoginForm";
import NexusLogo from "../../assets/NexusLogo1.png";
import mjcLogo from "../../assets/mjcLogo.png";
import aibigdataLogo from "../../assets/AiBigDataClear.png";
import Toggle from "../../components/Toggle/Toggle";
import BigButton from "../../components/Button/BigButton";
import "./style.scss";

const Input = ({ label, value, onChange, error }) => (
  <div className="input_box">
    <p>{label}</p>
    <input
      type={label === "비밀번호" ? "password" : "text"}
      value={value}
      onChange={onChange}
      className={error ? "error-input" : ""}
    />
  </div>
);

export const Login = () => {
  const {
    student_id,
    password,
    setStudentId,
    setPassword,
    handleLogin,
    goToSignUp,
    goToRestPW,
    isLoading,
    loginError
  } = useLoginForm();

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
          <Input 
            label="학번" 
            value={student_id} 
            onChange={(e) => setStudentId(e.target.value)} 
            error={loginError}
          />
          <Input 
            label="비밀번호" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            error={loginError}
          />
          
          {loginError && (
            <div className="error-message">
              {loginError}
            </div>
          )}
          
          <div className="middle">
            <div className="keep_container">
              <Toggle />
              <p>로그인 유지하기</p>
            </div>
            <p className="link" onClick={goToRestPW}>비밀번호 찾기</p>
          </div>
          <BigButton 
            onClick={handleLogin} 
            label={isLoading ? "로그인 중..." : "로그인"} 
            width="360px" 
            height="40px" 
            fontSize="15px"
            disabled={isLoading}
          />
          <div className="line"></div>
          <p className="link" onClick={goToSignUp}>회원가입</p>

          <img className="mjc_mobile_logo" src={mjcLogo} alt="mjc logo" />
        </div>
      </div>
    </div>
  );
};
