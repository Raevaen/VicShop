import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../services/productService';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            const data = await getProducts();
            setProducts(data);
            setLoading(false);
        };

        fetchProducts();
    }, []);

    return (
        <div className="page-container">
            <Navbar />
            <main className="main-content">
                <header className="hero-section">
                    <h1>Welcome to VicShop</h1>
                    <p>Discover premium products for your lifestyle.</p>
                </header>
                
                {loading ? (
                    <div className="loading-spinner">Loading products...</div>
                ) : (
                    <div className="product-grid">
                        {products.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Home;
