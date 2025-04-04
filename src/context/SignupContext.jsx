import React, { createContext, useState } from "react";

export const SignupContext = createContext();

export const SignupProvider = ({ children }) => {
    const [userData, setUserData] = useState({
        name: '',
        phone: '',
        company: '',
        studentId: '',
        password: '',
        confirmPassword: '',
        email: '',
        skill: []
    });

    const signupMemory = (data) => {
        setUserData(data);
    }

    const clearMemory = () => {
        setUserData({
            name: '',
            phone: '',
            company: '',
            studentId: '',
            password: '',
            confirmPassword: '',
            email: '',
            skill:[]
        });
    }

    const value = {
        userData,
        signupMemory,
        clearMemory
    };

    return (
        <SignupContext.Provider value={value}>
            {children}
        </SignupContext.Provider>
    );
};