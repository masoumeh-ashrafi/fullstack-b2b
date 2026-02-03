import axios from 'axios';

const api = axios.create({
  // آدرس بک‌ند FastAPI که روی سیستم خودت اجرا شده
  baseURL: 'http://127.0.0.1:8000/api', 
  headers: {
    'Content-Type': 'application/json',
  }
});

// این بخش برای فرستادن توکن در هر درخواست حیاتی است
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    // هدر اختصاصی AppToken مطابق سرور رازی‌سافت
    config.headers['AppToken'] = token;
  }
  return config;
});

export default api;