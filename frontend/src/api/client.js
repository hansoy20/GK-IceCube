import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

const client = axios.create({ baseURL: API_BASE_URL });

client.interceptors.request.use((config) => {
  const token = localStorage.getItem("gk_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Surface the backend's plain-English message on error, falling back to a generic one.
client.interceptors.response.use(
  (res) => res,
  (error) => {
    const message = error.response?.data?.message || "Something went wrong. Please try again.";
    return Promise.reject(new Error(message));
  }
);

export default client;
