import './StockPage.css';

import { Bell, ChevronLeft, MessageCircle, Package, Search, Settings, Users } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';

import api from '../api/axiosConfigs';
import logoRazy from '../assets/RazyLogo.png';
import { useNavigate } from 'react-router-dom';

const StockPage = () => {
  const [stockData, setStockData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({ FullName: '', Mobile: '', Avatar: '' });
  const navigate = useNavigate();

  // ۱. بارگذاری اطلاعات کاربر از LocalStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
  if (!token) {
    navigate('/login'); // اگر توکن نبود برگرده به لاگین
    return;
  }
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUserData({
          FullName: parsed.FullName || parsed.fullName || 'کاربر سیستم',
          Mobile: parsed.Mobile || parsed.phoneNumber || '',
          Avatar: parsed.Avatar || parsed.avatar || ''
        });
      } catch (e) {
        console.error("خطا در بارگذاری پروفایل");
      }
    }
  }, []);

  // ۲. دریافت لیست انبار از سرور
  useEffect(() => {
    const fetchStock = async () => {
      try {
        setLoading(true);
const response = await api.get('/b2b/Commodity/Stock');
        const actualData = response.data?.data || response.data?.Data || response.data || [];
        setStockData(Array.isArray(actualData) ? actualData : []);
      } catch (err) {
        console.error("خطا در دریافت لیست انبار:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStock();
  }, []);

  // ۳. فیلتر کردن کالاها
  const filteredData = useMemo(() => {
    return stockData.filter(item => {
      const name = (item.Name || '').toLowerCase();
      const fullName = (item.CmFullName || '').toLowerCase();
      const barcode = (item.Barcode || '').toString();
      const searchLower = searchTerm.toLowerCase();
      return name.includes(searchLower) || fullName.includes(searchLower) || barcode.includes(searchLower);
    });
  }, [searchTerm, stockData]);

  const handleImageError = (e) => {
    e.target.src = "https://ui-avatars.com/api/?name=" + (userData.FullName || 'User') + "&background=random";
  };

  return (
    <div className="dashboard-container" style={{ direction: 'rtl', display: 'flex', backgroundColor: '#fcfcfc', height: '100vh', overflow: 'hidden', fontFamily: 'Tahoma' }}>
      
      {/* سایدبار ثابت راست */}
      <aside className="right-sidebar" style={{ width: '280px', backgroundColor: '#fff', borderLeft: '1px solid #f0f0f0', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ padding: '24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <img src={logoRazy} alt="logo" style={{ width: '130px' }} />
          </div>

          <nav>
            <div onClick={() => navigate('/stores')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', color: '#64748b', cursor: 'pointer', marginBottom: '8px' }}>
              <Users size={20} />
              <span>مشتریان من</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', backgroundColor: '#eff6ff', borderRadius: '12px', color: '#3b82f6', cursor: 'pointer' }}>
              <Package size={20} />
              <span style={{ fontWeight: 'bold' }}>انبار من (موجودی)</span>
            </div>
          </nav>
        </div>

        <div style={{ marginTop: 'auto', padding: '24px', borderTop: '1px solid #f8fafc' }}>
        </div>
      </aside>

      {/* محتوای اصلی */}
      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 40px', backgroundColor: '#fff', borderBottom: '1px solid #f1f5f9' }}>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>موجودی کالا</h1>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{userData.FullName}</div>
                <div style={{ fontSize: '11px', color: '#94a3b8' }}>{userData.Mobile}</div>
              </div>
              <img src={userData.Avatar || "https://via.placeholder.com/40"} onError={handleImageError} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} alt="avatar" />
            </div>
            <Bell size={22} color="#64748b" />
          </div>
        </header>

        <main style={{ padding: '32px 40px', overflowY: 'auto', flexGrow: 1 }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '20px', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
            <div style={{ padding: '24px 32px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Package size={22} color="#f97316" />
                <span style={{ fontWeight: 'bold' }}>لیست موجودی انبار</span>
              </div>
              
              <div style={{ position: 'relative' }}>
                <Search size={16} color="#94a3b8" style={{ position: 'absolute', right: '12px', top: '10px' }} />
                <input 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="جستجو در انبار..." 
                  style={{ padding: '8px 35px 8px 15px', borderRadius: '10px', border: '1px solid #f1f5f9', backgroundColor: '#f8fafc', outline: 'none', fontSize: '13px' }}
                />
              </div>
            </div>
            
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
              <thead style={{ backgroundColor: '#fcfcfc' }}>
                <tr>
                  <th style={{ width: '50px', padding: '16px 32px', textAlign: 'center' }}><input type="checkbox" /></th>
                  <th style={{ padding: '16px 32px', color: '#94a3b8', fontSize: '13px' }}>بارکد کالا</th>
                  <th style={{ padding: '16px 32px', color: '#94a3b8', fontSize: '13px' }}>نام کالا</th>
                  <th style={{ padding: '16px 32px', color: '#94a3b8', fontSize: '13px', textAlign: 'center' }}>تعداد موجودی</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="4" style={{ textAlign: 'center', padding: '60px' }}>در حال بارگذاری...</td></tr>
                ) : filteredData.length > 0 ? filteredData.map((item, index) => {
                  const itemName = item.CmFullName || "نامشخص";
                  const itemBarcode = item.Barcode || "---";
                  const stockValue = item.Supply ?? 0;

                  return (
                    <tr key={item._id || index} style={{ borderBottom: '1px solid #f8fafc' }}>
                      <td style={{ padding: '20px 32px', textAlign: 'center' }}><input type="checkbox" /></td>
                      <td style={{ padding: '20px 32px', color: '#64748b' }}>#{itemBarcode}</td>
                      <td style={{ padding: '20px 32px', fontWeight: '500' }}>
                        {itemName}
                      </td>
                      <td style={{ padding: '20px 32px', textAlign: 'center' }}>
                        <span style={{ 
                          padding: '4px 12px', 
                          borderRadius: '6px', 
                          backgroundColor: stockValue <= 0 ? '#fef2f2' : '#f0fdf4',
                          color: stockValue <= 0 ? '#ef4444' : '#22c55e',
                          fontWeight: 'bold',
                          display: 'inline-block',
                          minWidth: '80px'
                        }}>
                          {stockValue <= 0 ? 'ناموجود' : `${stockValue} عدد`}
                        </span>
                      </td>
                    </tr>
                  );
                }) : (
                  <tr><td colSpan="4" style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>کالایی یافت نشد.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div> 
  );
};

export default StockPage;