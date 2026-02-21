import axios from 'axios';

const API_URL = 'http://localhost:5002/api';

const authService = {
    signup: async (userData) => {
        const response = await axios.post(`${API_URL}/auth/signup`, userData);
        if (response.data.token) {
            localStorage.setItem('user', JSON.stringify(response.data.data.user));
            localStorage.setItem('token', response.data.token);
        }
        return response.data;
    },

    login: async (userData) => {
        const response = await axios.post(`${API_URL}/auth/login`, userData);
        if (response.data.token) {
            localStorage.setItem('user', JSON.stringify(response.data.data.user));
            localStorage.setItem('token', response.data.token);
        }
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    },

    updateProfile: async (userData) => {
        const response = await axios.put(`${API_URL}/auth/update-profile`, userData);
        if (response.data.data.user) {
            localStorage.setItem('user', JSON.stringify(response.data.data.user));
        }
        return response.data;
    },

    getCurrentUser: () => {
        try {
            const user = localStorage.getItem('user');
            const token = localStorage.getItem('token');
            if (!user || !token || user === 'undefined' || user === 'null') {
                return null;
            }
            const parsedUser = JSON.parse(user);
            // Ensure parsedUser is a valid object and not empty
            if (!parsedUser || typeof parsedUser !== 'object' || Object.keys(parsedUser).length === 0) {
                return null;
            }
            return parsedUser;
        } catch (error) {
            console.error('Error parsing user from localStorage:', error);
            return null;
        }
    },
    getNotifications: async () => {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/auth/notifications`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },
    markNotificationAsRead: async (id) => {
        const token = localStorage.getItem('token');
        const response = await axios.put(`${API_URL}/auth/notifications/${id}/read`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },
};

export default authService;
