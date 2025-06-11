import axios from 'axios';
import { toast } from 'react-toastify';

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('ACCESS_TOKEN');
    if (token) {

        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            console.log('401 occurred');
            localStorage.removeItem('ACCESS_TOKEN');
            window.location.reload();
            toast.success("Logged out");
        }
        return Promise.reject(error);
    }
);

export default axiosClient;