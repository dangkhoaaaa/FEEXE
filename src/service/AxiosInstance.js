import axios from 'axios';
import { RYI_URL } from '../URL_BE/urlbackend';

const axiosInstance = axios.create({
    baseURL: RYI_URL,
    withCredentials: true,
});


axiosInstance.interceptors.request.use(
    async (config) => {
        const token = await localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
export default axiosInstance;
