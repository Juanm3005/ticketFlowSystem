import { useState } from 'react';
import { register } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import logo from "../assets/logo.png";
import './Register.css';

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
        <div className="register-page">

            <section className="register-left">
                <div className="register-brand">
                    <img src={logo} alt="TicketFlow Logo" className="register-logo" />
                </div>

                <div className="register-hero">
                    <h1>Manage tickets.<br />
                        <span>Deliver solutions.</span>
                    </h1>

                    <p>Create your account and start <br />streamlining your support process.</p>
                </div>

                <div className="register-circle circle-one"></div>
                <div className="register-circle circle-two"></div>
                <div className="register-dots"></div>
            </section>

            <section className="register-right">
                <div className="register-card">
                    <div className="register-header">
                        <h2>Create your account</h2>
                        <p>Get started with TicketFlow</p>
                    </div>

                    <form onSubmit={handleSubmit} className="register-form">
                        <div className="register-input-container">
                            <label htmlFor="username">Username</label>
                            <div className="register-input-wrapper">
                                <svg className="register-input-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em"><path fill="currentColor" d="M6.4 20q-1 0-1.7-.7T4 17.6v-1.175q0-.95.688-1.763q.687-.812 1.812-1.4q1.125-.587 2.538-.925Q10.45 12 11.9 12q1.45 0 2.9.337q1.45.338 2.6.938q1.15.6 1.875 1.413Q20 15.5 20 16.45v1.15q0 1-.7 1.7t-1.7.7Zm0-2h11.2q.15 0 .275-.125Q18 17.75 18 17.6v-1.175q0-.625-1.788-1.525q-1.787-.9-4.312-.9q-2.575 0-4.237.9Q6 15.8 6 16.45v1.15q0 .15.125.275Q6.25 18 6.4 18Zm5.5-7q-1.45 0-2.475-1.025Q8.4 8.95 8.4 7.5q0-1.45 1.025-2.475Q10.45 4 11.9 4q1.475 0 2.487 1.025Q15.4 6.05 15.4 7.5q0 1.45-1.025 2.475Q13.35 11 11.9 11Zm0-2q.625 0 1.063-.438q.437-.437.437-1.062t-.437-1.062Q12.525 6 11.9 6t-1.062.438Q10.4 6.875 10.4 7.5t.438 1.062Q11.275 9 11.9 9Zm0-1.5ZM12 14Z" /></svg>
                                <input id="username" type="text" placeholder="Enter your username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                            </div>
                        </div>

                        <div className="register-input-container">
                            <label htmlFor="email">Email</label>
                            <div className="register-input-wrapper">
                                <span className="register-input-icon">✉</span>

                                <input id="email" type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            </div>
                        </div>

                        <div className="register-input-container">
                            <label htmlFor="password">Password</label>

                            <div className="register-input-wrapper">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" className="register-input-icon"><path fill="currentColor" d="M6 22h12c1.1 0 2-.9 2-2v-9c0-1.1-.9-2-2-2h-1V7c0-2.76-2.24-5-5-5S7 4.24 7 7v2H6c-1.1 0-2 .9-2 2v9c0 1.1.9 2 2 2M9 7c0-1.65 1.35-3 3-3s3 1.35 3 3v2H9zm-3 4h12v9H6z" /></svg>

                                <input id="password" type="password" placeholder="Create a password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={8} required />
                            </div>
                            <p className="password-info">◉ Must be at least 8 characters long</p>
                        </div>

                        {error && (<p className="register-error">{error}</p>)}

                        <button type="submit" className="register-button" disabled={loading}>
                            {loading
                                ? "Creating account..."
                                : "Create account"
                            }
                        </button>
                    </form>



                    <div className="login-link">
                        <span>Already have an account?</span>
                        <Link to="/Login">Sign in</Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
export default Register;