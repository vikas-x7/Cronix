import axios from "axios";

const api = axios.create({
    baseURL: "/api",
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 30000,
});

// Response interceptor for consistent error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            const message = error.response.data?.error || "Something went wrong";
            return Promise.reject(new Error(message));
        }
        if (error.request) {
            return Promise.reject(new Error("Network error. Please check your connection."));
        }
        return Promise.reject(error);
    }
);

export default api;
