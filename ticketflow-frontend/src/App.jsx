import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';

function App() {
    const [credentials, setCredentials] = useState(null);

    function handleLoginSuccess(email, password) {
        setCredentials({ email, password });
    }

    if (credentials) {
        return <h1>Sesión iniciada como {credentials.email}</h1>;
    }

    return (
        <Routes>
            <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
}

export default App;