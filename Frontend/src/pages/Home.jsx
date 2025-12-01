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

                <div className="filters-container">
                    <select 
                        className="filter-select"
                        onChange={(e) => {
                            const val = e.target.value;
                            setProducts([]); // Clear current products
                            setLoading(true);
                            getProducts({ team: val }).then(data => {
                                setProducts(data);
                                setLoading(false);
                            });
                        }}
                    >
                        <option value="">All Teams</option>
                        <option value="AC Milan">AC Milan</option>
                        <option value="Manchester United">Manchester United</option>
                        <option value="Real Madrid">Real Madrid</option>
                    </select>

                    <select 
                        className="filter-select"
                        onChange={(e) => {
                            const val = e.target.value;
                            setProducts([]);
                            setLoading(true);
                            getProducts({ league: val }).then(data => {
                                setProducts(data);
                                setLoading(false);
                            });
                        }}
                    >
                        <option value="">All Leagues</option>
                        <option value="Serie A">Serie A</option>
                        <option value="Premier League">Premier League</option>
                        <option value="La Liga">La Liga</option>
                    </select>
                </div>
                
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
