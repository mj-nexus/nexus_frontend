import Filter from 'badwords-ko';

// 기본 필터 인스턴스
const filter = new Filter();

/**
 * 텍스트에 비속어가 포함되어 있는지 확인합니다
 * @param {string} text - 검사할 텍스트
 * @returns {boolean} - 비속어 포함 여부
 */
export const hasProfanity = (text) => {
  if (!text || typeof text !== 'string') return false;
  return filter.isProfane(text);
};

/**
 * 텍스트에서 비속어를 검열합니다 (***로 변경)
 * @param {string} text - 검열할 텍스트
 * @returns {string} - 검열된 텍스트
 */
export const censorProfanity = (text) => {
  if (!text || typeof text !== 'string') return text;
  return filter.clean(text);
};

/**
 * 텍스트에 비속어가 포함되어 있는지 확인하고 
 * 비속어가 있다면 에러 메시지를 반환합니다
 * @param {string} text - 검사할 텍스트
 * @returns {object} - { isValid: boolean, errorMessage: string }
 */
export const validateProfanity = (text) => {
  if (!text || typeof text !== 'string') {
    return { isValid: true, errorMessage: '' };
  }
  
  const containsProfanity = filter.isProfane(text);
  
  return {
    isValid: !containsProfanity,
    errorMessage: containsProfanity 
      ? '부적절한 표현이 포함되어 있습니다. 다시 확인해주세요.' 
      : ''
  };
};

/**
 * 사용자 지정 필터 인스턴스 생성
 * @param {object} options - 필터 옵션
 * @returns {object} - 필터 인스턴스
 */
export const createCustomFilter = (options = {}) => {
  return new Filter(options);
};

/**
 * 커스텀 단어 목록을 추가합니다
 * @param {string[]} words - 추가할 비속어 목록
 */
export const addCustomWords = (...words) => {
  filter.addWords(...words);
}; 