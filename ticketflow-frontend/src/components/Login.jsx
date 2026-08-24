import { useState } from "react";
import { login } from "../services/api";
import "./Login.css";
import { Link } from 'react-router-dom';
import logo from "../assets/logo.png";

function Login({ onLoginSuccess }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        try {
            await login(email, password);
            onLoginSuccess(email, password);
        } catch {
            setError("Email or password incorrect");
        }
    }

    return (
        <div className="login-page">

            <section className="login-left">

                <div className="brand">
                    <img src={logo} alt="TicketFlow Logo" className="brand-logo"/>
                </div>
            
                <div className="hero-text">
                    <h1>Manage tickets.<br/>
                        <span>Deliver solutions.</span>
                    </h1>
                    <p>Manage your support requests and <br/>streamline your workflow with TicketFlow.</p>
                </div>
                <div className="decoration decoration-1"></div>
                <div className="decoration decoration-2"></div>
                <div className="dots"></div>
            </section>

            <section className="login-right">
                <div className="login-card">
                    <div className="login-header">
                        <h2>Welcome back</h2>
                        <p>Sign in to your TicketFlow account </p>
                    </div>

                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="input-container">
                            <label htmlFor="email">Email</label>
                            <div className="input-wrapper">
                                <span className="input-icon"> ✉ </span>
                                <input id="email" type="email" placeholder="Enter your email" value={email} onChange={(e) =>setEmail(e.target.value)} required/>
                            </div>
                        </div>

                        <div className="input-container">
                            <label htmlFor="password">Password</label>
                            <div className="input-wrapper">

                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" className="input-icon"><path fill="currentColor" d="M6 22h12c1.1 0 2-.9 2-2v-9c0-1.1-.9-2-2-2h-1V7c0-2.76-2.24-5-5-5S7 4.24 7 7v2H6c-1.1 0-2 .9-2 2v9c0 1.1.9 2 2 2M9 7c0-1.65 1.35-3 3-3s3 1.35 3 3v2H9zm-3 4h12v9H6z" /></svg>

                                <input id="password" type="password" placeholder="Enter your password" value={password} onChange={(e) =>setPassword(e.target.value)} required/>
                            </div>
                        </div>

                        {error && (<p className="error-message">{error}</p>)}
                        <button type="submit"className="login-button">
                            Sign in
                        </button>
                    </form>

                    <div className="register-link">
                        <span>Don't have an account?</span>
                        <Link to="/register">Create account</Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Login;