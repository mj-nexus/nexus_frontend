import React from 'react';
import name from '../../assets/profileUser.svg';
import company from '../../assets/profileCompany.svg';
import student_id from '../../assets/profileStudentnum.svg';
import email from '../../assets/profileEmail.svg';
import bio from '../../assets/profileEmail.svg';
import phone from '../../assets/profileEmail.svg';
import skill from '../../assets/profileUser.svg';

const INFO_CONFIG = {
    name: { icon: name, label: '이름' },
    user_name: { icon: name, label: '이름' },
    nick_name: { icon: name, label: '닉네임' },
    company: { icon: company, label: '회사' },
    student_id: { icon: student_id, label: '학번' },
    email: { icon: email, label: '이메일' },
    bio: { icon: bio, label: '한마디' },
    skill: { icon: skill, label: '기술' },
    phone: { icon: phone, label: '전화번호' },
};

export const Info = ({ type, userInfo }) => {
    const config = INFO_CONFIG[type] || INFO_CONFIG.user_name;

    const getValue = () => {
        if (type === 'skill') {
            const skills = userInfo?.Profile?.skill;
            if (Array.isArray(skills) && skills.length > 0) {
                return skills.map(item => `#${item.name}`).join(' ');
            }
            return null;
        }
        
        if (type === 'student_id') {
            return userInfo?.student_id;
        }

        // Profile 내부의 필드인 경우
        if (userInfo?.Profile && userInfo.Profile[type] !== undefined) {
            return userInfo.Profile[type];
        }
        
        return null;
    };

    const value = getValue();
    if (!value) return null;

    return (
        <div className={`info ${type}`}>
            <img src={config.icon} alt={config.label} />
            <p>{value}</p>
        </div>
    );
};