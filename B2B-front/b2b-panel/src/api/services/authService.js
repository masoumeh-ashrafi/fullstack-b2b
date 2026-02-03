import api from '../axiosConfigs';

export const loginUser = async (username, password) => {
  try {
    // ارسال درخواست POST به آدرسی که در فایل JSON بود
    const response = await api.post('/b2b/Account/signIn', {
      username: username,
      password: password
    });
    
    // اگر ورود موفق بود، توکن را در حافظه مرورگر ذخیره می‌کنیم
    if (response.data && response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    
    return response.data;
  } catch (error) {
    throw error;
  }
};