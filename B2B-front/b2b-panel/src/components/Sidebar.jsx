import { FiBox, FiLogOut, FiUsers } from 'react-icons/fi';
import React, { useEffect, useState } from 'react';

import api from '../api/axiosConfigs';
import logoRazy from '../assets/RazyLogo.png';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const [user, setUser] = useState({ name: 'کاربر گرامی', avatar: '' });
  const navigate = useNavigate();

  useEffect(() => {
    // طبق PDF: فراخوانی پروفایل
    api.get('/b2b/Customer/Profile')
      .then(res => {
        const data = res.data?.data || res.data;
        setUser({ name: data.name || 'کاربر گرامی', avatar: data.image || '' });
      })
      .catch(() => console.log("Profile load failed"));
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <aside className="stp-sidebar">
      <div className="stp-profile-box">
         <img src={user.avatar || logoRazy} className="stp-avatar" alt="profile" />
         <p className="stp-user-name">{user.name}</p>
      </div>
      <nav className="stp-nav">
        <div className="stp-nav-item" onClick={() => navigate('/stores')}>
          <FiUsers className="stp-icon" /> <span>مشتریان من</span>
        </div>
        <div className="stp-nav-item" onClick={() => navigate('/stock')}>
          <FiBox className="stp-icon" /> <span>موجودی انبار</span>
        </div>
        <div className="stp-nav-item logout" onClick={handleLogout}>
          <FiLogOut className="stp-icon" /> <span>خروج</span>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;