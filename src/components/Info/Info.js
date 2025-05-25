import React from 'react';
import { 
    FaUser, 
    FaBuilding, 
    FaIdCard, 
    FaEnvelope, 
    FaQuoteLeft, 
    FaPhone, 
    FaCode,
    FaHashtag
} from 'react-icons/fa';

const INFO_CONFIG = {
    name: { icon: <FaUser size={18} color="#0ea300" />, label: '이름' },
    user_name: { icon: <FaUser size={18} color="#0ea300" />, label: '이름' },
    nick_name: { icon: <FaUser size={18} color="#0ea300" />, label: '닉네임' },
    company: { icon: <FaBuilding size={18} color="#0ea300" />, label: '회사' },
    student_id: { icon: <FaIdCard size={18} color="#0ea300" />, label: '학번' },
    email: { icon: <FaEnvelope size={18} color="#0ea300" />, label: '이메일' },
    bio: { icon: <FaQuoteLeft size={18} color="#0ea300" />, label: '한마디' },
    skill: { icon: <FaCode size={18} color="#0ea300" />, label: '기술' },
    phone: { icon: <FaPhone size={18} color="#0ea300" />, label: '전화번호' },
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

        // 전화번호 포맷팅 (하이픈 추가)
        if (type === 'phone') {
            const phoneNumber = userInfo?.Profile?.phone;
            if (!phoneNumber) return null;
            
            // 숫자만 추출
            const digits = phoneNumber.replace(/\D/g, '');
            
            // 전화번호 길이에 따라 포맷팅
            if (digits.length === 11) {
                // 휴대폰 번호 (010-XXXX-XXXX 형식)
                return digits.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
            } else if (digits.length === 10) {
                // 일부 지역번호 또는 휴대폰 번호 (02-XXXX-XXXX 형식)
                if (digits.startsWith('02')) {
                    return digits.replace(/(\d{2})(\d{4})(\d{4})/, '$1-$2-$3');
                }
                // 그 외 지역번호나 휴대폰 (XXX-XXX-XXXX 형식)
                return digits.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
            } else if (digits.length === 8) {
                // 지역번호 없는 전화번호 (XXXX-XXXX 형식)
                return digits.replace(/(\d{4})(\d{4})/, '$1-$2');
            }
            
            // 기타 형식은 그대로 반환
            return phoneNumber;
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
            <span className="icon-container">{config.icon}</span>
            <p>{value}</p>
        </div>
    );
};