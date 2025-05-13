// src/hooks/useLoginForm.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginRequest } from "../utils/loginUtil";

export function useLoginForm() {
  const { login } = useAuth();
  const [student_id, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const { userid, accessToken, name } = await loginRequest(student_id, password);
      login( accessToken, userid, name );
      navigate('/')
    } catch (error) {
      console.error("로그인 실패", error);
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
    goToRestPW
  };
}
