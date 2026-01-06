import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createProduct, getProduct, updateProduct } from '../services/api';
import { useNotification } from '../context/NotificationContext';

const ProductEditor = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { showSuccess, showError } = useNotification();
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

    // Track if slug was manually edited to stop auto-generation
    const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

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
            // If editing, assume slug is "fixed" unless user changes it
            setSlugManuallyEdited(true);
        } catch (error) {
            console.error("Failed to load product", error);
            showError("Impossibile caricare il prodotto");
            navigate('/');
        } finally {
            setLoading(false);
        }
    };

    const generateSlug = (text) => {
        return text
            .toString()
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')        // Replace spaces with -
            .replace(/[^\w\-]+/g, '')    // Remove all non-word chars
            .replace(/\-\-+/g, '-');     // Replace multiple - with single -
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        setFormData(prev => {
            const newData = { ...prev, [name]: value };
            
            // Auto-generate slug from title if not manually edited
            if (name === 'title' && !slugManuallyEdited && !isEditing) {
                newData.slug = generateSlug(value);
            }
            
            return newData;
        });

        if (name === 'slug') {
            setSlugManuallyEdited(true);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        const payload = {
            ...formData,
            price: parseFloat(formData.price)
        };

        try {
            // Check slug uniqueness if creating or if slug changed during edit
            // Simple check: try to get product by slug. 
            // If we find one and it's not the current one (by ID), it's a conflict.
            try {
                const existingProduct = await getProduct(payload.slug);
                if (existingProduct) {
                    if (!isEditing || existingProduct.id !== formData.id) {
                        showError("Slug già esistente! Scegline un altro.");
                        setSubmitting(false);
                        return;
                    }
                }
            } catch (error) {
                // 404 means slug is free (usually), or 500 error. 
                // We assume 404 is good.
                if (error.response && error.response.status !== 404) {
                    throw error; // Rethrow real errors
                }
            }

            if (isEditing) {
                await updateProduct(formData.id, payload);
                showSuccess("Prodotto aggiornato con successo!");
            } else {
                await createProduct(payload);
                showSuccess("Prodotto creato con successo!");
            }
            navigate('/');
        } catch (error) {
            console.error("Failed to save product", error);
            showError("Errore durante il salvataggio: " + (error.response?.data?.message || error.message));
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
                            <label className="form-label">Slug (Identificativo URL)</label>
                            <input 
                                type="text" 
                                name="slug" 
                                className="form-input" 
                                value={formData.slug} 
                                onChange={handleChange} 
                                placeholder="Generato automaticamente"
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
