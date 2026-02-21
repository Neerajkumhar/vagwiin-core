import axios from 'axios';
import { BASE_URL } from '../config';

const API_URL = `${BASE_URL}/auth`; // Pointing to auth routes as implemented

const userService = {
    getAllTechnicians: async () => {
        const response = await axios.get(`${API_URL}/technicians`);
        return response.data;
    },

    addTechnician: async (techData) => {
        const response = await axios.post(`${API_URL}/add-technician`, techData);
        return response.data;
    }
};

export default userService;
