import axios from 'axios';
import { BASE_URL } from '../config';

const API_URL = `${BASE_URL}/products`;

const productService = {
    getAllProducts: async (filters = {}) => {
        const params = new URLSearchParams(filters).toString();
        const response = await axios.get(`${API_URL}?${params}`);
        return response.data;
    },

    getProductById: async (id) => {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    },

    createProduct: async (productData) => {
        const response = await axios.post(API_URL, productData);
        return response.data;
    },

    updateProduct: async (id, productData) => {
        const response = await axios.put(`${API_URL}/${id}`, productData);
        return response.data;
    },

    deleteProduct: async (id) => {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    },

    uploadImages: async (files) => {
        const formData = new FormData();
        files.forEach(file => {
            formData.append('images', file);
        });
        const response = await axios.post(`${API_URL}/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    }
};

export default productService;
