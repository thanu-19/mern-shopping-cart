import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import './MilkProducts.css'; // Reusing same CSS
import axios from 'axios';

const Vegetables = () => {
  const navigate = useNavigate();
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    cost: '',
    image: null,
  });
  const [items, setItems] = useState([]);

  useEffect(() => {
    const isAdminLoggedIn = localStorage.getItem('isAdminLoggedIn');
    if (!isAdminLoggedIn) navigate('/admin');
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const res = await axios.get('http://localhost:5000/vegetables');
    setItems(res.data);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('cost', formData.cost);
    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      if (editingItem) {
        await axios.put(`http://localhost:5000/vegetables/${editingItem._id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setEditingItem(null);
      } else {
        await axios.post('http://localhost:5000/vegetables', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      setFormData({ name: '', cost: '', image: null });
      fetchItems();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({ name: item.name, cost: item.cost, image: null });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/vegetables/${id}`);
      fetchItems();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar onLogout={() => {
        localStorage.removeItem('isAdminLoggedIn');
        navigate('/admin');
      }} />
      <div className="main-content">
        <h1 className="title">🥕 Vegetables Management</h1>
        <form onSubmit={handleSubmit} className="product-form">
          <input type="text" name="name" placeholder="Item Name" value={formData.name} onChange={handleChange} required />
          <input type="number" name="cost" placeholder="Cost" value={formData.cost} onChange={handleChange} required />
          <input type="file" name="image" accept="image/*" onChange={handleChange} required />
          <button type="submit">{editingItem ? "Update" : "Add"} Product</button>
        </form>

        <h2 className="sub-title">📋 All Vegetables</h2>
        <table className="product-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Cost</th>
              <th>Update/Delete</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id}>
                <td><img src={`http://localhost:5000/uploads/${item.image}`} alt={item.name} width="60" /></td>
                <td>{item.name}</td>
                <td>₹{item.cost}</td>
                <td>
                  <button onClick={() => handleEdit(item)}>Update</button>
                  <button onClick={() => handleDelete(item._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Vegetables;

