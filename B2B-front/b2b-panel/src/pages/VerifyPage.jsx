import './VerifyPage.css';

import React, { useEffect, useMemo, useRef, useState } from 'react';

import api from '../api/axiosConfigs';
import logoRazy from '../assets/RazyLogo.png';
import { useNavigate } from 'react-router-dom';

const VerifyPage = () => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(116);
  const [canResend, setCanResend] = useState(false);
  const [error, setError] = useState('');
  const inputRefs = [useRef(), useRef(), useRef(), useRef()];
  const navigate = useNavigate();

  const rawPhone = localStorage.getItem('tempMobile');

  // تبدیل اعداد فارسی به انگلیسی
  const normalizeNumber = (v) =>
    (v || '')
      .replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d))
      .replace(/[^\d]/g, '');

  // شماره‌ای که برای API می‌فرستیم
  const phoneNumber = useMemo(() => normalizeNumber(rawPhone), [rawPhone]);

  // اگر مستقیم وارد این صفحه شد برگرده لاگین
  useEffect(() => {
    if (!rawPhone) navigate('/login');
  }, [rawPhone, navigate]);

  // تایمر
  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? `۰${seconds}` : seconds}`;
  };

  // ✅ ساخت آواتار خودکار (دستی نیست)
  const buildAutoAvatar = (fullName, mobile) => {
    const name = (fullName || '').trim();
    const seed = name || mobile || 'User';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(seed)}&background=random&color=fff`;
  };

  // ارسال مجدد کد: بسته به اینکه کاربر از ثبت‌نام اومده یا ورود
  const handleResend = async () => {
    if (!canResend) return;
    setError('');

    const mode = localStorage.getItem('verifyMode') || 'signin'; // signup / signin

    try {
      if (mode === 'signup') {
        const nationalCode = localStorage.getItem('tempNationalCode');
        const type = localStorage.getItem('tempType');

        if (!nationalCode || type === null) {
          setError('اطلاعات ثبت‌نام ناقص است. دوباره ثبت‌نام کنید.');
          navigate('/register');
          return;
        }

        await api.post('/b2b/Customer/SignUp', {
          PhoneNumber: phoneNumber,
          NationalCode: nationalCode,
          Type: Number(type),
        });
      } else {
        await api.post('/b2b/Customer/SignIn', {
          PhoneNumber: phoneNumber,
        });
      }

      setTimer(116);
      setCanResend(false);
      setOtp(['', '', '', '']);
    } catch (e) {
      console.error('RESEND error:', e?.response?.data || e);
      const msg = e.response?.data?.message || '';
      const errors = e.response?.data?.errors || [];
      const combined = [msg, ...errors].filter(Boolean).join(' - ');
      setError(combined || 'خطا در ارسال مجدد کد');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // OTP را هم نرمال می‌کنیم (اگر فارسی تایپ شده بود)
    const finalOtp = normalizeNumber(otp.join(''));

    if (finalOtp.length !== 4) {
      setError('لطفاً کد ۴ رقمی را کامل وارد کنید.');
      return;
    }

    try {
      const response = await api.post('/b2b/Customer/VerifySignIn', {
        PhoneNumber: phoneNumber,
        Code: finalOtp,
      });

      console.log('VERIFY response.data:', response.data);

      if (response.status === 200) {
        // ✅ توکن ممکنه تو message یا data یا Token باشه
        const token =
          response.data?.data?.Token ||
          response.data?.data ||
          response.data?.Token ||
          response.data?.token ||
          response.data?.message;

        if (!token || typeof token !== 'string') {
          console.log('verify response', response.data);
          setError('توکن از سرور دریافت نشد.');
          return;
        }

        // ✅ ذخیره توکن
        localStorage.setItem('token', token);

        // ✅ گرفتن پروفایل و ذخیره user (برای نمایش اسم/شماره/آواتار)
        try {
          const prof = await api.get('/b2b/Customer/Profile');
          const rawUser = prof.data?.data ?? prof.data ?? {};

          // ✅ یکدست‌سازی فیلدها (هرچی بک‌اند داد)
          const fullName =
            rawUser.FullName ||
            rawUser.fullName ||
            rawUser.Name ||
            rawUser.name ||
            'کاربر سیستم';

          const mobile =
            rawUser.Mobile ||
            rawUser.mobile ||
            rawUser.PhoneNumber ||
            rawUser.phoneNumber ||
            phoneNumber ||
            '';

          // ✅ اگر Avatar نبود، خودکار بساز (دستی نیست)
          const avatar =
            rawUser.Avatar ||
            rawUser.avatar ||
            buildAutoAvatar(fullName, mobile);

          const normalizedUser = {
            ...rawUser,
            FullName: fullName,
            Mobile: mobile,
            Avatar: avatar,
          };

          localStorage.setItem('user', JSON.stringify(normalizedUser));
        } catch (e) {
          console.log('Profile fetch error:', e?.response?.data || e);

          // ✅ حتی اگر پروفایل نگرفتیم، باز آواتار خودکار بسازیم که UI خالی نمونه
          const fallbackUser = {
            FullName: 'کاربر سیستم',
            Mobile: phoneNumber || '',
            Avatar: buildAutoAvatar('کاربر سیستم', phoneNumber || ''),
          };
          localStorage.setItem('user', JSON.stringify(fallbackUser));
        }

        navigate('/stores');
      }
    } catch (err) {
      console.error('VERIFY error:', err?.response?.data || err);

      const msg = err.response?.data?.message || '';
      const errors = err.response?.data?.errors || [];
      const combined = [msg, ...errors].filter(Boolean).join(' - ');

      if (err.response?.status === 400) {
        setError(combined || 'کد وارد شده اشتباه است.');
      } else {
        setError(combined || 'خطای سرور رخ داده است. دوباره تلاش کنید.');
      }
    }
  };

  const handleChange = (index, value) => {
    // اجازه عدد فارسی/انگلیسی، ولی ذخیره به شکل 1 کاراکتر
    const normalized = normalizeNumber(value);
    if (value && normalized.length === 0) return;

    const newOtp = [...otp];
    newOtp[index] = normalized.substring(normalized.length - 1);
    setOtp(newOtp);

    if (normalized && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  return (
    <div className="verify-container">
      <div className="verify-card">
        <div className="logo-container">
          <img src={logoRazy} alt="رازی" className="logo-img" />
        </div>

        <h2 className="verify-title">کد تایید یکبار مصرف</h2>

        <div className="verify-info">
          <span>
            کد تایید ارسال شده به شماره <b className="phone-orange">{rawPhone || ''}</b> را وارد کنید.
          </span>
          <span className="edit-icon" onClick={() => navigate('/login')} style={{ cursor: 'pointer' }}>
            ✏️
          </span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="otp-inputs">
            {otp.map((data, index) => (
              <input
                key={index}
                type="text"
                inputMode="numeric"
                maxLength="1"
                ref={inputRefs[index]}
                value={data}
                onInput={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="otp-square"
                autoComplete="off"
              />
            ))}
          </div>

          <button type="submit" className="verify-button">
            تایید کد و ورود به سیستم
          </button>

          {error && (
            <p className="error-text-small" style={{ color: 'red', fontSize: '12px' }}>
              {error}
            </p>
          )}
        </form>

        <div className="resend-timer">
          {canResend ? (
            <span onClick={handleResend} style={{ color: '#f68910', cursor: 'pointer', fontWeight: 'bold' }}>
              ارسال مجدد کد
            </span>
          ) : (
            <span>{formatTime(timer)} تا درخواست مجدد کد</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyPage;
