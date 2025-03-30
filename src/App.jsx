import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Login } from './pages/loginPage/Login';
import { Header } from './components/Hedaer/Header';
import { Sidebar } from './components/SideBar/Side';
import { Home } from './pages/Home/Home';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // 여기에서 로그인 상태를 확인하는 로직을 구현합니다.
    const loggedInStatus = localStorage.getItem('isLoggedIn') === 'true'; // 예시
    setIsLoggedIn(loggedInStatus);
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={
            isLoggedIn ? <Navigate to="/" /> : <Login onLogin={() => setIsLoggedIn(true)} />
          } />
          <Route path="/" element={
            isLoggedIn ? (
              <>
                <Header />
                <Sidebar />
                <Home />
              </>
            ) : (
              <Navigate to="/login" />
            )
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;