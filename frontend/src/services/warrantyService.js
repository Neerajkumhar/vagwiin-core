import axios from 'axios';
import { BASE_URL } from '../config';

const API_URL = `${BASE_URL}/warranties`;

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const warrantyService = {
    getAllWarranties: async () => {
        const response = await axios.get(API_URL, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    getMyWarranties: async () => {
        const response = await axios.get(`${API_URL}/mywarranties`, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    searchWarranty: async (serialNumber) => {
        const response = await axios.get(`${API_URL}/search/${serialNumber}`);
        return response.data;
    },

    upgradeWarranty: async (data) => {
        const response = await axios.post(`${API_URL}/upgrade`, data, {
            headers: getAuthHeader()
        });
        return response.data;
    }
};

export default warrantyService;
