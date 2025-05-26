// import React from "react";

// const PaymentSuccess = () => {
//   return (
//     <div style={{ padding: "20px", textAlign: "center" }}>
//       <h2>🎉 Payment Successful!</h2>
//       <p>Thank you for your purchase, Chinniiiii!</p>
//     </div>
//   );
// };

// export default PaymentSuccess;


// import React, { useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";

// const PaymentSuccess = () => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const { items, amount, address } = location.state || {};

//   useEffect(() => {
//     // Save order to localStorage
//     const userEmail = localStorage.getItem("userEmail");
//     if (userEmail && items && address) {
//       const orderData = {
//         items,
//         amount,
//         address,
//         status: "Order Placed",
//         time: new Date().toISOString(),
//       };
//       localStorage.setItem(`order_${userEmail}`, JSON.stringify(orderData));
//       localStorage.setItem(`cart_${userEmail}`, JSON.stringify([])); // Clear cart
//     }

//     // Redirect to MyCart after 3 seconds
//     const timer = setTimeout(() => {
//       navigate("/mycart");
//     }, 3000);

//     return () => clearTimeout(timer);
//   }, [items, amount, address, navigate]);

//   return (
//     <div style={{ padding: "20px", textAlign: "center" }}>
//       <h2>🎉 Payment Successful!</h2>
//       <p>Thank you for your purchase, Chinniiiii!</p>
//     </div>
//   );
// };

// export default PaymentSuccess;







// import React, { useEffect, useState } from "react";
// import { useLocation } from "react-router-dom";
// const backendURL = import.meta.env.VITE_BACKEND_URL;

// const PaymentSuccess = () => {
//   const [orderDetails, setOrderDetails] = useState(null);
//   const location = useLocation();

//   useEffect(() => {
//     const fetchOrderDetails = async () => {
//       const params = new URLSearchParams(window.location.search);
//       const token = params.get("token"); // PayPal returns this
//       const userEmail = localStorage.getItem("userEmail");

//       try {
//         const res = await fetch(`${backendURL}/capture-order?token=${token}`);
//         const data = await res.json();

//         const cartData = JSON.parse(localStorage.getItem(`cartBeforePayment_${userEmail}`));
//         localStorage.setItem(`order_${userEmail}`, JSON.stringify({
//           ...cartData,
//           status: "Paid",
//           address: data.shippingAddress
//         }));

//         setOrderDetails({ ...cartData, address: data.shippingAddress });

//         // Clear cart, localStorage, etc., if needed
//         localStorage.removeItem(`cartBeforePayment_${userEmail}`);
//       } catch (err) {
//         console.error("Error capturing order:", err);
//       }
//     };

//     fetchOrderDetails();
//   }, []);

//   if (!orderDetails) return <p>Loading your payment confirmation...</p>;

//   return (
//     <div className="payment-summary">
//       <h2>✅ Payment Successful</h2>
//       <p>Thank you for your order!</p>
//       <p><strong>Total Paid:</strong> ₹{orderDetails.amount}</p>
//       <h4>📦 Items:</h4>
//       <ul>
//         {orderDetails.items.map((item, i) => (
//           <li key={i}>
//             {item.name} x {item.quantity}
//           </li>
//         ))}
//       </ul>
//       <h4>📍 Delivery Address:</h4>
//       <p>{orderDetails.address.recipient_name}</p>
//       <p>{orderDetails.address.line1}, {orderDetails.address.city}</p>
      
//       <p>{orderDetails.address.state} - {orderDetails.address.postal_code}</p>
//     </div>
//   );
// };

// export default PaymentSuccess;





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
        localStorage.setItem(`order_${userEmail}`, JSON.stringify({
          ...cartData,
          status: "Paid",
          address: data.shippingAddress
        }));

        setOrderDetails({ ...cartData, address: data.shippingAddress });

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
      <p><strong>Name:</strong> {orderDetails.address.full_name}</p>
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
