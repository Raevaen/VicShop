import api from './api';

export const createOrder = async (orderData) => {
    try {
        const response = await api.post('/orders', orderData);
        return response.data;
    } catch (error) {
        console.error("Error creating order:", error);
        throw error;
    }
};

export const getMyOrders = async () => {
    try {
        const response = await api.get('/orders');
        return response.data;
    } catch (error) {
        console.error("Error fetching orders:", error);
        return [];
    }
};
