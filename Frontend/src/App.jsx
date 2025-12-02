import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MsalProvider } from "@azure/msal-react";
import { msalInstance } from "./authConfig";
import Home from './pages/Home';
import Profile from './pages/Profile';
import ProductDetail from './pages/ProductDetail';
import './index.css';

function App() {
  return (
    <MsalProvider instance={msalInstance}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Router>
    </MsalProvider>
  );
}

export default App;
