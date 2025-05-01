import React, { useState, useContext } from 'react';
import './Signup.scss';
import { useNavigate } from 'react-router-dom';
import { SignupContext } from '../../context/SignupContext';
import { signupSubmit } from '../../utils/signupUtil';

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
    console.log(userData)
    try {
      const res = await signupSubmit(userData);
      if (res && res.message === "회원가입 성공") {
        alert("회원가입이 완료되었습니다!");
        clearMemory();
        navigate("/");
      }
    } catch (err) {
      alert("회원가입 실패: " + (err.response?.data?.message || err.message));
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
        <div className="button-group">
          <button className="btn prev-btn" onClick={() => navigate('/signup/step3')}>이전</button>
          <button className="btn submit-btn" onClick={submit}>제출</button>
        </div>
      </div>
    </div>
  );
};