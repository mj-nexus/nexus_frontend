// src/routes/PrivateRoute.jsx
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const token = localStorage.getItem("accessToken");

  // 토큰 없으면 로그인 페이지로 이동
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 토큰 있으면 정상적으로 children 렌더링
  return children;
}
