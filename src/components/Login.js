import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { authAPI } from "../utils/api";
import { FiAlertCircle } from "react-icons/fi";

const Login = ({ showNotification }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

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
      const response = await authAPI.login(formData);

      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));

      showNotification({
        type: "success",
        title: "Success!",
        message: "Logged in successfully",
      });

      navigate("/dashboard");
    } catch (error) {
      showNotification({
        type: "error",
        title: "Login Failed",
        message: error.message || "Invalid credentials",
      });
      setErrors({
        form: error.message || "Invalid credentials",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card fade-in">
        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p>Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
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
                placeholder="Enter your password"
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
            {errors.password && (
              <div className="error-message">
                <FiAlertCircle />
                {errors.password}
              </div>
            )}
          </div>

          <div
            className="auth-link"
            style={{ textAlign: "right", marginBottom: "20px" }}
          >
            <Link to="/forgot-password">Forgot password?</Link>
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
              {loading ? "Signing in..." : "Sign In"}
            </span>
          </button>
        </form>

        <div className="auth-link">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
