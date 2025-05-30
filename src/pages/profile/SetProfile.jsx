import React, { useState, useRef, useEffect } from 'react';
import styles from "./setProfile.module.scss";
import api from '../../api/axiosInstance';
import { 
    FaCamera, 
    FaUser, 
    FaEnvelope, 
    FaPhone, 
    FaBuilding, 
    FaQuoteLeft, 
    FaCode, 
    FaSave, 
    FaSpinner, 
    FaTimes, 
    FaUserCircle 
} from 'react-icons/fa';

export const SetProfile = (props) => {
    const { userInfo = {}, setHandleTogle, handleTogle } = props;
    
    // 서버에 저장된 현재 프로필 이미지 (안전하게 접근)
    const [profileImage, setProfileImage] = useState(userInfo?.Profile?.profile_image || null);
    // 선택한 새 이미지 파일 (임시 저장)
    const [selectedFile, setSelectedFile] = useState(null);
    // 미리보기 이미지 URL
    const [previewImage, setPreviewImage] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    // 사용자 입력 정보 상태 관리 (안전하게 접근)
    const [formData, setFormData] = useState({
        nick_name: userInfo?.Profile?.nick_name || '',
        email: userInfo?.Profile?.email || '',
        phone: userInfo?.Profile?.phone || '',
        company: userInfo?.Profile?.company || '',
        bio: userInfo?.Profile?.bio || '',
        skill: userInfo?.Profile?.skill || []
    });
    // 원래 데이터와 비교해 변경 여부 확인
    const [isChanged, setIsChanged] = useState(false);
    
    const fileInputRef = useRef(null);
    // 이미지 URL 생성 함수
    const [imgError, setImgError] = useState(false);

    // ESC 키를 눌렀을 때 모달 닫기
    useEffect(() => {
        if (!setHandleTogle) return; // setHandleTogle이 없으면 실행하지 않음
        
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setHandleTogle(false);
            }
        };

        // 이벤트 리스너 등록
        window.addEventListener('keydown', handleKeyDown);

        // 컴포넌트가 언마운트될 때 이벤트 리스너 정리
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [setHandleTogle]); // 실제 사용하는 props만 의존성으로 추가

    // 정보 필드 구성 (아이콘 포함)
    const infoFields = [
        { 
            id: 'nick_name', 
            label: "닉네임", 
            value: formData.nick_name, 
            originalValue: userInfo?.Profile?.nick_name || '',
            icon: <FaUser size={16} color="#0ea300" />
        },
        { 
            id: 'email', 
            label: "이메일", 
            value: formData.email, 
            originalValue: userInfo?.Profile?.email || '',
            icon: <FaEnvelope size={16} color="#0ea300" />
        },
        { 
            id: 'phone', 
            label: "전화번호", 
            value: formData.phone, 
            originalValue: userInfo?.Profile?.phone || '',
            icon: <FaPhone size={16} color="#0ea300" />
        },
        { 
            id: 'company', 
            label: "회사", 
            value: formData.company, 
            originalValue: userInfo?.Profile?.company || '',
            icon: <FaBuilding size={16} color="#0ea300" />
        },
        { 
            id: 'bio', 
            label: "자기소개", 
            value: formData.bio, 
            originalValue: userInfo?.Profile?.bio || '',
            icon: <FaQuoteLeft size={16} color="#0ea300" />
        },
        { 
            id: 'skill', 
            label: "기술 태그", 
            value: Array.isArray(formData.skill) ? formData.skill.map(s => s.name).join(', ') : '', 
            originalValue: Array.isArray(userInfo?.Profile?.skill) ? userInfo.Profile.skill.map(s => s.name).join(', ') : '',
            icon: <FaCode size={16} color="#0ea300" />
        },
    ];
    
    const handleImageClick = () => {
        fileInputRef.current?.click();
    };
    
    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            
            // 선택한 파일 저장 (아직 서버에 업로드하지 않음)
            setSelectedFile(file);
            
            // 미리보기 생성
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviewImage(e.target.result);
            };
            reader.readAsDataURL(file);
            
            // 변경 감지
            setIsChanged(true);
        }
    };
    
    // 전화번호 포맷팅 함수
    const formatPhoneNumber = (phoneNumber) => {
        // 숫자만 추출
        const digits = phoneNumber.replace(/\D/g, '');
        
        // 전화번호 길이에 따라 포맷팅
        if (digits.length <= 3) {
            return digits;
        } else if (digits.length <= 7) {
            return digits.slice(0, 3) + '-' + digits.slice(3);
        } else if (digits.length <= 11) {
            // 휴대폰 번호 (010-XXXX-XXXX 형식)
            return digits.slice(0, 3) + '-' + digits.slice(3, 7) + '-' + digits.slice(7, 11);
        }
        
        // 11자리를 초과하면 11자리까지만 사용
        if (digits.length > 11) {
            return digits.slice(0, 3) + '-' + digits.slice(3, 7) + '-' + digits.slice(7, 11);
        }
        
        return phoneNumber;
    };
    
    // 입력 필드 변경 처리
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        // 전화번호인 경우 포맷팅 적용
        if (name === 'phone') {
            const formattedValue = formatPhoneNumber(value);
            
            setFormData(prev => ({
                ...prev,
                [name]: formattedValue
            }));
            
            // 변경 여부 확인 - 비동기 업데이트 문제 해결
            setFormData(prevFormData => {
                const updatedFormData = { ...prevFormData, [name]: formattedValue };
                checkIfChanged(updatedFormData);
                return updatedFormData;
            });
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
            
            // 변경 여부 확인 - 비동기 업데이트 문제 해결
            setFormData(prevFormData => {
                const updatedFormData = { ...prevFormData, [name]: value };
                checkIfChanged(updatedFormData);
                return updatedFormData;
            });
        }
    };
    
    // 변경 여부 검사
    const checkIfChanged = (currentData) => {
        const isDataChanged = 
            currentData.nick_name !== (userInfo?.Profile?.nick_name || '') ||
            currentData.email !== (userInfo?.Profile?.email || '') ||
            currentData.phone !== (userInfo?.Profile?.phone || '') ||
            currentData.company !== (userInfo?.Profile?.company || '') ||
            currentData.bio !== (userInfo?.Profile?.bio || '') ||
            (typeof currentData.skill === 'string' && currentData.skill !== (Array.isArray(userInfo?.Profile?.skill) ? userInfo.Profile.skill.map(s => s.name).join(', ') : ''));
        
        setIsChanged(isDataChanged || selectedFile !== null);
    };

    // 변경 버튼 클릭 시 호출될 함수
    const handleSaveChanges = async () => {
        if (!api) {
            console.error('API 인스턴스가 없습니다.');
            return;
        }
        
        setIsUploading(true);
        
        try {
            // 사용자 ID 확인
            const userId = localStorage.getItem('userId');
            
            if (!userId) {
                console.error('사용자 ID가 없습니다.');
                alert('사용자 ID를 찾을 수 없습니다.');
                setIsUploading(false);
                return;
            }
            
            // 이미지 업로드 처리 (필요한 경우)
            let uploadedImageFileName = null;
            let imageUploadSuccess = false;
            
            if (selectedFile) {
                const formDataFile = new FormData();
                formDataFile.append('profileImage', selectedFile);
                try {
                    const uploadResponse = await api.post(`api/user/upload-profile-image/${userId}`, formDataFile, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    });
                    // 반드시 profileImage 키로 받기
                    if (uploadResponse.data && uploadResponse.data.profileImage) {
                        uploadedImageFileName = uploadResponse.data.profileImage;
                        setProfileImage(uploadedImageFileName);
                        imageUploadSuccess = true;
                    }
                } catch (uploadError) {
                    console.error('이미지 업로드 실패:', uploadError);
                    // 이미지 업로드 실패해도 나머지 정보는 업데이트 계속 진행
                }
            }
            
            // skill 문자열을 객체 배열로 변환
            let skillArray = [];
            if (typeof formData.skill === 'string' && formData.skill.trim() !== '') {
                const skillNames = formData.skill.split(',').map(s => s.trim());
                skillArray = skillNames.map(name => ({ name, color: 'green' })); // 기본 색상은 green으로 설정
            } else if (Array.isArray(formData.skill)) {
                skillArray = formData.skill; // 이미 배열인 경우 그대로 사용
            }
            
            // 프로필 정보 업데이트 데이터 준비 (Profile 데이터로 구성)
            const updateData = {
                Profile: {
                    nick_name: formData.nick_name,
                    email: formData.email,
                    phone: formData.phone,
                    company: formData.company,
                    bio: formData.bio,
                    skill: skillArray
                }
            };
            
            // 업로드한 이미지가 있으면 추가
            if (uploadedImageFileName) {
                // profile/profile/파일명 중복 방지
                if (uploadedImageFileName.startsWith('profile/')) {
                    updateData.Profile.profile_image = uploadedImageFileName;
                } else {
                    updateData.Profile.profile_image = `profile/${uploadedImageFileName}`;
                }
            }
            
            // 프로필 정보 업데이트 요청
            let patchSuccess = false;
            try {
                const updateResponse = await api.patch(`/api/user/updateUser/${userId}`, updateData);
                if (updateResponse.status === 200 || updateResponse.status === 201) {
                    patchSuccess = true;
                }
            } catch (patchError) {
                console.error('프로필 PATCH 실패:', patchError);
                // PATCH 실패여도 아래에서 처리
            }
            
            if (patchSuccess || imageUploadSuccess) {
                alert('프로필이 성공적으로 업데이트되었습니다.');
                setIsChanged(false);
                if (setHandleTogle) {
                    setHandleTogle(false);
                }
                setTimeout(() => {
                    window.location.reload();
                }, 500);
            } else {
                alert('프로필 업데이트에 실패했습니다. 나중에 다시 시도해주세요.');
            }
        } catch (error) {
            console.error('업데이트 실패:', error);
            alert('프로필 업데이트에 실패했습니다. 나중에 다시 시도해주세요.');
        } finally {
            setIsUploading(false);
        }
    };

    // 이미지 URL 생성 함수
    const getImageUrl = () => {
        // 새로 선택한 이미지가 있으면 미리보기 사용
        if (previewImage) {
            return previewImage;
        }
        // 서버에 저장된 기존 이미지가 있으면 해당 이미지 사용
        else if (profileImage) {
            return `${process.env.REACT_APP_BACKEND_HOST}/upload/${profileImage}`;
        }
        return null;
    };

    // 배경 클릭 처리
    const handleBackgroundClick = (e) => {
        // setHandleTogle이 없으면 실행하지 않음
        if (!setHandleTogle) return;
        
        // e.target과 e.currentTarget이 같으면 배경을 클릭한 것
        // (이벤트 전파가 컨텐츠에서 배경으로 올라가는 경우는 제외)
        if (e.target === e.currentTarget) {
            setHandleTogle(!handleTogle);
        }
    };

    // 컨텐츠 클릭 처리 (이벤트 버블링 중지)
    const handleContentClick = (e) => {
        // 이벤트 버블링 중지
        e.stopPropagation();
    };
    
    const handleCloseModal = () => {
        if (setHandleTogle) {
            setHandleTogle(false);
        }
    };

    return (
        <div className={styles.modalBackground} onClick={handleBackgroundClick}>
            <div className={styles.modalContent} onClick={handleContentClick}>
                <button className={styles.closeButton} onClick={handleCloseModal}>
                    <FaTimes size={18} />
                </button>
                <h2 className={styles.modalTitle}>프로필 수정</h2>
                
                <div className={styles.profileHeader}>
                    <div className={styles.profileImageContainer}>
                        <div 
                            className={styles.profileImage} 
                            onClick={handleImageClick}
                            style={getImageUrl() && !imgError ? { backgroundImage: `url(${getImageUrl()})` } : {}}
                        >
                            {(!getImageUrl() || imgError) && (
                                <FaUserCircle size={60} color="#0ea300" className={styles.defaultAvatar} />
                            )}
                            {getImageUrl() && !imgError && (
                                <img
                                    src={getImageUrl()}
                                    alt="프로필"
                                    style={{ display: 'none' }}
                                    onError={() => setImgError(true)}
                                />
                            )}
                            {isUploading ? (
                                <div className={styles.uploadingOverlay}>
                                    <FaSpinner className={styles.spinner} size={24} color="#fff" />
                                </div>
                            ) : (
                                <div className={styles.cameraOverlay}>
                                    <FaCamera size={20} color="#fff" />
                                </div>
                            )}
                        </div>
                        <input 
                            ref={fileInputRef}
                            type="file" 
                            accept="image/*" 
                            onChange={handleImageChange} 
                            style={{ display: 'none' }}
                        />
                    </div>
                </div>

                <div className={styles.profileInfo}>
                    {infoFields.map((field) => (
                        <div key={field.id} className={styles.infoField}>
                            <div className={styles.labelContainer}>
                                <span className={styles.iconWrapper}>{field.icon}</span>
                                <div className={styles.label}>{field.label}</div>
                            </div>
                            <input
                                type="text"
                                name={field.id}
                                className={styles.inputField}
                                value={field.value || ''}
                                placeholder={field.originalValue}
                                onChange={handleInputChange}
                            />
                        </div>
                    ))}
                </div>
                
                {/* 변경 버튼 - 변경사항이 있을 때만 표시 */}
                <div className={styles.buttonContainer}>
                    <button 
                        className={styles.cancelButton}
                        onClick={handleCloseModal}
                    >
                        취소
                    </button>
                    
                    {isChanged && (
                        <button 
                            className={styles.saveButton}
                            onClick={handleSaveChanges}
                            disabled={isUploading}
                        >
                            {isUploading ? (
                                <>
                                    <FaSpinner className={styles.spinner} size={14} />
                                    <span>저장 중...</span>
                                </>
                            ) : (
                                <>
                                    <FaSave size={14} />
                                    <span>변경사항 저장</span>
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SetProfile; 