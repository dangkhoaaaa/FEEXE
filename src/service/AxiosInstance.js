import axios from 'axios';
import { RYI_URL } from '../URL_BE/urlbackend';

const axiosInstance = axios.create({
    baseURL: RYI_URL,
    withCredentials: true,
});

export default axiosInstance;
