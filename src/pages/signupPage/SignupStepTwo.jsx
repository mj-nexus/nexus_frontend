import React, { useState } from 'react';
import './Signup.scss';
import { useNavigate } from 'react-router-dom';

const SignupStepTwo = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [studentid, setStudentid] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const goBack = (e) => {
    e.preventDefault();
    navigate('/signup');
  };

  const goToNextStep = (e) => {
    e.preventDefault();
    navigate('/signup/step3')
    
    if (!name || !studentid || !phone || !password || !confirmPassword) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    if (!/^\d+$/.test(phone)) {
      alert('전화번호는 숫자만 입력해야 합니다.');
      return;
    }
    
    if (password !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    
    // 다음 단계로 이동
    navigate('/signup/step3');
  };

  return (
    <div className="signup-wrapper">
      <div className="signup-container">
        <h2 className="signup-title">회원가입</h2>

        <div className="step-progress">
          <div className="step">1</div>
          <div className="divider"></div>
          <div className="step active">2</div>
          <div className="divider"></div>
          <div className="step">3</div>
          <div className="divider"></div>
          <div className="step">4</div>
        </div>

        <form className="form-container" onSubmit={goToNextStep}>
          <div className="form-row">
            <input type="text" placeholder="이름" value={name} onChange={(e) => setName(e.target.value)} required />
            <input type="text" placeholder="학번" value={studentid} onChange={(e) => setStudentid(e.target.value)} required />
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
