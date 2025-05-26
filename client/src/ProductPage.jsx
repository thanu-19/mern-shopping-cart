import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./ProductPage.css";
const backendURL = import.meta.env.VITE_BACKEND_URL;

const ProductPage = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [milkProducts, setMilkProducts] = useState([]);
  const [fruits, setFruits] = useState([]);
  const [snacks, setSnacks] = useState([]);
  const [groceries, setGroceries] = useState([]);
  const [bakery, setBakery] = useState([]);
  const [vegetables, setVegetables] = useState([]);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) {
      setUserEmail(storedEmail);
    } else {
      navigate("/login");
    }

    // Fetch milk products
    fetch(`${backendURL}/milk-products`)
      .then((res) => res.json())
      .then((data) => setMilkProducts(data))
      .catch((err) => console.error("Error fetching milk products:", err));

      fetch(`${backendURL}/fruits`)
      .then((res) => res.json())
      .then((data) => setFruits(data))
      .catch((err) => console.error("Error fetching fruits:", err));

      fetch(`${backendURL}/vegetables`)
      .then((res) => res.json())
      .then((data) => setVegetables(data))
      .catch((err) => console.error("Error fetching vegetables:", err));

      fetch(`${backendURL}/snacks`)
      .then((res) => res.json())
      .then((data) => setSnacks(data))
      .catch((err) => console.error("Error fetching snacks:", err));

      fetch(`${backendURL}/groceries`)
      .then((res) => res.json())
      .then((data) => setGroceries(data))
      .catch((err) => console.error("Error fetching groceries:", err));

      fetch(`${backendURL}/bakery`)
      .then((res) => res.json())
      .then((data) => setGroceries(data))
      .catch((err) => console.error("Error fetching bakery:", err));

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("cart");
    navigate("/login");
  }; 

  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">MyBasket</div>
        <div className="navbar-right">
        <span className="nav-link" onClick={() => navigate("/mycart")}>
  My Cart
</span>
          <div className="profile-dropdown" ref={dropdownRef}>
            <span
              className="nav-link"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{ cursor: "pointer" }}
            >
              User Profile 👤 :-
            </span>
            {dropdownOpen && (
              <div className="dropdown-content">
                <p>Email: {userEmail}</p>
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
           <span className="nav-link" onClick={() => navigate("/")}>
  Logout as {userEmail}
</span>
        </div>
      </nav>

      <div className="product-section" >
        <h2>🥛 Our Milk Products</h2>
        <div className="products-popup">
          {milkProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        <h2 style={{ marginTop: "60px" }}>🍎 Fresh Fruits</h2>
        <div className="products-popup">
          {fruits.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        <h2 style={{ marginTop: "60px" }}>🥦 Fresh Vegetables</h2>
        <div className="products-popup">
          {vegetables.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        <h2 style={{ marginTop: "60px" }}>🍿Snacks</h2>
        <div className="products-popup">
          {snacks.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        <h2 style={{ marginTop: "60px" }}>🍼 Groceries</h2>
        <div className="products-popup">
          {groceries.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        <h2 style={{ marginTop: "60px" }}>🍰 Bakery Items</h2>
        <div className="products-popup">
          {bakery.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

      </div>


    </>
  );
};

const ProductCard = ({ product }) => {
  const [added, setAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);
  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");
    const existingCart = JSON.parse(localStorage.getItem(`cart_${userEmail}`)) || [];
    const existingProduct = existingCart.find(item => item._id === product._id);
  
    if (existingProduct) {
      setAdded(true);
      setQuantity(existingProduct.quantity);
    }
  }, [product._id]);
  
  const handleAddToCart = () => {
    const userEmail = localStorage.getItem("userEmail");
    const existingCart = JSON.parse(localStorage.getItem(`cart_${userEmail}`)) || [];
  
    const existingProductIndex = existingCart.findIndex(item => item._id === product._id);
  
    const cartProduct = {
      _id: product._id,
      name: product.name,
      cost: product.cost,
      image: product.image,
      quantity
    };
  
    if (existingProductIndex >= 0) {
      existingCart[existingProductIndex] = cartProduct;
    } else {
      existingCart.push(cartProduct);
    }
  
    localStorage.setItem(`cart_${userEmail}`, JSON.stringify(existingCart));
    window.dispatchEvent(new Event("storage")); // Notify others
    setAdded(true);
  };
  
  const updateLocalStorage = (newQty) => {
    const userEmail = localStorage.getItem("userEmail");
    const existingCart = JSON.parse(localStorage.getItem(`cart_${userEmail}`)) || [];
    const existingProductIndex = existingCart.findIndex(item => item._id === product._id);
  
    // if (existingProductIndex >= 0) {
    //   existingCart[existingProductIndex].quantity = newQty;
    //   localStorage.setItem(`cart_${userEmail}`, JSON.stringify(existingCart));
    //   window.dispatchEvent(new Event("storage")); // Notify others
    // }
    if (existingProductIndex >= 0) {
      existingCart[existingProductIndex].quantity = newQty;
    } else {
      // If not in cart, add it
      existingCart.push({ ...product, quantity: newQty });
    }
    
  };
  
  const increase = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    updateLocalStorage(newQuantity);
  };

  const decrease = () => {
    const newQuantity = quantity > 1 ? quantity - 1 : 1;
    setQuantity(newQuantity);
    updateLocalStorage(newQuantity);
  };

  return (
    <div className="product-box">
      <img src={product.image} alt={product.name} />

      <h4>{product.name}</h4>
      <p>₹ {product.cost}</p>
      {added ? (
        <>
          <div className="quantity-control">
            <button onClick={decrease}>-</button>
            <span>{quantity}</span>
            <button onClick={increase}>+</button>
          </div>
          <p style={{ color: "green" }}>Added to cart ✔️</p>
        </>
      ) : (
        <>
          <div className="quantity-control">
            <button onClick={decrease}>-</button>
            <span>{quantity}</span>
            <button onClick={increase}>+</button>
          </div>
          <button onClick={handleAddToCart} className="add-to-cart-btn">
            Add to Cart
          </button>
        </>
      )}
    </div>
  );
};


export default ProductPage;

