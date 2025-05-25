// src/hooks/useLoginForm.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginRequest } from "../utils/loginUtil";
import { decodeJwtToken } from "../utils/jwtUtil";

export function useLoginForm() {
  const { login } = useAuth();
  const [student_id, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    // 입력값 검증
    if (!student_id.trim()) {
      setLoginError("학번을 입력해주세요.");
      return;
    }

    if (!password) {
      setLoginError("비밀번호를 입력해주세요.");
      return;
    }

    try {
      setIsLoading(true);
      setLoginError("");
      
      const { userid, accessToken, name } = await loginRequest(student_id, password);
      
      // JWT 토큰 디코딩하여 페이로드 확인
      const decodedToken = decodeJwtToken(accessToken);
      
      // 필요한 정보만 추출하여 로그 출력
      if (decodedToken) {
        const { student_id, iat, exp } = decodedToken;
        console.log('JWT 토큰 정보:', { student_id, iat, exp });
        
        // 타임스탬프를 읽기 쉬운 시간으로 변환 (초 단위로 가정)
        if (iat) {
          const iatDate = new Date(iat * 1000);
          console.log('토큰 발급 시간:', iatDate.toLocaleString());
        }
        
        if (exp) {
          const expDate = new Date(exp * 1000);
          console.log('토큰 만료 시간:', expDate.toLocaleString());
          
          // 만료까지 남은 시간 계산 (분 단위)
          const remainingMinutes = Math.round((exp * 1000 - Date.now()) / (60 * 1000));
          console.log(`만료까지 남은 시간: ${remainingMinutes}분`);
        }
      }
      
      login(accessToken, userid, name);
      navigate('/')
    } catch (error) {
      console.error("로그인 실패", error);
      
      // 서버 응답에 따른 적절한 오류 메시지 설정
      if (error.response) {
        // 서버에서 응답을 받았지만 상태 코드가 2xx 범위가 아닌 경우
        if (error.response.status === 401) {
          setLoginError("학번 또는 비밀번호가 일치하지 않습니다.");
        } else if (error.response.status === 404) {
          setLoginError("사용자를 찾을 수 없습니다.");
        } else if (error.response.data && error.response.data.message) {
          setLoginError(error.response.data.message);
        } else {
          setLoginError("로그인 중 오류가 발생했습니다.");
        }
      } else if (error.request) {
        // 요청은 보냈지만 응답을 받지 못한 경우 (서버 연결 문제)
        setLoginError("서버에 연결할 수 없습니다. 네트워크 상태를 확인해주세요.");
      } else {
        // 요청 설정 중 오류가 발생한 경우
        setLoginError("로그인 요청 중 오류가 발생했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const goToSignUp = () => {
    navigate("/signup");
  };

  const goToRestPW = () => {
    navigate("/resetpw");
  }

  return {
    student_id,
    password,
    setStudentId,
    setPassword,
    handleLogin,
    goToSignUp,
    goToRestPW,
    isLoading,
    loginError
  };
}
