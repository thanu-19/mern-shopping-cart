
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminPage.css';

const AdminPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (email === 'admin@gmail.com' && password === 'iamadmin') {
        localStorage.setItem('isAdminLoggedIn', 'true');
      navigate('/dashboard');
    } else {
      alert('Invalid admin credentials!');
    }
  };

return (
    <div className="container">
      <div className="popup">
        <h2>Admin Login</h2>
        <input
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="Admin Password"
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
          <span className="link" onClick={() => navigate('/login')}>
            Login Page
          </span>
        </p>
      </div>
    </div>
  );
};

export default AdminPage;
