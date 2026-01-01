import React, { useState } from "react";
import { FiMenu, FiX, FiUser, FiLogOut } from "react-icons/fi";
import { Link } from "react-router-dom";

const Navbar = ({ user, onLogout }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getUserInitials = () => {
    if (!user?.name) return "U";
    return user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/dashboard" className="logo">
          MERN Auth
        </Link>

        <button
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            background: "none",
            border: "none",
            fontSize: "1.5rem",
            color: "#4361ee",
            cursor: "pointer",
            display: "none",
          }}
        >
          {mobileMenuOpen ? <FiX /> : <FiMenu />}
        </button>

        <div className={`nav-links ${mobileMenuOpen ? "mobile-open" : ""}`}>
          <div className="nav-user">
            <div className="user-avatar">{getUserInitials()}</div>
            <div className="user-info">
              <h3>{user?.name}</h3>
              <p>{user?.email}</p>
            </div>
          </div>

          <button onClick={onLogout} className="btn-logout">
            <FiLogOut style={{ marginRight: "8px" }} />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
