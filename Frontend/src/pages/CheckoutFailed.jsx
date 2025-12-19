import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const CheckoutFailed = () => {
    return (
        <div className="page-container">
            <Navbar />
            <main className="main-content">
                <div className="checkout-message-container failed">
                    <div className="icon-circle error">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <h1>Order Failed</h1>
                    <p>Something went wrong while processing your order. Please try again later.</p>
                    <div className="actions">
                        <Link to="/cart" className="btn btn-primary">Return to Cart</Link>
                        <Link to="/" className="btn btn-outline">Continue Shopping</Link>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CheckoutFailed;
