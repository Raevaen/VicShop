import api from './api';

const MOCK_PRODUCTS = [
    {
        id: "1",
        title: "AC Milan Home Kit 23/24",
        description: "The classic Rossoneri stripes. Official home jersey for the 2023/24 season.",
        priceCents: 8999,
        images: ["https://images.unsplash.com/photo-1626246968037-3323c3132646?q=80&w=1000&auto=format&fit=crop"],
        slug: "ac-milan-home-23-24",
        team: "AC Milan",
        league: "Serie A"
    },
    {
        id: "2",
        title: "AC Milan Away Kit 23/24",
        description: "Elegant white design with red and black accents.",
        priceCents: 8999,
        images: ["https://images.unsplash.com/photo-1589487391730-58f20eb2c308?q=80&w=1000&auto=format&fit=crop"],
        slug: "ac-milan-away-23-24",
        team: "AC Milan",
        league: "Serie A"
    },
    {
        id: "3",
        title: "Manchester United Home Kit 23/24",
        description: "Iconic red devils home jersey.",
        priceCents: 9499,
        images: ["https://images.unsplash.com/photo-1627636186837-25e227092147?q=80&w=1000&auto=format&fit=crop"],
        slug: "man-utd-home-23-24",
        team: "Manchester United",
        league: "Premier League"
    },
    {
        id: "4",
        title: "Manchester United Third Kit 23/24",
        description: "Striking white alternative kit.",
        priceCents: 9499,
        images: ["https://images.unsplash.com/photo-1565538420072-9118c8e47453?q=80&w=1000&auto=format&fit=crop"],
        slug: "man-utd-third-23-24",
        team: "Manchester United",
        league: "Premier League"
    },
    {
        id: "5",
        title: "Real Madrid Home Kit 23/24",
        description: "Royal white. The classic Real Madrid look.",
        priceCents: 9999,
        images: ["https://images.unsplash.com/photo-1556909212-d5b604d0c90d?q=80&w=1000&auto=format&fit=crop"],
        slug: "real-madrid-home-23-24",
        team: "Real Madrid",
        league: "La Liga"
    },
    {
        id: "6",
        title: "Real Madrid Away Kit 23/24",
        description: "Stylish navy blue away jersey.",
        priceCents: 9999,
        images: ["https://images.unsplash.com/photo-1614632537423-1e6c2e7e0aab?q=80&w=1000&auto=format&fit=crop"],
        slug: "real-madrid-away-23-24",
        team: "Real Madrid",
        league: "La Liga"
    }
];

export const getProducts = async (filters = {}) => {
    try {
        const params = new URLSearchParams();
        if (filters.team) params.append('team', filters.team);
        if (filters.league) params.append('league', filters.league);

        const response = await api.get(`/products?${params.toString()}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching products:", error);
        
        // Filter mock data
        let filteredProducts = [...MOCK_PRODUCTS];

        if (filters.team) {
            filteredProducts = filteredProducts.filter(p => p.team === filters.team);
        }

        if (filters.league) {
            filteredProducts = filteredProducts.filter(p => p.league === filters.league);
        }

        return filteredProducts;
    }
};

export const getProductBySlug = async (slug) => {
    try {
        const response = await api.get(`/products/${slug}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching product ${slug}:`, error);
        return MOCK_PRODUCTS.find(p => p.slug === slug) || null;
    }
};
