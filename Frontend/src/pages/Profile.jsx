import React from 'react';
import { useMsal } from "@azure/msal-react";
import Navbar from '../components/Navbar';

const Profile = () => {
    const { accounts } = useMsal();
    const user = accounts[0];

    if (!user) {
        return (
            <div className="page-container">
                <Navbar />
                <main className="main-content">
                    <div className="auth-warning">
                        <h2>Please log in to view your profile.</h2>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="page-container">
            <Navbar />
            <main className="main-content">
                <div className="profile-container">
                    <div className="profile-header">
                        <h1>Personal Area</h1>
                        <p>Manage your account details and preferences.</p>
                    </div>
                    
                    <div className="profile-card">
                        <div className="profile-section">
                            <h3>Account Information</h3>
                            <div className="profile-field">
                                <label>Display Name</label>
                                <div className="field-value">{user.name}</div>
                            </div>
                            <div className="profile-field">
                                <label>Username / Email</label>
                                <div className="field-value">{user.username}</div>
                            </div>
                            <div className="profile-field">
                                <label>User ID (Subject)</label>
                                <div className="field-value">{user.localAccountId || user.homeAccountId}</div>
                            </div>
                            <div className="profile-field">
                                <label>Tenant ID</label>
                                <div className="field-value">{user.tenantId}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Profile;
