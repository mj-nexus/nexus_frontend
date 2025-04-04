import React, { useState, useEffect, useContext } from "react";
import "./Signup.scss";
import { useNavigate } from "react-router-dom";
import { emailSent } from "../../utils/emailUtil";
import { verifyCode } from "../../utils/verifycodeUtil";
import { validateEmail } from "../../utils/validateEmail";
import { SignupContext } from "../../context/SignupContext";

const SignupStepThree = () => {
  const [verificationCode, setVerificationCode] = useState("");
  const [emailError, setEmailError] = useState("");
  const [codeError, setCodeError] = useState("");
  const [timer, setTimer] = useState(0);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [verified, setVerified] = useState(false);
  const navigate = useNavigate();
  const { userData, signupMemory } = useContext(SignupContext);
  const [email, setEmail] = useState(userData.email || "");

  const handleEmailSubmit = () => {
    if (!validateEmail(email)) {
      setEmailError("이메일 형식이 다릅니다");
    } else {
      setEmailError("");
      try {
        emailSent(email);
        setIsButtonDisabled(true);
        setTimer(300); // 5 minutes in seconds
      } catch (err) {
        console.log("Error sending email verification", err);
        setEmailError("인증 이메일 전송 중 오류가 발생했습니다.");
      }
    }
  };

  useEffect(() => {
    let countdown;
    if (timer > 0) {
      countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      clearInterval(countdown);
      setIsButtonDisabled(false);
    }
    return () => clearInterval(countdown);
  }, [timer]);

  const goBack = (e) => {
    e.preventDefault();
    navigate('/signup/step2');
  };

  const handleCodeSubmit = () => {
    if (verifyCode(email, verificationCode)) {
      signupMemory({ ...userData, email });
      setVerified(true);
    } else {
      setCodeError("인증번호가 일치하지 않습니다.");
    }
  };

  const goToNextStep = (e) => {
    e.preventDefault();
    navigate('/signup/step4');
  };

  return (
    <div className="signup-wrapper">
      <div className="signup-container">
        <h2 className="signup-title">회원가입</h2>
        <div className="step-progress">
          <div className="step active">1</div>
          <div className="divider active"></div>
          <div className="step active">2</div>
          <div className="divider active"></div>
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
              disabled={verified}
            />
            {!verified && (
              <button onClick={handleEmailSubmit} className="btn-small" disabled={isButtonDisabled}>
                {isButtonDisabled ? `다시 받기 (${Math.floor(timer / 60)}:${('0' + (timer % 60)).slice(-2)})` : "받기"}
              </button>
            )}
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
              disabled={verified}
            />
            {!verified && <button onClick={handleCodeSubmit} className="btn-small">확인</button>}
          </div>
          {codeError && <p className="error">{codeError}</p>}
          {verified && <p className="success">인증 성공!</p>}
        </div>
        <div className="button-group">
          <button className="btn prev-btn" onClick={goBack}>이전</button>
          <button className="btn next-btn" disabled={!verified} onClick={goToNextStep}>다음</button>
        </div>
      </div>
    </div>
  );
};

export default SignupStepThree;