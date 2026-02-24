import axios from "axios";
import {clearToken, getToken} from "@/utils";


const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3000",
    headers: { "Content-Type": "application/json" },
});

// Добавляем JWT токен к каждому запросу
axiosInstance.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Если токен протух — чистим и редиректим на авторизацию
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
            clearToken();
            window.location.href = "/splash";
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;