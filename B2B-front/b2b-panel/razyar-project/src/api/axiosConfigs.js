// src/api/axiosConfigs.js

import axios from "axios";

const api = axios.create({
  baseURL: "https://mws.razysoft.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// همیشه توکن را با نام صحیح هدر ارسال کن: Apptoken
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    const cleanToken = token?.trim();

    if (cleanToken) {
      config.headers.Apptoken = cleanToken; // ✅ مهم: دقیقاً همین اسم
    } else {
      delete config.headers.Apptoken;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
