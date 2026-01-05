import axios from 'axios';
import { msalInstance, loginRequest } from '../authConfig';
import { InteractionRequiredAuthError } from "@azure/msal-browser";

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use(async (config) => {
    const account = msalInstance.getActiveAccount();
    if (account) {
        try {
            const response = await msalInstance.acquireTokenSilent({
                ...loginRequest,
                account: account
            });
            config.headers.Authorization = `Bearer ${response.accessToken}`;
        } catch (error) {
            if (error instanceof InteractionRequiredAuthError) {
                console.error("Richiesta interazione per autenticazione", error);
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
