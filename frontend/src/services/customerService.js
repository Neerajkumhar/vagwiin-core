import axios from 'axios';

const API_URL = 'http://localhost:5002/api/customers';

// Helper to get auth header
const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const getAllCustomers = async () => {
    try {
        const response = await axios.get(API_URL, {
            headers: getAuthHeader()
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

const createCustomer = async (customerData) => {
    try {
        const response = await axios.post(API_URL, customerData, {
            headers: getAuthHeader()
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

const updateCustomer = async (id, customerData) => {
    try {
        const response = await axios.patch(`${API_URL}/${id}`, customerData, {
            headers: getAuthHeader()
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

const deleteCustomer = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`, {
            headers: getAuthHeader()
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export default {
    getAllCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer
};
