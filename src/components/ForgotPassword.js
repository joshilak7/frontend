import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiMail, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import { authAPI } from "../utils/api";

const ForgotPassword = ({ showNotification }) => {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (errors.email) {
      setErrors({ email: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
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
      await authAPI.forgotPassword({ email });
      setSuccess(true);
      showNotification({
        type: "success",
        title: "Success!",
        message: "Password reset instructions sent to your email",
      });
    } catch (error) {
      showNotification({
        type: "error",
        title: "Failed",
        message: error.message || "Failed to send reset email",
      });
      setErrors({
        form: error.message || "Failed to send reset email",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card fade-in">
        <div className="auth-header">
          <h1>Reset Password</h1>
          <p>Enter your email to reset your password</p>
        </div>

        {success ? (
          <div className="success-state">
            <div
              style={{
                textAlign: "center",
                padding: "40px 20px",
              }}
            >
              <FiCheckCircle
                style={{
                  fontSize: "4rem",
                  color: "#4ade80",
                  marginBottom: "20px",
                }}
              />
              <h2
                style={{
                  marginBottom: "15px",
                  color: "#212529",
                }}
              >
                Check Your Email
              </h2>
              <p
                style={{
                  color: "#6c757d",
                  marginBottom: "30px",
                }}
              >
                We've sent password reset instructions to:
                <br />
                <strong>{email}</strong>
              </p>
              <Link to="/login" className="btn btn-primary">
                Back to Login
              </Link>
            </div>
          </div>
        ) : (
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
                value={email}
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
                {loading ? "Sending..." : "Send Reset Instructions"}
              </span>
            </button>
          </form>
        )}

        {!success && (
          <div className="auth-link">
            Remember your password? <Link to="/login">Sign in</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
