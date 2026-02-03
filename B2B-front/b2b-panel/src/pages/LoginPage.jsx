import './LoginPage.css';

import React, { useState } from 'react';

import api from '../api/axiosConfigs';
import logoRazy from '../assets/RazyLogo.png';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

 const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  if (!/^9\d{9}$/.test(phoneNumber)) {
    setError("شماره باید ۱۰ رقم باشد و با ۹ شروع شود (مثال: 9121234567)");
    setLoading(false);
    return;
  }

  const formattedMobile = '0' + phoneNumber;

  try {
    localStorage.setItem('tempMobile', formattedMobile);

    // ✅ فقط مسیر نسبی (با baseURL /api)
    const response = await api.post('/b2b/Customer/SignIn', {
      PhoneNumber: formattedMobile
    });

    if (response.status === 200) {
      navigate('/verify');
    }
  } catch (err) {
    // ✅ پیام واقعی سرور (برای 400)
    const msg = err.response?.data?.message || '';
    const errors = err.response?.data?.errors || [];
    const combined = [msg, ...errors].filter(Boolean).join(' - ');

    if (err.response?.status === 400) {
      // اگر سرور گفت ثبت نام کن
      if (combined.includes('ثبت') || combined.includes('نام')) {
        setError('این شماره ثبت‌نام نشده. لطفاً ابتدا ثبت‌نام کنید.');
        // اگر خواستی خودکار ببر ثبت نام:
        // navigate('/register');
      } else if (combined) {
        setError(combined);
      } else {
        setError('درخواست نامعتبر است. شماره را بررسی کنید.');
      }
    } else {
      setError('خطای سرور/اتصال. دوباره تلاش کنید.');
    }
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="login-container">
      <div className="login-card">
        <div className="logo-container">
          <img src={logoRazy} alt="رازی" className="logo-img" />
        </div>

        <h2 className="login-title">ورود</h2>
        <p className="login-subtitle">جهت ورود به پنل، شماره همراه خود را وارد کنید</p>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label className="login-label">شماره همراه</label>
            <div className="phone-input-container">
              <div className="country-code">+۹۸</div>
              <input
                type="text"
                maxLength="10"
                className="phone-input"
                placeholder="9151268997"
                value={phoneNumber}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9]/g, '');
                  setPhoneNumber(val);
                }}
              />
            </div>
          </div>

          {error && <p className="error-text-small" style={{color: 'red', fontSize: '12px'}}>{error}</p>}

          <button type="submit" className="main-button" disabled={loading}>
            {loading ? 'در حال ارسال...' : 'ارسال کد تایید'}
          </button>
        </form>

        <p className="footer-text">
          هنوز ثبت‌نام نکرده‌اید؟
          <span onClick={() => navigate('/register')} className="link-text" style={{cursor: 'pointer', color: '#f27a1a'}}> ثبت‌نام</span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
