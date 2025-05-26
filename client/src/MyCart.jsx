import React, { useEffect, useState } from "react";
import "./MyCart.css";
import { useNavigate } from 'react-router-dom';
const backendURL = import.meta.env.VITE_BACKEND_URL;

const MyCart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  // const userEmail = localStorage.getItem("userEmail");
  const [userEmail, setUserEmail] = useState("");

  // Load userEmail once when component mounts
  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) {
      setUserEmail(storedEmail);
    } else {
      // optionally redirect to login if no email found
      // window.location.href = "/login";
    }
  }, []);

  // Load cart whenever userEmail changes
  useEffect(() => {
    if (!userEmail) return; // wait for userEmail

    const loadCart = () => {
      const existingCart = JSON.parse(localStorage.getItem(`cart_${userEmail}`)) || [];
      console.log("Loaded cart items in MyCart:", existingCart);
      setCartItems(existingCart);
    };

    loadCart();

    window.addEventListener("storage", loadCart);

    return () => {
      window.removeEventListener("storage", loadCart);
    };
  }, [userEmail]);

  useEffect(() => {
    const total = cartItems.reduce((acc, item) => acc + item.cost * item.quantity, 0);
    setTotalAmount(total);
    if (userEmail) {
      localStorage.setItem(`cart_${userEmail}`, JSON.stringify(cartItems));
    }
  }, [cartItems, userEmail]);

  const increase = (index) => {
    const newItems = [...cartItems];
    newItems[index].quantity += 1;
    setCartItems(newItems);
    localStorage.setItem(`cart_${userEmail}`, JSON.stringify(newItems));

  };

  const decrease = (index) => {
    const newItems = [...cartItems];
    if (newItems[index].quantity > 1) {
      newItems[index].quantity -= 1;
      setCartItems(newItems);
      localStorage.setItem(`cart_${userEmail}`, JSON.stringify(newItems));

    }
  };

  const deleteItem = (index) => {
    const newItems = [...cartItems];
    newItems.splice(index, 1);
    setCartItems(newItems);
    localStorage.setItem(`cart_${userEmail}`, JSON.stringify(newItems));

  };

  const handlePayment = async () => {
    try {
      // 🧠 Save current cart/amount to localStorage before redirect
      const userEmail = localStorage.getItem("userEmail");
      localStorage.setItem(
        `cartBeforePayment_${userEmail}`,
        JSON.stringify({
          items: cartItems,
          amount: totalAmount
        })
      );
  
      const res = await fetch(`${backendURL}/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ total: totalAmount }),
      });
  
      const data = await res.json();
      console.log("Payment initiation response:", data);
  
      if (data.approvalUrl) {
        window.location.href = data.approvalUrl;
      } else {
        console.error("approvalUrl not found in response");
      }
    } catch (err) {
      console.error("Error initiating PayPal payment:", err);
    }
  };
  
  return (
    <div className="cart-container">
      {/* <h2>My Cart 🛒</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
        <button
  className="go-back-btn"
  onClick={() => navigate("/products")}
> Go Back </button>

      ) : ( */}
      <h2>My Cart 🛒</h2>
{cartItems.length === 0 ? (
  <div>
    <p>Your cart is empty.</p>
    <button
      className="go-back-btn"
      onClick={() => navigate("/products")}
    >
      Go Back
    </button>
  </div>
) : (
        <>
          <table className="cart-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Cost (₹)</th>
                <th>Quantity</th>
                <th>Total (₹)</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item, index) => (
                <tr key={item._id || index}>
                  <td>
                  <img src={item.image} alt={item.name} />

                  </td>
                  <td>{item.name}</td>
                  <td>{item.cost}</td>
                  <td>
                    <div className="qty-btns">
                      <button onClick={() => decrease(index)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => increase(index)}>+</button>
                    </div>
                  </td>
                  <td>{item.cost * item.quantity}</td>
                  <td>
                    <button className="delete-btn" onClick={() => deleteItem(index)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <h3 className="total">Total Amount: ₹ {totalAmount}</h3>
          <div className="cart-buttons">
        
            <button className="continue"  onClick={() => navigate('/products')}>🛒 Continue Shopping</button>

            <button className="payment" onClick={handlePayment}>
  Proceed to Payment
</button>
          </div>
        </>
      )}
    </div>
  );
};

export default MyCart;
