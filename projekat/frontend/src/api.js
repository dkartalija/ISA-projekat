import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:8080/api',
});

API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

API.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refreshToken');

            if (refreshToken) {
                try {
                    const res = await axios.post('http://localhost:8080/api/auth/refresh', {
                        refreshToken: refreshToken
                    });

                    const newToken = res.data.token || res.data.accessToken;

                    if (newToken) {
                        localStorage.setItem('token', newToken);
                        originalRequest.headers.Authorization = `Bearer ${newToken}`;
                        return API(originalRequest);
                    }
                } catch (refreshError) {
                    console.error('Refresh token je istekao ili je nevažeći:', refreshError);

                    localStorage.removeItem('token');
                    localStorage.removeItem('refreshToken');
                    localStorage.removeItem('role');
                    window.location.reload();
                }
            }
        }

        return Promise.reject(error);
    }
);

export default API;