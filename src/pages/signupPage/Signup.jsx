import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Signup.scss';

const Signup = () => {
  const [agree, setAgree] = useState(false);
  const navigate = useNavigate();

  const goBack = () => {
    navigate('/');
  };

  const goToStepTwo = () => {
    navigate('/signup/step2');
  };

  return (
    <div className="signup-wrapper">
      <div className="signup-container">
        <h2 className="signup-title">회원가입</h2>

        <div className="step-progress">
          <div className="step active">1</div>
          <div className="divider"></div>
          <div className="step">2</div>
          <div className="divider"></div>
          <div className="step">3</div>
          <div className="divider"></div>
          <div className="step">4</div>
        </div>

        <div className="terms-agreement">
          <h3>약관 동의 및 개인정보수집∙이용 동의</h3>
          <div className="terms-box">
            <p className="terms-content">
              <strong>개인정보보호방침</strong><br/><br/>
              개인정보 수집 및 이용에 대한 동의<br/>
              &lt;조기취업형 계약학과 취업관리시스템&gt;은 개인정보를 다음의 목적을 위해 처리합니다. 처리한 개인정보는 다음의 목적 이외의 용도로는 사용되지 않으며 이용 목적이 변경될 시에는 사전 동의를 구할 예정입니다.<br/><br/>

              • 개인정보 수집항목<br/>
              - 필수사항 : 이름, 학번, 회사명, 생년월일, 휴대폰<br/>
              • 개인정보 수집 및 이용 목적<br/>
              - 조기취업형 계약학과에 따른 서비스 이용 편의 제공<br/>
              • 개인정보의 보유 및 이용 기간<br/>
              - 회원 정보는 3년간<br/>
              - 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체 없이 해당 개인정보를 파기합니다.<br/>
              • 개인정보의 수집 및 이용 동의 거부 시 통합회원 서비스에 제한이 있을 수 있습니다.
            </p>
          </div>

          <div className="agree-checkbox">
            <input 
              type="checkbox" 
              id="agree" 
              checked={agree} 
              onChange={() => setAgree(!agree)} 
            />
            <label htmlFor="agree">개인정보 수집 및 이용에 동의합니다.</label>
          </div>
        </div>

        <div className="button-group">
          <button className="btn prev-btn" onClick={goBack}>이전</button>
          <button className="btn next-btn" disabled={!agree} onClick={goToStepTwo}>
            다음
          </button>
        </div>
      </div>
    </div>
  );
}

export default Signup;