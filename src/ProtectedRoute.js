// src/ProtectedRoute.jsx
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { auth, loading } = useContext(AuthContext);

    if (loading) {
        return <div>Loading...</div>; // Показуємо завантаження поки триває перевірка
    }

    if (!auth.token) {
        return <Navigate to="/login" />;
    }

    if (!allowedRoles.includes(auth.role)) {
        return <Navigate to="/login" />;
    }

    return children;
};

export default ProtectedRoute;
