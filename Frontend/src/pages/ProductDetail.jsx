import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getProductBySlug } from '../services/productService';
import { useCart } from '../context/CartContext';

const ProductDetail = () => {
    const { slug } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchProduct = async () => {
            const data = await getProductBySlug(slug);
            setProduct(data);
            setLoading(false);
        };
        fetchProduct();
    }, [slug]);

    if (loading) return <div className="loading-spinner">Loading...</div>;
    if (!product) return <div className="error-message">Product not found</div>;

    const formatPrice = (cents) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(cents / 100);
    };

    return (
        <div className="page-container">
            <Navbar />
            <main className="main-content">
                <div className="product-detail-container">
                    <div className="product-detail-image">
                        <img src={product.images[0]} alt={product.title} />
                    </div>
                    <div className="product-detail-info">
                        <div className="detail-header">
                            <h1 className="detail-title">{product.title}</h1>
                            <div className="detail-meta">
                                {product.team && <span className="meta-tag team-tag">{product.team}</span>}
                                {product.season && <span className="meta-tag season-tag">{product.season}</span>}
                            </div>
                        </div>

                        <div className="detail-price">{formatPrice(product.priceCents)}</div>

                        <div className="detail-attributes">
                            {product.condition && (
                                <div className="attribute-item">
                                    <span className="attribute-label">Condition</span>
                                    <span className="attribute-value">{product.condition}</span>
                                </div>
                            )}
                            {product.size && (
                                <div className="attribute-item">
                                    <span className="attribute-label">Size</span>
                                    <span className="attribute-value">{product.size}</span>
                                </div>
                            )}
                            {product.brand && (
                                <div className="attribute-item">
                                    <span className="attribute-label">Brand</span>
                                    <span className="attribute-value">{product.brand}</span>
                                </div>
                            )}
                            {product.league && (
                                <div className="attribute-item">
                                    <span className="attribute-label">League</span>
                                    <span className="attribute-value">{product.league}</span>
                                </div>
                            )}
                        </div>

                        <div className="detail-description">
                            <h3>Description</h3>
                            <p>{product.description}</p>
                        </div>

                        <div className="detail-actions">
                            <button className="btn btn-primary btn-lg" onClick={() => addToCart(product)}>Add to Cart</button>
                            <Link to="/" className="btn btn-outline">Back to Shop</Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ProductDetail;
