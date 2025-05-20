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










// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Sidebar from './Sidebar';
// import './MilkProducts.css';
// import axios from 'axios';

// const MilkProducts = () => {
//   const navigate = useNavigate();
//   const [editingItem, setEditingItem] = useState(null);

//   const [formData, setFormData] = useState({
//     name: '',
//     cost: '',
//     image: null
//   });
//   const [items, setItems] = useState([]);

//   useEffect(() => {
//     const isAdminLoggedIn = localStorage.getItem('isAdminLoggedIn');
//     if (!isAdminLoggedIn) navigate('/admin');
//     fetchItems();
//   }, []);

//   const fetchItems = async () => {
//     const res = await axios.get('http://localhost:5000/milk-products');
//     setItems(res.data);
//   };

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     if (name === 'image') {
//       setFormData({ ...formData, image: files[0] });
//     } else {
//       setFormData({ ...formData, [name]: value });
//     }
//   };

// const handleSubmit = async (e) => {
//     e.preventDefault();
//     const data = new FormData();
//     data.append('name', formData.name);
//     data.append('cost', formData.cost);
//     if(formData.image) {
//       data.append('image', formData.image);
//     }
  
//     try {
//       if(editingItem) {
//         // Update product
//         await axios.put(http://localhost:5000/milk-products/${editingItem._id}, data, {
//           headers: { 'Content-Type': 'multipart/form-data' },
//         });
//         setEditingItem(null); // Reset editing state
//       } else {
//         // Add new product
//         await axios.post('http://localhost:5000/milk-products', data, {
//           headers: { 'Content-Type': 'multipart/form-data' },
//         });
//       }
//       setFormData({ name: '', cost: '', image: null });
//       fetchItems();
//     } catch (error) {
//       console.error(error);
//     }
//   };
  
//   const handleEdit = (item) => {
//     setEditingItem(item);
//     setFormData({
//       name: item.name,
//       cost: item.cost,
//       image: null // Keep null because user may not want to change image
//     });
//   };
  
//   const handleDelete = async (id) => {
//     try {
//       await axios.delete(http://localhost:5000/milk-products/${id});
//       fetchItems();
//     } catch (error) {
//       console.error(error);
//     }
//   };
  
//   return (
//     <div className="dashboard-container">
//       <Sidebar onLogout={() => {
//         localStorage.removeItem('isAdminLoggedIn');
//         navigate('/admin');
//       }} />
//       <div className="main-content">
//         <h1 className="title">🍼 Milk Products Management</h1>
//         <form onSubmit={handleSubmit} className="product-form">
//           <input
//             type="text"
//             name="name"
//             placeholder="Item Name"
//             value={formData.name}
//             onChange={handleChange}
//             required
//           />
//           <input
//             type="number"
//             name="cost"
//             placeholder="Cost"
//             value={formData.cost}
//             onChange={handleChange}
//             required
//           />
//           <input
//             type="file"
//             name="image"
//             accept="image/*"
//             onChange={handleChange}
//             required
//           />
//           <button type="submit">Add Product</button>
//         </form>

//         <h2 className="sub-title">📋 All Milk Products</h2>
//         <table className="product-table">
//           <thead>
//             <tr>
//               <th>Image</th>
//               <th>Name</th>
//               <th>Cost</th>
//               <th>Update/Delete</th>
//             </tr>
//           </thead>
        
//           <tbody>
//           {items.map((item) => (
//             <tr key={item._id}>
//               <td><img src={http://localhost:5000/uploads/${item.image}} alt={item.name} width="60" /></td>
//               <td>{item.name}</td>
//               <td>₹{item.cost}</td>
//               <td>
//                 <button onClick={() => handleEdit(item)}>Update</button>
//                 <button onClick={() => handleDelete(item._id)}>Delete</button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
        
//         </table>
//       </div>
//     </div>
//   );
// };

// export default MilkProducts;...   .title {
//     font-size: 2rem;
//     margin-bottom: 20px;
//     color: #2c3e50;
//   }
  
//   .sub-title {
//     margin-top: 40px;
//     font-size: 1.5rem;
//     color: #34495e;
//   }

// /* Table Styling */
// .product-table {
//   width: 100%;
//   border-collapse: collapse;
//   margin-top: 20px;
//   font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
// }

// .product-table th, .product-table td {
//   border: 1px solid #ddd;
//   padding: 12px 15px;
//   text-align: center;
// }

// .product-table thead {
//   background-color: #f2f2f2;
//   font-weight: 600;
//   color: #333;
// }

// .product-table tbody tr:nth-child(even) {
//   background-color: #fafafa;
// }

// .product-table tbody tr:hover {
//   background-color: #f1f1f1;
// }

// /* Image in table */
// .product-table img {
//   border-radius: 8px;
//   object-fit: cover;
// }

// /* Buttons styling */
// .product-table button {
//   background-color: #007bff; /* Blue */
//   color: white;
//   border: none;
//   padding: 7px 14px;
//   margin: 0 5px;
//   border-radius: 4px;
//   cursor: pointer;
//   transition: background-color 0.3s ease;
//   font-weight: 600;
//   font-size: 14px;
// }

// .product-table button:hover {
//   background-color: #0056b3; /* Darker blue */
// }

// /* Specific styling for Delete button */
// .product-table button:nth-child(2) {
//   background-color: #dc3545; /* Red */
// }

// .product-table button:nth-child(2):hover {
//   background-color: #a71d2a; /* Darker red */
// }

// /* Form Styling (optional) */
// .product-form input[type="text"],
// .product-form input[type="number"],
// .product-form input[type="file"] {
//   padding: 8px 12px;
//   margin-right: 10px;
//   border: 1.5px solid #ccc;
//   border-radius: 5px;
//   font-size: 15px;
//   transition: border-color 0.3s ease;
// }

// .product-form input[type="text"]:focus,
// .product-form input[type="number"]:focus,
// .product-form input[type="file"]:focus {
//   border-color: #007bff;
//   outline: none;
// }

// .product-form button {
//   background-color: #28a745; /* Green */
//   color: white;
//   border: none;
//   padding: 9px 18px;
//   border-radius: 5px;
//   cursor: pointer;
//   font-weight: 600;
//   font-size: 15px;
//   transition: background-color 0.3s ease;
// }

// .product-form button:hover {
//   background-color: #19692c;
// }....same like this i need for Groceries.jsx page for update delete same i need like milkproducts page itself and 
// const milkSchema = new mongoose.Schema({
//   name: String,
//   cost: Number,
//   image: String
// });

// const MilkProduct = mongoose.model('MilkProduct', milkSchema);

// // multer config
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, 'uploads/'),
//   filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
// });

// const upload = multer({ storage });

// // POST route
// app.post('/milk-products', upload.single('image'), async (req, res) => {
//   const { name, cost } = req.body;
//   const image = req.file.filename;

//   const product = new MilkProduct({ name, cost, image });
//   await product.save();
//   res.status(201).send('Product added');
// });

// // GET route
// app.get('/milk-products', async (req, res) => {
//   const products = await MilkProduct.find();
//   res.json(products);
// });

// // PUT route to update product
// app.put('/milk-products/:id', upload.single('image'), async (req, res) => {
//   const { id } = req.params;
//   const { name, cost } = req.body;
//   let updateData = { name, cost };

//   if (req.file) {
//     updateData.image = req.file.filename;
//   }

//   try {
//     await MilkProduct.findByIdAndUpdate(id, updateData);
//     res.status(200).send('Product updated');
//   } catch (err) {
//     res.status(500).send('Error updating product');
//   }
// });

// // DELETE route to delete product
// app.delete('/milk-products/:id', async (req, res) => {
//   const { id } = req.params;

//   try {
//     await MilkProduct.findByIdAndDelete(id);
//     res.status(200).send('Product deleted');
//   } catch (err) {
//     res.status(500).send('Error deleting product');
//   }
// });

// app.listen(PORT, () => {
//   console.log(🚀 Server running at http://localhost:${PORT});
// });....give routes like this only 