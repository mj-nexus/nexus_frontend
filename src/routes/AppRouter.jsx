// src/routes/AppRouter.js
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { Login } from "../pages/loginPage/Login";
import { Home } from "../pages/Home/Home";
import { useAuth } from "../context/AuthContext";
import { SignUpStep1, SignUpStep2, SignUpStep3, SignUpStep4 } from "../pages/signupPage";

import MainLayout from "../layouts/MainLayout";
import { Profile } from "../pages/profile/Profile";

// 게시판 관련 컴포넌트 import
import { StudentBoard } from "../pages/BoardPage/StudentBoard";
import { BoardWrite } from "../pages/BoardPage/BoardWrite";
import { BoardDetail } from "../pages/BoardPage/BoardDetail";
import { BoardEdit } from "../pages/BoardPage/BoardEdit";
import { BoardLayout } from "../layouts/Board/BoardLayout";

// 메시지 관련 컴포넌트
import { Message } from "../pages/Message/Message";

export const AppRouter = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return null;

  return (
      <Router>
        <Routes>
          {/* 로그인/회원가입 라우트 */}
          <Route
              path="/login"
              element={isAuthenticated ? <Navigate to="/" /> : <Login />}
          />
          <Route path="/signup" element={<SignUpStep1 />} />
          <Route path="/signup/step2" element={<SignUpStep2 />} />
          <Route path="/signup/step3" element={<SignUpStep3 />} />
          <Route path="/signup/step4" element={<SignUpStep4 />} />

          {/* MainLayout으로 감싸진 인증된 사용자 전용 라우트 */}
          <Route
              path="/"
              element={
                isAuthenticated ? <MainLayout /> : <Navigate to="/login" />
              }
          >
            <Route index element={<Home />} />

            {/* 게시판 관련 라우트 */}
            <Route path="board">
              <Route index element={<BoardLayout />} /> {/* 게시글 목록 */}
              <Route path="write" element={<BoardWrite />} /> {/* 게시글 작성 */}
              <Route path=":id" element={<BoardDetail />} /> {/* 게시글 상세 */}
              <Route path=":id/edit" element={<BoardEdit />} /> {/* 게시글 수정 */}
            </Route>
            {/* 메시지 관련 라우트 */}
            <Route path="message" element={<Message />} />

            {/* 프로필 관련 라우트 */}
            <Route path="profile">
              <Route index element={<Profile />} />
              <Route path="posts" element={<StudentBoard showWriteButton={false} />} /> {/* 내가 쓴 글 목록 */}
            </Route>
          </Route>


          {/* 잘못된 경로 접근 시 */}
          <Route
              path="*"
              element={<Navigate to={isAuthenticated ? "/" : "/login"} />}
          />
        </Routes>
      </Router>
  );
};