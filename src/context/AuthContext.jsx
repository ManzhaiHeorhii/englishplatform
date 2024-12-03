// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({ token: null, role: null, id: null });
    const [loading, setLoading] = useState(true); // Додаємо стан завантаження

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decodedToken = JSON.parse(atob(token.split(".")[1]));
                setAuth({ token, role: decodedToken.role, username: decodedToken.username, id: decodedToken.id});
            } catch (error) {
                console.error("Invalid token");
                localStorage.removeItem("token");
            }
        }
        setLoading(false); // Завантаження завершено
    }, []);

    const login = (token) => {
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        setAuth({ token, role: decodedToken.role, username:decodedToken.username, id: decodedToken.id });
        localStorage.setItem("token", token);
    };

    const logout = () => {
        setAuth({ token: null, role: null, id: null, username: null });
        localStorage.removeItem("token");
    };

    return (
        <AuthContext.Provider value={{ auth, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
