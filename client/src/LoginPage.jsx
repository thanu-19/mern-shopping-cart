import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

const handleLogin = async () => {
    if (!email || !password) {
      alert('Please fill all fields');
      return;
    }
  
    try {
      const res = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await res.json();
  
      if (res.ok) {
        // Store email in localStorage before navigating
        localStorage.setItem("userEmail", email);
  
        alert('Login successful!');
        navigate('/main');
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (error) {
      alert('Server error: ' + error.message);
    }
  };

  
return (
    <div className="container">
      <div className="popup">
        <h2>Login</h2>
        <input
          type="email"
          placeholder="Email ID"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <label>
          <input
            type="checkbox"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
          />{' '}
          Show Password
        </label>
        <button className="btn" onClick={handleLogin}>
          Login
        </button>
        <p>
          Don't have an account?{' '}
          <span className="link" onClick={() => navigate('/')}>
            Register
          </span>
        </p>
        <p>
          <span className="link" onClick={() => navigate('/admin')}>
            Admin Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
