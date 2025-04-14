import React from 'react';
import name from '../../assets/profileUser.svg';
import company from '../../assets/profileCompany.svg';
import student_id from '../../assets/profileStudentnum.svg';
import email from '../../assets/profileEmail.svg';
import bio from '../../assets/profileEmail.svg';
import skill from '../../assets/profileUser.svg';

const INFO_CONFIG = {
    name: { icon: name, label: '이름' },
    company: { icon: company, label: '회사' },
    student_id: { icon: student_id, label: '학번' },
    email: { icon: email, label: '이메일' },
    bio: { icon: bio, label: '한마디' },
    skill: { icon: skill, label: '소개' }
};

export const Info = ({ type, userInfo }) => {
    const config = INFO_CONFIG[type];

    const getValue = () => {
        if (type === 'skill' && Array.isArray(userInfo[type])) {
            return userInfo[type].map(skill => `#${skill}`).join(' ');
        }
        if (type === 'bio') {
            return userInfo.Profile?.bio;
        }
        return userInfo[type];
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