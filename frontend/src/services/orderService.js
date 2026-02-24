import axios from 'axios';
import { BASE_URL } from '../config';

const API_URL = `${BASE_URL}/orders`;
const ADMIN_API_URL = `${BASE_URL}/admin/orders`;

// Helper to get auth header
const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const orderService = {
    createOrder: async (orderData) => {
        const response = await axios.post(API_URL, orderData, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    getMyOrders: async () => {
        const response = await axios.get(`${API_URL}/myorders`, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    getOrderDetails: async (id) => {
        const response = await axios.get(`${API_URL}/${id}`, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    getAllOrders: async () => {
        const response = await axios.get(ADMIN_API_URL, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    updateOrderStatus: async (id, status) => {
        const response = await axios.put(`${ADMIN_API_URL}/${id}/status`, { status }, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    updateOrderSerialNumber: async (id, itemSerials) => {
        const response = await axios.put(`${ADMIN_API_URL}/${id}/serial-number`, { itemSerials }, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    deleteOrder: async (id) => {
        const response = await axios.delete(`${ADMIN_API_URL}/${id}`, {
            headers: getAuthHeader()
        });
        return response.data;
    }
};

export default orderService;
