import React, { useEffect, useState } from 'react';
import { useMsal } from "@azure/msal-react";
import Navbar from '../components/Navbar';
import { getMyOrders } from '../services/orderService';

const Profile = () => {
    const { accounts } = useMsal();
    const user = accounts[0];
    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(true);

    useEffect(() => {
        if (user) {
            const fetchOrders = async () => {
                try {
                    const data = await getMyOrders();
                    setOrders(data);
                } catch (error) {
                    console.error("Failed to fetch orders", error);
                } finally {
                    setLoadingOrders(false);
                }
            };
            fetchOrders();
        }
    }, [user]);

    const formatPrice = (cents) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(cents / 100);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

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
                    
                    <div className="profile-grid">
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

                        <div className="order-history-section">
                            <h3>Order History</h3>
                            {loadingOrders ? (
                                <p>Loading orders...</p>
                            ) : orders.length === 0 ? (
                                <p className="no-orders">No orders found.</p>
                            ) : (
                                <div className="order-list">
                                    {orders.map(order => (
                                        <div key={order.id} className="order-card">
                                            <div className="order-header">
                                                <div>
                                                    <span className="order-date">{formatDate(order.createdAt)}</span>
                                                    <span className="order-id">#{order.id.slice(-6)}</span>
                                                </div>
                                                <span className={`order-status status-${order.status.toLowerCase()}`}>{order.status}</span>
                                            </div>
                                            <div className="order-items-list">
                                                {order.items.map((item, index) => (
                                                    <div key={index} className="order-item-summary">
                                                        <span>{item.quantity}x {item.title}</span>
                                                        <span>{formatPrice(item.priceCents)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="order-footer">
                                                <span>Total</span>
                                                <span className="order-total">{formatPrice(order.totalAmountCents)}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Profile;
