// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AuthProvider from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./ProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import "./App.css"
import TeacherDashboard from "./pages/TeacherDashboard";

function App() {
    return (
        <AuthProvider className="auth">
            <Router>
                <Routes>
                    {/* Сторінка авторизації */}
                    <Route path="/login" element={<LoginPage />} />

                    {/* Захищені маршрути */}
                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute allowedRoles={["admin"]}>
                                <AdminDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/teacher"
                        element={
                            <ProtectedRoute allowedRoles={["teacher"]}>
                                <TeacherDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/student"
                        element={
                            <ProtectedRoute allowedRoles={["student"]}>
                                <StudentDashboard />
                            </ProtectedRoute>
                        }
                    />

                    {/* Маршрут за замовчуванням */}
                    <Route path="*" element={

                        <Navigate to="/login" />
                    } />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
