import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MsalProvider, AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from "@azure/msal-react";
import { msalInstance } from './authConfig';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import ProductEditor from './pages/ProductEditor';
import './App.css';

const MainContent = () => {
  return (
    <div className="app-container">
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/new" element={<ProductEditor />} />
          <Route path="/edit/:slug" element={<ProductEditor />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
};

const Login = () => {
    const { instance } = useMsal();
    
    const handleLogin = () => {
        instance.loginPopup().catch(e => {
            console.error(e);
        });
    };

    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
            <h1>Admin Access Required</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Please login to manage the shop.</p>
            <button className="btn btn-primary" onClick={handleLogin}>Log In with Microsoft</button>
        </div>
    );
};

function App() {
  return (
    <MsalProvider instance={msalInstance}>
      <AuthenticatedTemplate>
        <BrowserRouter>
            <MainContent />
        </BrowserRouter>
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <Login />
      </UnauthenticatedTemplate>
    </MsalProvider>
  );
}

export default App;
