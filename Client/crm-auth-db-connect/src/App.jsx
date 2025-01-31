
// src/App.jsx
import React, { useState } from 'react';
import { AuthProvider } from './components/auth/AuthContext';
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard';


import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <Router>
    <AuthProvider>
      <div>
        {!isLoggedIn ? (
          <Login onLogin={handleLogin} />
        ) : (
          <Dashboard />
        )}
      </div>
    </AuthProvider>
    </Router>
  );
};

export default App;