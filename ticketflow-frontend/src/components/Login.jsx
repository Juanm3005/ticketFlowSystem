import { useState } from "react";
import { login, getAuthHeader } from "../services/api";
import { useNavigate } from 'react-router-dom';
import AuthLayout from "./auth/AuthLayout";
import AuthInput from "./auth/AuthInput";
import AuthError from "./auth/AuthError";
import AuthSubmitButton from "./auth/AuthSubmitButton";
import AuthFooterLink from "./auth/AuthFooterLink";
import LockIcon from "./icons/LockIcon";

function Login({ onLoginSuccess }) {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        try {
            const user = await login(email, password);

            const authHeader = getAuthHeader(email, password);
            localStorage.setItem("authHeader", authHeader);

            onLoginSuccess(user);

            if (user.role === 'ADMIN') navigate('/admin');
            else if (user.role === 'TECHNICIAN') navigate('/technician');
            else navigate('/employee');
        } catch {
            setError('Invalid email or password. Please try again.');
        }
    }

    return (
        <AuthLayout
            variant="login"
            heroDescription={<>Manage your support requests and <br />streamline your workflow with TicketFlow.</>}
            title="Welcome back"
            subtitle="Sign in to your TicketFlow account"
        >
            <form onSubmit={handleSubmit} className="flex flex-col gap-[25px]">
                <AuthInput
                    variant="login"
                    id="email"
                    label="Email"
                    iconText="✉"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <AuthInput
                    variant="login"
                    id="password"
                    label="Password"
                    Icon={LockIcon}
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <AuthError variant="login" message={error} />

                <AuthSubmitButton variant="login">
                    Sign in
                </AuthSubmitButton>
            </form>

            <AuthFooterLink variant="login" text="Don't have an account?" to="/register" linkText="Create account" />
        </AuthLayout>
    );
}

export default Login;
