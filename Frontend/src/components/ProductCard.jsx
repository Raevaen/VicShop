import React from 'react';

const ProductCard = ({ product }) => {
    const formatPrice = (cents) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(cents / 100);
    };

    return (
        <div className="product-card">
            <div className="product-image-container">
                <img src={product.images[0]} alt={product.title} className="product-image" />
                <div className="product-badges">
                    {product.condition && <span className="badge badge-condition">{product.condition}</span>}
                    {product.size && <span className="badge badge-size">{product.size}</span>}
                </div>
            </div>
            <div className="product-details">
                <div className="product-meta">
                    {product.team && <span className="product-team">{product.team}</span>}
                    {product.season && <span className="product-season">{product.season}</span>}
                </div>
                <h3 className="product-title">{product.title}</h3>
                <p className="product-description">{product.description}</p>
                <div className="product-footer">
                    <span className="product-price">{formatPrice(product.priceCents)}</span>
                    <button className="btn btn-sm btn-primary">Add to Cart</button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
