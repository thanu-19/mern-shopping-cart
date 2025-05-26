import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

import './DashboardPage.css';

const DashboardPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isAdminLoggedIn = localStorage.getItem('isAdminLoggedIn');
    if (!isAdminLoggedIn) {
      navigate('/admin'); // redirect to login if not logged in
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn');
    navigate('/admin');
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <h2>MyBasket</h2>
        <ul>
        <li><Link to="/milkproducts">Milk Products</Link></li>
        <li><Link to="/snacks">Snacks</Link></li>
        <li><Link to="/vegetables">Vegetables</Link></li>
        <li><Link to="/fruits">Fruits</Link></li>
        <li><Link to="/groceries">Groceries</Link></li>  
        <li><Link to="/bakery">Bakery</Link></li>
        </ul>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <div className="main-content">
        <h1>Welcome to Admin Dashboard</h1>
        <p>Manage your categories and products here.</p>
      </div>
    </div>
  );
};

export default DashboardPage;
