import React, { useState, useContext } from 'react';
import './Signup.scss';
import { useNavigate } from 'react-router-dom';
import { SignupContext } from '../../context/SignupContext';

const SignupStepTwo = () => {
  const navigate = useNavigate();
  const { userData, signupMemory } = useContext(SignupContext); // Use context
  const [name, setName] = useState(userData.name);
  const [phone, setPhone] = useState(userData.phone);
  const [company, setCompany] = useState(userData.company);
  const [studentId, setStudentId] = useState(userData.studentId);
  const [password, setPassword] = useState(userData.password);
  const [confirmPassword, setConfirmPassword] = useState(userData.confirmPassword);

  const goBack = (e) => {
    e.preventDefault();
    navigate('/signup');
  };

  const goToNextStep = (e) => {
    e.preventDefault();
  
    if (!name || !studentId || !phone || !password || !confirmPassword) {
      alert('모든 필드를 입력해주세요.');
      return;
    }
  
    if (!/^\d+$/.test(phone)) {
      alert('전화번호는 숫자만 입력해야 합니다.');
      return;
    }
  
    if (password.length < 6) {
      alert('비밀번호는 6자리 이상이어야 합니다.');
      return;
    }
  
    if (password !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
  
    signupMemory({ name, phone, company, studentId, password, confirmPassword });
    navigate('/signup/step3');
  };
  

  return (
    <div className="signup-wrapper">
      <div className="signup-container">
        <h2 className="signup-title">회원가입</h2>

        <div className="step-progress">
          <div className="step active" >1</div>
          <div className="divider active"></div>
          <div className="step active">2</div>
          <div className="divider"></div>
          <div className="step">3</div>
          <div className="divider"></div>
          <div className="step">4</div>
        </div>

        <form className="form-container" onSubmit={goToNextStep}>
          <div className="form-row">
            <input type="text" placeholder="이름" value={name} onChange={(e) => setName(e.target.value)} required />
            <input type="text" placeholder="학번" value={studentId} onChange={(e) => setStudentId(e.target.value)} required />
          </div>
          <div className="form-row">
            <input type="text" placeholder="휴대전화" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            <input type="password" placeholder="비밀번호" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div className="form-row">
            <input type="text" placeholder="회사" value={company} onChange={(e) => setCompany(e.target.value)} />
            <input type="password" placeholder="비밀번호 확인" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          </div>

          <div className="button-group">
            <button className="btn prev-btn" onClick={goBack}>이전</button>
            <button className="btn next-btn" type="submit">다음</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupStepTwo;