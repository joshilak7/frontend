import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import {
  FiUser,
  FiShield,
  FiBell,
  FiActivity,
  FiTrendingUp,
  FiUsers,
} from "react-icons/fi";
import { authAPI } from "../utils/api";

const Dashboard = ({ showNotification }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await authAPI.getCurrentUser();
        setUser(response.user);
      } catch (error) {
        showNotification({
          type: "error",
          title: "Session Expired",
          message: "Please login again",
        });
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate, showNotification]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    showNotification({
      type: "success",
      title: "Logged Out",
      message: "You have been logged out successfully",
    });
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div
          className="container"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
          }}
        >
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Navbar user={user} onLogout={handleLogout} />

      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>Welcome back, {user?.name}!</h1>
          <p>Here's what's happening with your account today.</p>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <div className="card-header">
              <div className="card-icon">
                <FiUser />
              </div>
              <div className="card-content">
                <h3>Profile Information</h3>
                <p>Manage your personal information</p>
              </div>
            </div>
            <div className="card-body">
              <p>
                <strong>Email:</strong> {user?.email}
              </p>
              <p>
                <strong>Status:</strong>
                <span
                  style={{
                    color: user?.emailVerified ? "#4ade80" : "#f8961e",
                    marginLeft: "8px",
                  }}
                >
                  {user?.emailVerified ? "Verified" : "Pending Verification"}
                </span>
              </p>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-header">
              <div className="card-icon">
                <FiShield />
              </div>
              <div className="card-content">
                <h3>Security</h3>
                <p>Update password and security settings</p>
              </div>
            </div>
            <div className="card-body">
              <p>Last login: Today</p>
              <p>Account created: {new Date().toLocaleDateString()}</p>
              <button
                className="btn btn-secondary"
                style={{ marginTop: "15px" }}
              >
                Change Password
              </button>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-header">
              <div className="card-icon">
                <FiActivity />
              </div>
              <div className="card-content">
                <h3>Activity</h3>
                <p>Your recent account activity</p>
              </div>
            </div>
            <div className="card-body">
              <div style={{ marginBottom: "10px" }}>
                <span style={{ fontWeight: "600" }}>✓</span> Successfully logged
                in
              </div>
              <div style={{ marginBottom: "10px" }}>
                <span style={{ fontWeight: "600" }}>⏱</span> Session active for
                15 minutes
              </div>
              <div>
                <span style={{ fontWeight: "600" }}>📊</span> Dashboard accessed
                3 times today
              </div>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-header">
              <div className="card-icon">
                <FiBell />
              </div>
              <div className="card-content">
                <h3>Notifications</h3>
                <p>Your recent notifications</p>
              </div>
            </div>
            <div className="card-body">
              <div
                style={{
                  padding: "15px",
                  background: "#f8f9fa",
                  borderRadius: "8px",
                  marginBottom: "10px",
                }}
              >
                <strong>Welcome!</strong>
                <p style={{ fontSize: "0.9rem", marginTop: "5px" }}>
                  Thanks for joining our platform.
                </p>
              </div>
              {!user?.emailVerified && (
                <div
                  style={{
                    padding: "15px",
                    background: "#fff3cd",
                    borderRadius: "8px",
                    border: "1px solid #ffecb5",
                  }}
                >
                  <strong>Action Required:</strong>
                  <p style={{ fontSize: "0.9rem", marginTop: "5px" }}>
                    Please verify your email address.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-header">
              <div className="card-icon">
                <FiTrendingUp />
              </div>
              <div className="card-content">
                <h3>Statistics</h3>
                <p>Your account statistics</p>
              </div>
            </div>
            <div className="card-body">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  textAlign: "center",
                  marginTop: "15px",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: "2rem",
                      fontWeight: "700",
                      color: "#4361ee",
                    }}
                  >
                    1
                  </div>
                  <div style={{ fontSize: "0.9rem", color: "#6c757d" }}>
                    Active Sessions
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: "2rem",
                      fontWeight: "700",
                      color: "#7209b7",
                    }}
                  >
                    100%
                  </div>
                  <div style={{ fontSize: "0.9rem", color: "#6c757d" }}>
                    Security Score
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-header">
              <div className="card-icon">
                <FiUsers />
              </div>
              <div className="card-content">
                <h3>Community</h3>
                <p>Connect with other users</p>
              </div>
            </div>
            <div className="card-body">
              <p>You're among the first users of our platform!</p>
              <button
                className="btn btn-secondary"
                style={{ marginTop: "15px" }}
              >
                Explore Community
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
