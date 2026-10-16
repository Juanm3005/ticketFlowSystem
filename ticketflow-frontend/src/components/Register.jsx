import { useState } from 'react';
import { register } from '../services/api';
import { useNavigate } from 'react-router-dom';
import AuthLayout from "./auth/AuthLayout";
import AuthInput from "./auth/AuthInput";
import AuthError from "./auth/AuthError";
import AuthSubmitButton from "./auth/AuthSubmitButton";
import AuthFooterLink from "./auth/AuthFooterLink";
import UserIcon from "./icons/UserIcon";
import LockIcon from "./icons/LockIcon";

function Register() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await register(username, email, password);
            navigate('/login');
        } catch {
            setError('not able to register user');
        } finally {
            setLoading(false);
        }
    }

    return (
        <AuthLayout
            variant="register"
            heroDescription={<>Create your account and start <br />streamlining your support process.</>}
            title="Create your account"
            subtitle="Get started with TicketFlow"
        >
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <AuthInput
                    variant="register"
                    id="username"
                    label="Username"
                    Icon={UserIcon}
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />

                <AuthInput
                    variant="register"
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
                    variant="register"
                    id="password"
                    label="Password"
                    Icon={LockIcon}
                    hint="◉ Must be at least 8 characters long"
                    type="password"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={8}
                    required
                />

                <AuthError variant="register" message={error} />

                <AuthSubmitButton variant="register" disabled={loading}>
                    {loading
                        ? "Creating account..."
                        : "Create account"
                    }
                </AuthSubmitButton>
            </form>

            <AuthFooterLink variant="register" text="Already have an account?" to="/Login" linkText="Sign in" />
        </AuthLayout>
    );
}

export default Register;
