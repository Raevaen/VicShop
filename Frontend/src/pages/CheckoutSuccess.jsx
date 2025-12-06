import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const CheckoutSuccess = () => {
    const { clearCart } = useCart();

    useEffect(() => {
        // Clear cart on success
        clearCart();
    }, [clearCart]);

    return (
        <div className="page-container">
            <Navbar />
            <main className="main-content">
                <div className="checkout-result">
                    <div className="success-icon">✓</div>
                    <h1>Payment Successful!</h1>
                    <p>Thank you for your order. Your payment has been processed successfully.</p>
                    <p>You will receive a confirmation email shortly.</p>
                    <Link to="/" className="btn btn-primary">Continue Shopping</Link>
                </div>
            </main>
        </div>
    );
};

export default CheckoutSuccess;
