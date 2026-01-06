import React from 'react';
import { Link } from 'react-router-dom';
import { useMsal } from "@azure/msal-react";

const Navbar = () => {
    const { instance, accounts } = useMsal();
    
    const handleLogout = () => {
        instance.logoutPopup();
    };

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-brand">VicShop Amministrazione</Link>
            <div className="nav-user">
                <span style={{ color: 'var(--text-secondary)' }}>
                    {accounts[0]?.name}
                </span>
                <button className="btn btn-secondary" onClick={handleLogout}>
                    Esci
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
