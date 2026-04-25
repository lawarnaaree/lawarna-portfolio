import React, { useState } from 'react';
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login attempt with:', { email, password });
    // In real app, this would call API and redirect
    window.location.href = '/dashboard';
  };

  return (
    <div className="login-page">
      <div className="login-card glass">
        <div className="login-header">
          <div className="login-logo">
            <span className="logo-accent">L</span>awarna
          </div>
          <h1>Admin Portal</h1>
          <p>Please enter your credentials to access the dashboard.</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email Address</label>
            <div className="input-wrapper">
              <FiMail className="input-icon" />
              <input 
                type="email" 
                placeholder="admin@lawarna.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label>Password</label>
            <div className="input-wrapper">
              <FiLock className="input-icon" />
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="login-btn">
            Sign In <FiArrowRight />
          </button>
        </form>

        <div className="login-footer">
          <p>© 2024 Lawarna Aree. All rights reserved.</p>
        </div>
      </div>

      <div className="login-background">
        <div className="blob"></div>
        <div className="blob"></div>
      </div>
    </div>
  );
};

export default Login;
