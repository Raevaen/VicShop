import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { loginRequest } from '../authConfig';

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
    const { instance } = useMsal();
    const isAuthenticated = useIsAuthenticated();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const formatPrice = (cents) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(cents / 100);
    };

    const handleProceedToCheckout = async () => {
        setIsLoading(true);
        try {
            if (!isAuthenticated) {
                await instance.loginPopup(loginRequest);
            }
            navigate('/checkout');
        } catch (e) {
            console.error("Login failed:", e);
            // Optionally, show an error message to the user
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="page-container">
            <Navbar />
            <main className="main-content">
                <div className="cart-container">
                    <h1>Your Shopping Cart</h1>
                    
                    {cartItems.length === 0 ? (
                        <div className="empty-cart">
                            <p>Your cart is empty.</p>
                            <Link to="/" className="btn btn-primary">Start Shopping</Link>
                        </div>
                    ) : (
                        <>
                            <div className="cart-items">
                                {cartItems.map(item => (
                                    <div key={item.id} className="cart-item">
                                        <img src={item.images[0]} alt={item.title} className="cart-item-image" />
                                        <div className="cart-item-details">
                                            <h3>{item.title}</h3>
                                            <p className="cart-item-price">{formatPrice(item.priceCents)}</p>
                                        </div>
                                        <div className="cart-item-actions">
                                            <div className="quantity-controls">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    aria-label={`Decrease quantity of ${item.title}`}
                                                >-</button>
                                                <span>{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    aria-label={`Increase quantity of ${item.title}`}
                                                >+</button>
                                            </div>
                                            <button
                                                className="btn btn-sm btn-outline remove-btn"
                                                onClick={() => removeFromCart(item.id)}
                                                aria-label={`Remove ${item.title} from cart`}
                                            >Remove</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="cart-summary">
                                <div className="cart-total">
                                    <span>Total:</span>
                                    <span className="total-amount">{formatPrice(cartTotal)}</span>
                                </div>
                                <div className="cart-buttons">
                                    <button className="btn btn-outline" onClick={clearCart}>Clear Cart</button>
                                    <button
                                        className="btn btn-primary checkout-btn"
                                        onClick={handleProceedToCheckout}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? 'Authenticating...' : 'Proceed to Checkout'}
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Cart;
