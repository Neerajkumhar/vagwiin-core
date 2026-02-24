import axios from 'axios';
import { BASE_URL } from '../config';

const API_URL = `${BASE_URL}/admin/settings`;

const getSettings = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

const updateSettings = async (settingsData) => {
    const token = localStorage.getItem('token');
    const response = await axios.put(API_URL, settingsData, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};

const settingsService = {
    getSettings,
    updateSettings
};

export default settingsService;
