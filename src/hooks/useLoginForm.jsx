// src/hooks/useLoginForm.jsx
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { loginRequest } from "../utils/loginUtil";

export function useLoginForm() {
  const { login } = useContext(AuthContext);
  const [student_id, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const { user, accessToken } = await loginRequest(student_id, password);
      login({ user, accessToken });
    } catch (error) {
      console.error("로그인 실패", error);
    }
  };

  const goToSignUp = () => {
    navigate("/signup");
  };

  return {
    student_id,
    password,
    setStudentId,
    setPassword,
    handleLogin,
    goToSignUp,
  };
}
