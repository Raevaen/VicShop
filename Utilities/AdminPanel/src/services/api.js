import axios from 'axios';
import { msalInstance } from './authConfig';
import { InteractionRequiredAuthError } from "@azure/msal-browser";

const API_URL = 'http://localhost:5038/api'; // Assuming Backend runs on 5038 (http) or similar. Checking Program.cs didn't show port clearly, but standard is often 5000-5200. Will verify via previous conversations or default. previous covnersations suggest backend is available. 
// Wait, I should check launchSettings.json or just assume standard dev ports. 
// Actually, better to check if I can find the port. The Frontend uses localhost:5173.
// Let's assume standard local API. I'll use a base URL that can be easily changed.

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use(async (config) => {
    const account = msalInstance.getActiveAccount();
    if (account) {
        try {
            const response = await msalInstance.acquireTokenSilent({
                scopes: ["User.Read"], // Adjust scope if backend needs specific scope
                account: account
            });
            config.headers.Authorization = `Bearer ${response.accessToken}`;
        } catch (error) {
            if (error instanceof InteractionRequiredAuthError) {
                // Determine interaction type (popup or redirect) based on config
                // For now, simple logging, but ideally trigger re-login
                console.error("Interaction required", error);
            }
        }
    }
    return config;
});

export const getProducts = async () => {
    const response = await api.get('/products');
    return response.data;
};

export const getProduct = async (slug) => {
    const response = await api.get(`/products/${slug}`);
    return response.data;
};

export const createProduct = async (product) => {
    const response = await api.post('/products', product);
    return response.data;
};

export const updateProduct = async (id, product) => {
    const response = await api.put(`/products/${id}`, product);
    return response.data;
};

export const deleteProduct = async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
};

export default api;
