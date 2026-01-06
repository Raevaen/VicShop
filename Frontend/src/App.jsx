import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MsalProvider, useMsal, useIsAuthenticated } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig, msalInstance } from "./authConfig";
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Profile from './pages/Profile';
import ProductDetail from './pages/ProductDetail';
import { CartProvider } from './context/CartContext';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import CheckoutSuccess from './pages/CheckoutSuccess';
import CheckoutFailed from './pages/CheckoutFailed';
import './index.css';
import api from './services/api';

const UserSync = () => {
    const { instance, accounts } = useMsal();
    const isAuthenticated = useIsAuthenticated();
    const [synced, setSynced] = useState(false);

    useEffect(() => {
        const syncUser = async () => {
            if (isAuthenticated && accounts.length > 0 && !synced) {
                try {
                    // Force token acquisition to ensure we have valid headers
                    const request = {
                        scopes: ["https://salentech.onmicrosoft.com/54468cdb-3861-473d-aafc-de17f496bd4c/access_as_user"], 
                        account: accounts[0]
                    };
                    // In a real interceptor setup this might be handled, but explicit call here ensures it happens
                    await api.post('/users/sync'); 
                    console.log("User synced with backend");
                    setSynced(true);
                } catch (error) {
                    console.error("User sync failed", error);
                }
            }
        };
        syncUser();
    }, [isAuthenticated, accounts, synced]);

    return null;
};

function App() {
  return (
    <MsalProvider instance={msalInstance}>
      <CartProvider>
        <UserSync />
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:slug" element={<ProductDetail />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/checkout/success" element={<CheckoutSuccess />} />
          </Routes>
        </Router>
      </CartProvider>
    </MsalProvider>
  );
}

export default App;
