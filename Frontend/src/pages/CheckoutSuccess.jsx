import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const CheckoutSuccess = () => {
    return (
        <div className="page-container">
            <Navbar />
            <main className="main-content">
                <div className="checkout-message-container success">
                    <div className="icon-circle">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                    </div>
                    <h1>Order Placed Successfully!</h1>
                    <p>Thank you for your purchase. Your order has been received and is being processed.</p>
                    <div className="actions">
                        <Link to="/" className="btn btn-primary">Continue Shopping</Link>
                        <Link to="/profile" className="btn btn-outline">View My Orders</Link>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CheckoutSuccess;
