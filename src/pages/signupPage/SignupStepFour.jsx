import React, { useState, useContext } from 'react';
import './Signup.scss';
import { useNavigate } from 'react-router-dom';
import { SignupContext } from '../../context/SignupContext';
import { signupSubmit } from '../../utils/signupUtil';
import { FaSpinner } from 'react-icons/fa';

const skillsList = [
  { name: 'FullStack', color: 'red' },
  { name: 'FrontEnd', color: 'green' },
  { name: 'BackEnd', color: 'brown' },
  { name: 'DataBase', color: 'blue' },
  { name: 'Network', color: 'goldenrod' },
  { name: 'Design', color: 'orange' },
  { name: 'Security', color: 'lightblue' },
  { name: 'AI', color: 'pink' },
  { name: 'Arduino', color: 'purple' },
];

export const SkillSelector = () => {
  const { userData, signupMemory, clearMemory } = useContext(SignupContext);
  const [selectedSkills, setSelectedSkills] = useState(userData.skill || []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signupError, setSignupError] = useState('');
  const navigate = useNavigate();

  const handleSkillClick = (skill) => {
    const isSelected = selectedSkills.some(s => s.name === skill.name);
    const updatedSkills = isSelected
      ? selectedSkills.filter(s => s.name !== skill.name)
      : selectedSkills.length < 3
        ? [...selectedSkills, skill]
        : selectedSkills;

    setSelectedSkills(updatedSkills);
    signupMemory({ ...userData, skill: updatedSkills });
  };

  const submit = async () => {
    setIsSubmitting(true);
    setSignupError('');
    
    try {
      const res = await signupSubmit(userData);
      if (res && res.message === "회원가입 성공") {
        alert("회원가입이 완료되었습니다!");
        clearMemory();
        navigate("/login");
      } else {
        setSignupError('회원가입 처리 중 오류가 발생했습니다.');
      }
    } catch (err) {
      console.error('회원가입 오류:', err);
      
      // 서버 응답에 따른 적절한 오류 메시지 설정
      if (err.response) {
        if (err.response.status === 409) {
          setSignupError("이미 등록된 학번입니다.");
        } else if (err.response.data && err.response.data.message) {
          setSignupError(err.response.data.message);
        } else {
          setSignupError("회원가입 중 오류가 발생했습니다.");
        }
      } else if (err.request) {
        setSignupError("서버에 연결할 수 없습니다. 네트워크 상태를 확인해주세요.");
      } else {
        setSignupError("회원가입 요청 중 오류가 발생했습니다.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="signup-wrapper">
      <div className="signup-container">
        <h3 className="signup-title">회원가입</h3>
        <div className="step-progress">
          {[1, 2, 3, 4].map((step) => (
            <React.Fragment key={step}>
              <span className="step completed">{step}</span>
              {step < 4 && <span className="divider"></span>}
            </React.Fragment>
          ))}
        </div>
        <div className="skill-selector">
          <div className="selected-skills">
            {Array.from({ length: 3 }, (_, index) => (
              <div key={index} className="selected-skill" style={{ borderColor: selectedSkills[index]?.color }}>
                {selectedSkills[index]?.name || ''}
              </div>
            ))}
          </div>
          <div className="skills-list">
            {skillsList.map((skill) => (
              <div
                key={skill.name}
                className={`skill-item ${selectedSkills.some(s => s.name === skill.name) ? 'selected' : ''}`}
                style={{ borderColor: skill.color, color: skill.color }}
                onClick={() => handleSkillClick(skill)}
              >
                <span className="dot" style={{ backgroundColor: skill.color }}></span>
                {skill.name}
              </div>
            ))}
          </div>
        </div>
        
        {signupError && (
          <div className="error-message">
            {signupError}
          </div>
        )}
        
        <div className="button-group">
          <button 
            className="btn prev-btn" 
            onClick={() => navigate('/signup/step3')}
            disabled={isSubmitting}
          >
            이전
          </button>
          <button 
            className="btn submit-btn" 
            onClick={submit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <FaSpinner className="spinner" />
                제출 중...
              </>
            ) : "제출"}
          </button>
        </div>
      </div>
    </div>
  );
};