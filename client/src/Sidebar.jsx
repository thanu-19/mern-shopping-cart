// Sidebar.jsx
import React from 'react';
// import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './DashboardPage.css';

const Sidebar = ({ onLogout }) => {
  return (
    <div className="sidebar">
      <h2>MyBasket</h2>
      <ul>
      <li><Link to="/milkproducts">Milk Products</Link></li>
      <li><Link to="/snacks">Snacks</Link></li>
      <li><Link to="/vegetables">Vegetables</Link></li>
      <li><Link to="/fruits">Fruits</Link></li>
      <li><Link to="/groceries">Groceries</Link></li>
        
        <li>Bakery Items</li>
      </ul>
      <button className="logout-button" onClick={onLogout}>
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
