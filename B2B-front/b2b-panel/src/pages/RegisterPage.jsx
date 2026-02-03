import './RegisterPage.css';

import React, { useMemo, useState } from 'react';

import api from '../api/axiosConfigs';
import logoRazy from '../assets/RazyLogo.png';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [type, setType] = useState(''); // کاربر انتخاب کند (0/1)
  const [nationalCode, setNationalCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState(''); // 10 رقم و شروع با 9
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // تبدیل اعداد فارسی به انگلیسی + حذف کاراکترهای غیر عدد
  const normalizeNumber = (v) =>
    (v || '')
      .replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d))
      .replace(/[^\d]/g, '');

  const normalizedNationalCode = useMemo(() => normalizeNumber(nationalCode), [nationalCode]);
  const normalizedPhone = useMemo(() => normalizeNumber(phoneNumber), [phoneNumber]);

  // ✅ اعتبارسنجی استاندارد کد ملی ایران (Checksum)
  const isValidIranianNationalCode = (code) => {
    const c = (code || '').toString();

    // باید دقیقاً 10 رقم باشد
    if (!/^\d{10}$/.test(c)) return false;

    // جلوگیری از کدهای تکراری (0000000000 تا 9999999999)
    if (/^(\d)\1{9}$/.test(c)) return false;

    const check = Number(c[9]);
    let sum = 0;

    // وزن‌ها: 10 تا 2
    for (let i = 0; i < 9; i++) {
      sum += Number(c[i]) * (10 - i);
    }

    const remainder = sum % 11;
    const expected = remainder < 2 ? remainder : 11 - remainder;

    return check === expected;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    // نوع کاربر
    if (type === '') {
      setError('لطفاً نوع کاربر را انتخاب کنید.');
      return;
    }

    // ✅ کد ملی: 10 رقم + چک‌سام
    if (!isValidIranianNationalCode(normalizedNationalCode)) {
      setError('کد ملی وارد شده معتبر نیست. لطفاً کد ملی صحیح ۱۰ رقمی وارد کنید.');
      return;
    }

    // خواسته شرکت: شماره 10 رقم و شروع با 9
    if (!/^9\d{9}$/.test(normalizedPhone)) {
      setError('شماره باید ۱۰ رقم باشد و با ۹ شروع شود (مثال: 9151234567)');
      return;
    }

    setLoading(true);

    // قبل ارسال: 0 اضافه شود => 09...
    const formattedMobile = '0' + normalizedPhone;

    try {
      // برای VerifyPage (خیلی مهم برای Resend ثبت‌نام)
      localStorage.setItem('tempMobile', formattedMobile);
      localStorage.setItem('verifyMode', 'signup');
      localStorage.setItem('tempNationalCode', normalizedNationalCode);
      localStorage.setItem('tempType', String(type));

      // طبق Postman: /api/b2b/Customer/SignUp
      await api.post('/b2b/Customer/SignUp', {
        PhoneNumber: formattedMobile,
        NationalCode: normalizedNationalCode,
        Type: Number(type), // 0 یا 1
      });

      navigate('/verify');
    } catch (err) {
      const msg = err.response?.data?.message || '';
      const errors = err.response?.data?.errors || [];
      const combined = [msg, ...errors].filter(Boolean).join(' - ');
      setError(combined || 'ثبت‌نام/ارسال کد با خطا مواجه شد.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <img src={logoRazy} alt="رازی" className="logo-img" />

        <h2 className="register-title">ثبت نام</h2>

        <form onSubmit={handleRegister}>
          {/* نوع کاربر */}
          <div className="input-group">
            <label className="register-label">نوع کاربر</label>
            <select
              className="register-select"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="" disabled>انتخاب کنید</option>
              <option value="0">فروشنده</option>
              <option value="1">تامین کننده</option>
            </select>
          </div>

          {/* کد ملی */}
          <div className="input-group">
            <label className="register-label">کد ملی</label>
            <input
              type="text"
              className="register-custom-input"
              placeholder="مثلاً 3861147904"
              maxLength="10"
              value={nationalCode}
              onChange={(e) => {
                // ✅ فقط عدد (فارسی/انگلیسی) + نهایتاً 10 رقم
                const cleaned = normalizeNumber(e.target.value).slice(0, 10);
                setNationalCode(cleaned);
              }}
            />
          </div>

          {/* شماره همراه */}
          <div className="input-group">
            <label className="register-label">شماره همراه</label>
            <div className="phone-input-container">
              <div className="country-code">+۹۸</div>
              <input
                type="text"
                maxLength="10"
                className="phone-input"
                placeholder="9123456789"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
            <div className="error-text-small" style={{ visibility: 'hidden' }}>.</div>
          </div>

          {error && <p className="error-text-small">{error}</p>}

          <button type="submit" className="main-button" disabled={loading}>
            {loading ? 'در حال ارسال...' : 'ارسال کد تایید'}
          </button>
        </form>

        <p className="footer-text">
          قبلاً ثبت‌نام کرده‌اید؟
          <span className="link-text" onClick={() => navigate('/login')}>
            ورود
          </span>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
