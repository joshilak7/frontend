import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

// Set API URL from environment or default
if (!process.env.REACT_APP_API_URL) {
  process.env.REACT_APP_API_URL = "http://localhost:5000/api";
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
