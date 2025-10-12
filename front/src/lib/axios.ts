import axios from "axios";

const BASE_URL = process.env.BASE_URL;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, 
  headers: {
    "Content-Type": "application/json",
  },
});


axiosInstance.interceptors.response.use(
  response => response,
  error => {
    console.error("Axios error:", error);
    return Promise.reject(error);
  }
);

export default axiosInstance;
