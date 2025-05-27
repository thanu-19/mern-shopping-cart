import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // <-- import useNavigate
const backendURL = import.meta.env.VITE_BACKEND_URL;

const PaymentSuccess = () => {
  const [orderDetails, setOrderDetails] = useState(null);
  const location = useLocation();
  const navigate = useNavigate(); // <-- initialize navigate

  useEffect(() => {
    const fetchOrderDetails = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");
      const userEmail = localStorage.getItem("userEmail");

      try {
        const res = await fetch(`${backendURL}/capture-order?token=${token}`);
        const data = await res.json();

        const cartData = JSON.parse(localStorage.getItem(`cartBeforePayment_${userEmail}`));

        // Set order details in localStorage for record keeping
        // localStorage.setItem(`order_${userEmail}`, JSON.stringify({
        //   ...cartData,
        //   status: "Paid",
        //   address: data.shippingAddress
        // }));

        // setOrderDetails({ ...cartData, address: data.shippingAddress });



        // Set order details in localStorage for record keeping
        localStorage.setItem(`order_${userEmail}`, JSON.stringify({
          ...cartData,
          status: "Paid",
          full_name: data.full_name,       // ✅ add full name
          address: data.address            // ✅ use returned address
        }));

        setOrderDetails({
          ...cartData,
          status: "Paid",
          full_name: data.full_name,
          address: data.address
        });
        // ✅ Clear both before and current cart
        localStorage.removeItem(`cartBeforePayment_${userEmail}`);
        localStorage.removeItem(`cart_${userEmail}`);
      } catch (err) {
        console.error("Error capturing order:", err);
      }
    };

    fetchOrderDetails();
  }, []);

  if (!orderDetails) return <p>Loading your payment confirmation...</p>;

  return (
    <div className="payment-summary">
      <h2>✅ Payment Successful</h2>
      <p>Thank you for your order!</p>
      <p><strong>Total Paid:</strong> ₹{orderDetails.amount}</p>

      <h4>📦 Items:</h4>
      <ul>
        {orderDetails.items.map((item, i) => (
          <li key={i}>
            {item.name} x {item.quantity}
          </li>
        ))}
      </ul>

      <h4>📍 Delivery Address:</h4>
      <p><strong>Name:</strong> {orderDetails.full_name}</p>
      <p><strong>Address:</strong> {orderDetails.address.address_line_1}, {orderDetails.address.admin_area_2}</p>
      <p>{orderDetails.address.admin_area_1} - {orderDetails.address.postal_code}</p>

      {/* ✅ Go to Cart Button */}
      <button
        onClick={() => navigate("/mycart")}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer"
        }}
      >
        Go to Cart
      </button>
    </div>
  );
};

export default PaymentSuccess;
