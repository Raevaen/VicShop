import React from 'react';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { loginRequest } from '../authConfig';
import { createOrder } from '../services/orderService';

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
    const { instance } = useMsal();
    const isAuthenticated = useIsAuthenticated();
    const navigate = useNavigate();

    const formatPrice = (cents) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(cents / 100);
    };

    const handleCheckout = async () => {
        if (!isAuthenticated) {
            try {
                await instance.loginPopup(loginRequest);
            } catch (e) {
                console.error("Login failed:", e);
                return;
            }
        }

        // Prepare order data
        const orderData = {
            items: cartItems.map(item => ({
                productId: item.id || item._id, // Handle both ID formats if necessary
                title: item.title,
                quantity: item.quantity,
                priceCents: item.priceCents
            })),
            totalAmountCents: cartTotal
        };

        try {
            await createOrder(orderData);
            clearCart();
            navigate('/checkout/success');
        } catch (error) {
            console.error("Checkout failed:", error);
            navigate('/checkout/failed');
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
                                                <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                                                <span>{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                                            </div>
                                            <button className="btn btn-sm btn-outline remove-btn" onClick={() => removeFromCart(item.id)}>Remove</button>
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
                                    <Link to="/checkout" className="btn btn-primary checkout-btn">Proceed to Checkout</Link>
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
