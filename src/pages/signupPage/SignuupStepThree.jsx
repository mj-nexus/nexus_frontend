import React, { useState } from "react";
import "./Signup.scss";
import { useNavigate } from "react-router-dom";

const SignupStepThree = () => {
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [emailError, setEmailError] = useState("");
  const [codeError, setCodeError] = useState("");
  const navigate = useNavigate()

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  const handleEmailSubmit = () => {
    if (!validateEmail(email)) {
      setEmailError("이메일 형식이 다릅니다");
    } else {
      setEmailError("");
      // 이메일 인증 요청 로직 추가
    }
  };

  const handleCodeSubmit = () => {
    if (verificationCode !== "123456") {
      setCodeError("인증번호가 다릅니다");
    } else {
      setCodeError("");
      // 인증 완료 후 로직 추가
    }
  };

  const goBack = (e) => {
    e.preventDefault();
    navigate('/signup/step2');
  };

  return (
    <div className="signup-wrapper">
      <div className="signup-container">
        <h2 className="signup-title">회원가입</h2>
        <div className="step-progress">
          <div className="step active">1</div>
          <div className="divider"></div>
          <div className="step active">2</div>
          <div className="divider"></div>
          <div className="step active">3</div>
          <div className="divider"></div>
          <div className="step">4</div>
        </div>
        <div className="form-group">
          <label>이메일</label>
          <div className="input-container">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일 입력"
            />
            <button onClick={handleEmailSubmit} className="btn-small">받기</button>
          </div>
          {emailError && <p className="error">{emailError}</p>}
        </div>
        <div className="form-group">
          <label>인증번호</label>
          <div className="input-container">
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="인증번호 입력"
            />
            <button onClick={handleCodeSubmit} className="btn-small">확인</button>
          </div>
          {codeError && <p className="error">{codeError}</p>}
        </div>
        <div className="button-group">
          <button className="btn prev-btn" onClick={goBack}>이전</button>
          <button className="btn next-btn">다음</button>
        </div>
      </div>
    </div>
  );
};

export default SignupStepThree;
