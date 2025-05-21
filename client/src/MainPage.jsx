import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./MainPage.css";
const backendURL = import.meta.env.VITE_BACKEND_URL;
const MainPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);


  useEffect(() => {
    const loggedInEmail = localStorage.getItem("userEmail");
    if (!loggedInEmail) {
      navigate("/login"); // Redirect if not logged in
    } else {
      setEmail(loggedInEmail);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    navigate("/login");
  };


const toggleDropdown = () => {
    setShowDropdown((prev) => {
      console.log("Toggling dropdown:", !prev); // 👈 Add this
      return !prev;
    });
  };
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [userName, setUserName] = useState("");

useEffect(() => {
    const loggedInEmail = localStorage.getItem("userEmail");
    if (!loggedInEmail) {
      navigate("/login");
      return;
    }
  
    fetch(`${backendURL}/api/user?email=${loggedInEmail}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.name) setUserName(data.name);
      })
      .catch((err) => console.error("Failed to fetch user:", err));
  }, [navigate]);
  
  const handleClickHere = () => {
    navigate("/products");  // Redirect to ProductPage
  };


  return (
    <>
      <nav className="navbar1">
        <div className="navbar-left1">MyBasket</div>
        <div className="navbar-right1">
       
          {/* <span className="nav-link1">My Cart</span> */}
          <div className="profile-dropdown1" ref={dropdownRef}>
            <span className="nav-link1" onClick={toggleDropdown}>
              User Profile 👤 :- 
            </span>
            {showDropdown && (
              <div className="dropdown-content1">
                <p>Email: {email}</p>
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
          <span className="nav-link" onClick={() => navigate("/")}>
  Logout as {email}
</span>
        </div>

      </nav>
      <div className="welcome-section1">
      <h1>
        Hey {userName || "there"}! Thinking to buy something? Come on, let's order...{" "}
        <span
          onClick={handleClickHere}
          style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}
        >
          Click here!
        </span>
      </h1>
    </div>
    </>
  );
};

export default MainPage;
