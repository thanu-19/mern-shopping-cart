import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegisterPage from './RegisterPage';
import LoginPage from './LoginPage';
import MainPage from './MainPage';
import ProductPage from './ProductPage';
import AdminPage from './AdminPage';
import DashboardPage from './DashboardPage';
import Sidebar from './Sidebar';
import MilkProducts from './MilkProducts';
import Snacks from './Snacks';
import Vegetables from './Vegetables';
import Fruits from './Fruits';
import Groceries from './Groceries';
import MyCart from './MyCart';




const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RegisterPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/sidebar" element={<Sidebar />} />
        <Route path="/milkproducts" element={<MilkProducts />} />
        <Route path="/snacks" element={<Snacks />} />
        <Route path="/vegetables" element={<Vegetables />} />
        <Route path="/fruits" element={<Fruits />} />
        <Route path="/groceries" element={<Groceries />} />
        <Route path="/mycart" element={<MyCart />} />
        

      </Routes>
    </Router>
  );
};

export default App;