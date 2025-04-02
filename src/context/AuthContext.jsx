import React, { createContext, useState } from 'react';

// AuthContext 생성
export const AuthContext = createContext();

// AuthProvider 컴포넌트
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // 사용자 상태 초기화

    const login = (userData) => {
        setUser(userData); // 사용자 로그인
    };

    const logout = () => {
        setUser(null); // 사용자 로그아웃
    };

    const value = {
        user, // user 상태 포함 확인
        login,
        logout,
      };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
