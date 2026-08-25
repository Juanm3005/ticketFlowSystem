import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';
import AdminPage from './pages/AdminPage';
import TechnicianPage from './pages/TechnicianPage';
import EmployeePage from './pages/EmployeePage';

import { useState, useEffect } from "react";
import { getCurrentUser } from "./services/api"; // función nueva, ver abajo

function App() {
    const [user, setUser] = useState(null);
    const [checkingSession, setCheckingSession] = useState(true);

    useEffect(() => {
        const restoreSession = async () => {
            const authHeader = localStorage.getItem("authHeader");

            if (!authHeader) {
                setCheckingSession(false);
                return;
            }

            try {
                const currentUser = await getCurrentUser();
                setUser(currentUser);
            } catch (error) {
                // el authHeader guardado ya no es válido (contraseña cambiada, etc.)
                localStorage.removeItem("authHeader");
            } finally {
                setCheckingSession(false);
            }
        };

        restoreSession();
    }, []);

     if (checkingSession) {
        return <div>Loading...</div>; // o un spinner
    }
    
    function handleLoginSuccess(loggedInUser) {
        setUser(loggedInUser);
    }

    function homeRouteForRole(role) {
        if (role === 'ADMIN') return '/admin';
        if (role === 'TECHNICIAN') return '/technician';
        return '/employee';
    }

    return (
        <Routes>
            <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
            <Route path="/register" element={<Register />} />

            <Route
                path="/admin"
                element={
                    <ProtectedRoute user={user} allowedRoles={['ADMIN']}>
                        <AdminPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/technician"
                element={
                    <ProtectedRoute user={user} allowedRoles={['TECHNICIAN']}>
                        <TechnicianPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/employee"
                element={
                    <ProtectedRoute user={user} allowedRoles={['EMPLOYEE']}>
                        <EmployeePage />
                    </ProtectedRoute>
                }
            />

            <Route
                path="*"
                element={<Navigate to={user ? homeRouteForRole(user.role) : "/login"} replace />}
            />
        </Routes>
    );
}

export default App;