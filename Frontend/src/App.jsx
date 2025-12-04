import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MsalProvider } from "@azure/msal-react";
import { msalInstance } from "./authConfig";
import Home from './pages/Home';
import Profile from './pages/Profile';
import ProductDetail from './pages/ProductDetail';
import { CartProvider } from './context/CartContext';
import Cart from './pages/Cart';
import CheckoutSuccess from './pages/CheckoutSuccess';
import CheckoutFailed from './pages/CheckoutFailed';
import './index.css';

function App() {
  return (
    <MsalProvider instance={msalInstance}>
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:slug" element={<ProductDetail />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout/success" element={<CheckoutSuccess />} />
            <Route path="/checkout/failed" element={<CheckoutFailed />} />
          </Routes>
        </Router>
      </CartProvider>
    </MsalProvider>
  );
}

export default App;
