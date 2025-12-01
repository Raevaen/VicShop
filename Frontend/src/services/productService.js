import api from './api';

export const getProducts = async (filters = {}) => {
    try {
        const params = new URLSearchParams();
        if (filters.team) params.append('team', filters.team);
        if (filters.league) params.append('league', filters.league);

        const response = await api.get(`/products?${params.toString()}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching products:", error);
        // Return mock data if API fails (for demonstration purposes)
        return [
            {
                id: "1",
                title: "Premium Wireless Headphones",
                description: "Experience high-fidelity sound with our latest noise-cancelling headphones.",
                priceCents: 29999,
                images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aGVhZHBob25lc3xlbnwwfHwwfHx8MA%3D%3D"],
                slug: "headphones"
            },
            {
                id: "2",
                title: "Smart Watch Series X",
                description: "Stay connected and healthy with the advanced tracking features.",
                priceCents: 39999,
                images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHNtYXJ0JTIwd2F0Y2h8ZW58MHx8MHx8fDA%3D"],
                slug: "smart-watch"
            },
            {
                id: "3",
                title: "Ergonomic Office Chair",
                description: "Work in comfort with our fully adjustable ergonomic chair.",
                priceCents: 19999,
                images: ["https://images.unsplash.com/photo-1592078615290-033ee584e267?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Y2hhaXJ8ZW58MHx8MHx8fDA%3D"],
                slug: "office-chair"
            }
        ];
    }
};
