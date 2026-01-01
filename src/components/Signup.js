import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiAlertCircle } from "react-icons/fi"; // ← This line is here

import {
  FiUser,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiCheck,
  // FiAlertCircle is NOT included here
} from "react-icons/fi";

import { authAPI } from "../utils/api";

const Signup = ({ showNotification }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    if (name === "password") {
      calculatePasswordStrength(value);
    }
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    setPasswordStrength(strength);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));

      showNotification({
        type: "success",
        title: "Success!",
        message:
          "Account created successfully. Please check your email for verification.",
      });

      navigate("/dashboard");
    } catch (error) {
      showNotification({
        type: "error",
        title: "Signup Failed",
        message: error.message || "Failed to create account",
      });
      setErrors({
        form: error.message || "Failed to create account",
      });
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 1:
        return "#f72585";
      case 2:
        return "#f8961e";
      case 3:
        return "#4cc9f0";
      case 4:
        return "#4ade80";
      default:
        return "#e9ecef";
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card fade-in">
        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Join our community today</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="name">
              <FiUser style={{ marginRight: "8px" }} />
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`form-input ${errors.name ? "error" : ""}`}
              placeholder="Enter your full name"
              disabled={loading}
            />
            {errors.name && (
              <div className="error-message">
                <FiAlertCircle />
                {errors.name}
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">
              <FiMail style={{ marginRight: "8px" }} />
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`form-input ${errors.email ? "error" : ""}`}
              placeholder="Enter your email"
              disabled={loading}
            />
            {errors.email && (
              <div className="error-message">
                <FiAlertCircle />
                {errors.email}
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              <FiLock style={{ marginRight: "8px" }} />
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`form-input ${errors.password ? "error" : ""}`}
                placeholder="Create a password"
                disabled={loading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            {/* Password strength indicator */}
            <div style={{ marginTop: "10px" }}>
              <div
                style={{
                  height: "4px",
                  background: getPasswordStrengthColor(),
                  width: `${passwordStrength * 25}%`,
                  transition: "all 0.3s ease",
                  borderRadius: "2px",
                }}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "5px",
                  fontSize: "0.8rem",
                  color: "#6c757d",
                }}
              >
                <span>Weak</span>
                <span>Strong</span>
              </div>
            </div>

            {errors.password && (
              <div className="error-message">
                <FiAlertCircle />
                {errors.password}
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="confirmPassword">
              <FiLock style={{ marginRight: "8px" }} />
              Confirm Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`form-input ${
                  errors.confirmPassword
                    ? "error"
                    : formData.confirmPassword &&
                      formData.password === formData.confirmPassword
                    ? "success"
                    : ""
                }`}
                placeholder="Confirm your password"
                disabled={loading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={loading}
              >
                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {errors.confirmPassword && (
              <div className="error-message">
                <FiAlertCircle />
                {errors.confirmPassword}
              </div>
            )}
            {formData.confirmPassword &&
              formData.password === formData.confirmPassword && (
                <div className="success-message">
                  <FiCheck />
                  Passwords match
                </div>
              )}
          </div>

          {errors.form && (
            <div className="error-message" style={{ marginBottom: "20px" }}>
              <FiAlertCircle />
              {errors.form}
            </div>
          )}

          <button
            type="submit"
            className={`btn btn-primary ${loading ? "btn-loading" : ""}`}
            disabled={loading}
          >
            <span className="btn-text">
              {loading ? "Creating Account..." : "Create Account"}
            </span>
          </button>
        </form>

        <div className="auth-link">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
