import axios from 'axios';

const API_URL = 'http://localhost:5002/api/cart';

// Helper to get auth header
const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const cartService = {
    getCart: async () => {
        const response = await axios.get(API_URL, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    addToCart: async (productId, quantity = 1) => {
        const response = await axios.post(`${API_URL}/add`,
            { productId, quantity },
            { headers: getAuthHeader() }
        );
        return response.data;
    },

    updateQuantity: async (productId, quantity) => {
        const response = await axios.patch(`${API_URL}/update`,
            { productId, quantity },
            { headers: getAuthHeader() }
        );
        return response.data;
    },

    removeFromCart: async (productId) => {
        const response = await axios.delete(`${API_URL}/remove/${productId}`, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    clearCart: async () => {
        const response = await axios.delete(`${API_URL}/clear`, {
            headers: getAuthHeader()
        });
        return response.data;
    }
};

export default cartService;
