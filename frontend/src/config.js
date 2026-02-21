export const BASE_URL = import.meta.env.VITE_API_URL ||
    (import.meta.env.MODE === 'production'
        ? 'https://vagwiin-core.onrender.com/api'
        : 'http://localhost:5002/api');
