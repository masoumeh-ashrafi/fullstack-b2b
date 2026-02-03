import { FaBoxes, FaStore, FaUserCircle } from 'react-icons/fa';

import { NavLink } from 'react-router-dom';
import React from 'react';

// می‌توانید از آیکون‌های react-icons یا antd استفاده کنید


const Sidebar = () => {
  // این آرایه به ما کمک می‌کند منوها را تمیزتر مدیریت کنیم
  const menuItems = [
    { path: '/stock', name: 'موجودی کالا', icon: <FaBoxes /> },
    { path: '/stores', name: 'فروشگاه‌ها', icon: <FaStore /> },
    { path: '/profile', name: 'پروفایل کاربری', icon: <FaUserCircle /> },
  ];

  return (
    <div className="sidebar" style={{ width: '250px', background: '#fff', height: '100vh', borderLeft: '1px solid #ddd' }}>
      <div className="logo" style={{ padding: '20px', textAlign: 'center', fontWeight: 'bold' }}>
        پنل تجاری رازی
      </div>
      
      <nav>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {menuItems.map((item) => (
            <li key={item.path} style={{ margin: '10px 0' }}>
              <NavLink 
                to={item.path}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px 20px',
                  textDecoration: 'none',
                  color: isActive ? '#fff' : '#333',
                  backgroundColor: isActive ? '#f57c00' : 'transparent', // رنگ نارنجی طبق فیگما
                  transition: '0.3s'
                })}
              >
                <span style={{ marginLeft: '10px' }}>{item.icon}</span>
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;