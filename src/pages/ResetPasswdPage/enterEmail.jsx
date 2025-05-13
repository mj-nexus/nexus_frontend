import React, { useState } from "react";
import NexusLogo from "../../assets/NexusLogo1.png";
import mjcLogo from "../../assets/mjcLogo.png";
import aibigdataLogo from "../../assets/AiBigDataClear.png";
import styles from "./enterEmail.module.scss";

export const ResetPass = () => {
  const [email, setEmail] = useState("");
  const [hasError, setHasError] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setHasError(false);
  };

  const handleSubmit = () => {
    // 이메일 코드 전송 로직 구현
    console.log("이메일 전송:", email);
    if (email.length > 0) {
      setHasError(true);
    }
  };

  const handleGoToLogin = () => {
    // 로그인 페이지로 이동하는 로직
    console.log("로그인으로 돌아가기");
  };

  return (
    <div className={styles.bg}>
      <div className={styles.logo_bg}>
        <img src={NexusLogo} alt="logo" />
        <img src={aibigdataLogo} alt="logo" />
        <img src={mjcLogo} alt="logo" />
      </div>
      <div className={styles.right}>
        <div className={styles.emailContainer}>
          <h3>이메일을 입력해주세요</h3>
          <div className={styles.inputWrapper}>
            <input 
              type="email" 
              value={email} 
              onChange={handleEmailChange} 
              placeholder="이메일을 입력해주세요"
            />
            {hasError && (
              <p className={styles.errorMessage}>이메일을 찾지 못했습니다.</p>
            )}
          </div>
          <button 
            className={styles.sendButton} 
            onClick={handleSubmit}
          >
            받기
          </button>
          <button 
            className={styles.loginButton} 
            onClick={handleGoToLogin}
          >
            로그인으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
};
