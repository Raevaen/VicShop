import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, deleteProduct } from '../services/api';
import { useNotification } from '../context/NotificationContext';

const Dashboard = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { showSuccess, showError } = useNotification();

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const data = await getProducts();
            setProducts(data);
        } catch (error) {
            console.error("Failed to load products", error);
            showError("Impossibile caricare i prodotti");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Sei sicuro di voler eliminare questo prodotto?")) {
            try {
                await deleteProduct(id);
                setProducts(products.filter(p => p.id !== id));
                showSuccess("Prodotto eliminato con successo");
            } catch (error) {
                console.error("Failed to delete product", error);
                showError("Impossibile eliminare il prodotto");
            }
        }
    };

    if (loading) return (
        <div className="loader-container">
            <div className="spinner"></div>
        </div>
    );

    return (
        <div>
            <div className="header-actions">
                <h1 className="page-title">Prodotti</h1>
                <Link to="/new" className="btn btn-primary">
                    + Aggiungi Prodotto
                </Link>
            </div>

            <div className="card">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Immagine</th>
                            <th>Nome</th>
                            <th>Squadra</th>
                            <th>Prezzo</th>
                            <th>Azioni</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product.id}>
                                <td>
                                    <img 
                                        src={product.image} 
                                        alt={product.title} 
                                        style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} 
                                    />
                                </td>
                                <td>{product.title}</td>
                                <td>{product.team}</td>
                                <td>€{product.price}</td>
                                <td style={{ display: 'flex', gap: '0.5rem' }}>
                                    <Link to={`/edit/${product.slug}`} className="btn btn-secondary" style={{ padding: '0.5rem' }}>
                                        Modifica
                                    </Link>
                                    <button 
                                        className="btn btn-danger" 
                                        style={{ padding: '0.5rem' }}
                                        onClick={() => handleDelete(product.id)}
                                    >
                                        Elimina
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {products.length === 0 && (
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                                    Nessun prodotto trovato. Aggiungine uno per iniziare!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Dashboard;
