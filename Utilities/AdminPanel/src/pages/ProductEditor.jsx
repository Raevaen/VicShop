import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createProduct, getProduct, updateProduct } from '../services/api';

const ProductEditor = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const isEditing = !!slug;

    const [loading, setLoading] = useState(isEditing);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        team: '',
        league: '',
        price: '',
        image: '',
        slug: '',
        description: ''
    });

    useEffect(() => {
        if (isEditing) {
            loadProduct();
        }
    }, [slug]);

    const loadProduct = async () => {
        try {
            const product = await getProduct(slug);
            setFormData({
                id: product.id,
                title: product.title || '',
                team: product.team || '',
                league: product.league || '',
                price: product.price || '',
                image: product.image || '',
                slug: product.slug || '',
                description: product.description || ''
            });
        } catch (error) {
            console.error("Failed to load product", error);
            alert("Impossibile caricare il prodotto");
            navigate('/');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        const payload = {
            ...formData,
            price: parseFloat(formData.price)
        };

        try {
            if (isEditing) {
                await updateProduct(formData.id, payload);
            } else {
                await createProduct(payload);
            }
            navigate('/');
        } catch (error) {
            console.error("Failed to save product", error);
            alert("Errore durante il salvataggio: " + (error.response?.data?.message || error.message));
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="loader-container">
            <div className="spinner"></div>
        </div>
    );

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="header-actions">
                <h1 className="page-title">{isEditing ? 'Modifica Prodotto' : 'Nuovo Prodotto'}</h1>
            </div>

            <div className="card" style={{ padding: '2rem' }}>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Nome Prodotto</label>
                        <input 
                            type="text" 
                            name="title" 
                            className="form-input" 
                            value={formData.title} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div className="form-group">
                            <label className="form-label">Squadra</label>
                            <input 
                                type="text" 
                                name="team" 
                                className="form-input" 
                                value={formData.team} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Lega</label>
                            <input 
                                type="text" 
                                name="league" 
                                className="form-input" 
                                value={formData.league} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div className="form-group">
                            <label className="form-label">Prezzo (€)</label>
                            <input 
                                type="number" 
                                step="0.01"
                                name="price" 
                                className="form-input" 
                                value={formData.price} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Slug (URL identifier)</label>
                            <input 
                                type="text" 
                                name="slug" 
                                className="form-input" 
                                value={formData.slug} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">URL Immagine</label>
                        <input 
                            type="url" 
                            name="image" 
                            className="form-input" 
                            value={formData.image} 
                            onChange={handleChange} 
                            placeholder="https://example.com/image.jpg"
                            required 
                        />
                    </div>

                    {formData.image && (
                        <div className="form-group" style={{ textAlign: 'center', marginBottom: '2rem' }}>
                             <img 
                                src={formData.image} 
                                alt="Anteprima" 
                                style={{ maxHeight: '200px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }} 
                            />
                        </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                        <button 
                            type="button" 
                            className="btn btn-secondary" 
                            onClick={() => navigate('/')}
                        >
                            Annulla
                        </button>
                        <button 
                            type="submit" 
                            className="btn btn-primary"
                            disabled={submitting}
                        >
                            {submitting ? 'Salvataggio...' : (isEditing ? 'Aggiorna Prodotto' : 'Crea Prodotto')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductEditor;
