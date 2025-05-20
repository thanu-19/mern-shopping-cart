import React, { useEffect, useState } from "react";
import "./MyCart.css";

const MyCart = () => {
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

  return (
    <div className="cart-container">
      <h2>My Cart 🛒</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
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
                    <img src={`http://localhost:5000/uploads/${item.image}`} alt={item.name} />
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
        
            <button className="continue"  onClick={() => window.location.href = "/products"}>🛒 Continue Shopping</button>

            <button className="payment">Proceed to Payment</button>
          </div>
        </>
      )}
    </div>
  );
};

export default MyCart;
