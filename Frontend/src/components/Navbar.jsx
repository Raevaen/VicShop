import React from 'react';
import { Link } from 'react-router-dom';
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { loginRequest } from '../authConfig';

const Navbar = () => {
    const { instance, accounts } = useMsal();
    const isAuthenticated = useIsAuthenticated();

    const handleLogin = () => {
        instance.loginPopup(loginRequest).catch(e => {
            console.error(e);
        });
    };

    const handleLogout = () => {
        instance.logoutPopup().catch(e => {
            console.error(e);
        });
    };

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-brand">VicShop</Link>
            <div className="navbar-menu">
                {isAuthenticated ? (
                    <div className="user-info">
                        <Link to="/profile" className="nav-link">Profile</Link>
                        <span>Hello, {accounts[0]?.name}</span>
                        <button className="btn btn-outline" onClick={handleLogout}>Logout</button>
                    </div>
                ) : (
                    <button className="btn btn-primary" onClick={handleLogin}>Login</button>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
