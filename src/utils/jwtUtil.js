/**
 * JWT 토큰을 디코딩하여 페이로드를 반환하는 함수
 * 
 * @param {string} token - JWT 토큰
 * @returns {object|null} 디코딩된 페이로드 또는 오류 시 null
 */
export const decodeJwtToken = (token) => {
  try {
    if (!token) return null;
    
    // JWT는 header.payload.signature 형식으로 구성됨
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.error('유효하지 않은 JWT 토큰 형식입니다.');
      return null;
    }
    
    // Base64Url 디코딩
    const base64Url = parts[1]; // payload 부분만 사용
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('JWT 토큰 디코딩 중 오류 발생:', error);
    return null;
  }
}; 