import React, { useState, useCallback } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ForgotPassword from "./components/ForgotPassword";
import Dashboard from "./components/Dashboard";
import Notification from "./components/Notification";
import PrivateRoute from "./utils/PrivateRoute";

function App() {
  const [notifications, setNotifications] = useState([]);

  const showNotification = useCallback(
    ({ type, title, message, duration = 5000 }) => {
      const id = Date.now();
      setNotifications((prev) => [
        ...prev,
        { id, type, title, message, duration },
      ]);
    },
    []
  );

  const removeNotification = useCallback((id) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  }, []);

  return (
    <Router>
      <div className="App">
        {/* Notifications */}
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            {...notification}
            onClose={() => removeNotification(notification.id)}
          />
        ))}

        <Routes>
          <Route
            path="/login"
            element={<Login showNotification={showNotification} />}
          />
          <Route
            path="/signup"
            element={<Signup showNotification={showNotification} />}
          />
          <Route
            path="/forgot-password"
            element={<ForgotPassword showNotification={showNotification} />}
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard showNotification={showNotification} />
              </PrivateRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
