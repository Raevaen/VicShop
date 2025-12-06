import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { useMsal } from "@azure/msal-react";
import api from '../services/api';

const Checkout = () => {
    const { cartItems, cartTotal, clearCart } = useCart();
    const { instance, accounts } = useMsal();
    const navigate = useNavigate();
    const [processing, setProcessing] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        address: '',
        city: '',
        zipCode: ''
    });

    const formatPrice = (cents) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(cents / 100);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);

        try {
            // Get access token
            const tokenResponse = await instance.acquireTokenSilent({
                scopes: ["User.Read"],
                account: accounts[0]
            });

            // Prepare order data
            const orderData = {
                items: cartItems.map(item => ({
                    productId: item.id,
                    title: item.title,
                    quantity: item.quantity,
                    priceCents: item.priceCents
                })),
                totalAmountCents: cartTotal,
                shippingAddress: `${formData.fullName}, ${formData.address}, ${formData.city} ${formData.zipCode}`,
                redirectUrl: `${window.location.origin}/checkout/success`
            };

            // Create payment
            const response = await api.post('/payments/create', orderData, {
                headers: {
                    Authorization: `Bearer ${tokenResponse.accessToken}`
                }
            });

            // Redirect to Mollie payment page
            window.location.href = response.data.paymentUrl;
        } catch (error) {
            console.error('Payment creation failed:', error);
            alert('Payment failed. Please try again.');
            setProcessing(false);
        }
    };

    if (cartItems.length === 0) {
        navigate('/cart');
        return null;
    }

    return (
        <div className="page-container">
            <Navbar />
            <main className="main-content">
                <div className="checkout-container">
                    <h1>Checkout</h1>
                    <div className="checkout-grid">
                        <div className="checkout-form-section">
                            <h2>Shipping Information</h2>
                            <form id="checkout-form" onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label>Full Name</label>
                                    <input 
                                        type="text" 
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        required 
                                        className="form-input" 
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Address</label>
                                    <input 
                                        type="text" 
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        required 
                                        className="form-input" 
                                    />
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>City</label>
                                        <input 
                                            type="text" 
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            required 
                                            className="form-input" 
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Zip Code</label>
                                        <input 
                                            type="text" 
                                            name="zipCode"
                                            value={formData.zipCode}
                                            onChange={handleChange}
                                            required 
                                            className="form-input" 
                                        />
                                    </div>
                                </div>
                                
                                <div className="mollie-notice">
                                    <p>You will be redirected to Mollie to complete your payment securely.</p>
                                </div>
                                
                                <button type="submit" className="btn btn-primary btn-block" disabled={processing}>
                                    {processing ? 'Redirecting to payment...' : `Pay ${formatPrice(cartTotal)}`}
                                </button>
                            </form>
                        </div>
                        
                        <div className="order-summary">
                            <h3>Order Summary</h3>
                            <div className="cart-items-summary">
                                {cartItems.map(item => (
                                    <div key={item.id} className="summary-item">
                                        <span>{item.title} x {item.quantity}</span>
                                        <span>{formatPrice(item.priceCents * item.quantity)}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="summary-row">
                                <span>Subtotal</span>
                                <span>{formatPrice(cartTotal)}</span>
                            </div>
                            <div className="summary-row">
                                <span>Shipping</span>
                                <span>Free</span>
                            </div>
                            <div className="summary-total">
                                <span>Total</span>
                                <span>{formatPrice(cartTotal)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Checkout;
