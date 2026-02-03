import { Bell, ChevronDown, ChevronLeft, MessageSquare, Search, Settings, Users } from 'lucide-react';
import React, { useEffect, useState } from 'react'; // اضافه کردن هوک‌ها

const FinalDashboard = () => {
  // انتقال هوک‌ها به داخل کامپوننت برای اجرای صحیح
  const [userData, setUserData] = useState({ fullName: '', mobile: '', avatar: '' });

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUserData({
          fullName: parsed.FullName || parsed.fullName || 'کاربر سیستم',
          mobile: parsed.Mobile || parsed.mobile || '',
          // استفاده از آواتار واقعی یا پیش‌فرض
          avatar: parsed.Avatar || parsed.avatar || 'https://via.placeholder.com/100'
        });
      } catch (e) {
        console.error("خطا در خواندن اطلاعات کاربر");
      }
    }
  }, []);

  return (
    <div style={s.wrapper}>
      {/* Header */}
      <header style={s.header}>
        <div style={s.headerLeft}>
          <ChevronDown size={14} color="#666" />
          <div style={s.userInfo}>
            <span style={s.userName}>{userData.fullName}</span>
            <span style={s.userPhone}>{userData.mobile}</span>
          </div>
          <div style={s.avatarCircle}>
            {/* نمایش تصویر واقعی کاربر به جای تصویر سارا */}
            <img src={userData.avatar} style={s.img} alt="user" />
            <div style={s.onlineDot}></div>
          </div>
          <Bell size={20} color="#666" style={{marginLeft: '15px'}} />
        </div>

        <div style={s.headerCenter}>
          <div style={s.searchBox}>
            <span style={s.cmdBtn}>⌘ F</span>
            <input type="text" placeholder="جست و جو" style={s.input} />
            <Search size={18} color="#999" />
          </div>
        </div>

        <div style={s.headerRight}>
          <h1 style={s.title}>داشبورد</h1>
          <p style={s.bread}>پیشخوان / <span style={{color:'#3498db'}}>عمده فروشان</span></p>
        </div>
      </header>

      <div style={s.body}>
        <main style={s.main}>
          <div style={s.alert}>
            <div style={s.alertIcon}>!</div>
            خوش آمدید! این پنل مدیریت فروشگاه‌های شماست.
          </div>

          <div style={s.card}>
            <div style={s.cardHead}>
              <div style={s.smallSearch}>
                <input type="text" placeholder="جستجو" style={s.input} />
                <Search size={14} color="#ccc" />
              </div>
              <div style={s.cardTitle}>
                <span>لیست مشتریان من</span>
                <Users size={20} color="#f39c12" style={{marginRight: '8px'}} />
              </div>
            </div>

            <table style={s.table}>
              <thead>
                <tr style={s.thRow}>
                  <th style={s.th}>عملیات</th>
                  <th style={s.th}>شماره تماس</th>
                  <th style={s.th}>نام فروشگاه‌ها</th>
                  <th style={s.th}><input type="checkbox" /></th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3].map(i => (
                  <tr key={i} style={s.tr}>
                    <td style={s.td}><button style={s.btn}>نمایش جزییات</button></td>
                    <td style={{...s.td, fontWeight:'bold'}}>۰۹۹۲ ۸۷۸ ۴۸۴۶</td>
                    <td style={s.td}>مانتو جردن</td>
                    <td style={s.td}><input type="checkbox" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>

        {/* Sidebar */}
        <aside style={s.sidebar}>
          <div style={{textAlign:'right', marginBottom:'30px'}}>
              <img src="https://cdn-icons-png.flaticon.com/512/5968/5968204.png" width="35" alt="logo" />
          </div>
          
          <div style={s.sideSearch}>
              <span style={s.sideCmd}>⌘ F</span>
              <input type="text" placeholder="جستجو" style={s.input} />
              <Search size={14} color="#ccc" />
          </div>

          <div style={s.menu}>
            <div style={s.menuItemActive}>
              <ChevronDown size={14} />
              <span style={{flex:1, marginRight:'10px'}}>مشتریان من</span>
              <Users size={18} />
            </div>
            <div style={s.subMenu}>
              <div style={s.blueDot}></div>
              فروشگاه‌ها
            </div>
            <div style={s.menuItem}>
              <span></span>
              <span style={{flex:1, marginRight:'10px'}}>تنظیمات</span>
              <Settings size={18} />
            </div>
          </div>

          <div style={s.sideBottom}>
            <div style={s.support}>
              <ChevronLeft size={14} color="#ccc" />
              <div style={s.supText}>
                <div style={{fontWeight:'bold'}}>پشتیبانی</div>
                <div style={{fontSize:'10px', color:'#aaa'}}>هر سوالی داری بپرس!</div>
              </div>
              <div style={s.orangeBox}><MessageSquare size={16} color="white" fill="white"/></div>
            </div>

            <div style={s.profileCombo}>
              <ChevronDown size={14} color="#ccc" />
              <div style={s.supText}>
                {/* حذف نام سارا و نمایش نام واقعی فروشگاه کاربر */}
                <div style={{fontWeight:'bold'}}>{userData.fullName}</div>
                <div style={{fontSize:'10px', color:'#aaa'}}>پروفایل کاربری</div>
              </div>
              <img src={userData.avatar} style={s.shopImg} alt="shop" />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

// استایل‌ها (بدون تغییر برای حفظ ظاهر)
const s = {
  wrapper: { height: '100vh', display: 'flex', flexDirection: 'column', background: '#fff', fontFamily: 'inherit', overflow: 'hidden' },
  header: { height: '70px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 40px', borderBottom: '1px solid #f5f5f5', direction: 'ltr' },
  headerLeft: { display: 'flex', alignItems: 'center', gap: '12px', direction: 'rtl' },
  userInfo: { textAlign: 'right' },
  userName: { display: 'block', fontWeight: 'bold', fontSize: '13px' },
  userPhone: { fontSize: '11px', color: '#999' },
  avatarCircle: { position: 'relative', width: '38px', height: '38px' },
  img: { width: '100%', height: '100%', borderRadius: '10px', objectFit: 'cover' },
  onlineDot: { position: 'absolute', bottom: '-2px', right: '-2px', width: '8px', height: '8px', background: '#2ecc71', border: '2px solid #fff', borderRadius: '50%' },
  searchBox: { background: '#f9f9f9', borderRadius: '10px', padding: '8px 15px', display: 'flex', alignItems: 'center', width: '320px', direction: 'rtl' },
  input: { border: 'none', background: 'transparent', flex: 1, padding: '0 10px', outline: 'none', fontSize: '13px', textAlign: 'right' },
  cmdBtn: { border: '1px solid #eee', padding: '2px 5px', borderRadius: '5px', color: '#ccc', fontSize: '10px' },
  headerRight: { direction: 'rtl' },
  title: { margin: 0, fontSize: '18px' },
  bread: { margin: 0, fontSize: '11px', color: '#aaa' },
  body: { display: 'flex', flex: 1, overflow: 'hidden' },
  main: { flex: 1, padding: '25px 40px', direction: 'rtl', overflowY: 'auto' },
  alert: { background: '#f0f7ff', border: '1px solid #339af0', color: '#004085', padding: '10px 15px', borderRadius: '8px', fontSize: '12px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' },
  alertIcon: { background: '#339af0', color: '#fff', width: '18px', height: '18px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  card: { border: '1px solid #f0f0f0', borderRadius: '12px' },
  cardHead: { display: 'flex', justifyContent: 'space-between', padding: '15px' },
  smallSearch: { border: '1px solid #eee', borderRadius: '8px', padding: '4px 10px', display: 'flex', alignItems: 'center' },
  cardTitle: { display: 'flex', alignItems: 'center', fontWeight: 'bold', fontSize: '14px' },
  table: { width: '100%', borderCollapse: 'collapse' },
  thRow: { background: '#fafafa' },
  th: { padding: '12px', color: '#aaa', fontSize: '11px', textAlign: 'center', fontWeight: 'normal' },
  tr: { borderBottom: '1px solid #f9f9f9' },
  td: { padding: '15px', textAlign: 'center', fontSize: '13px' },
  btn: { border: '1px solid #eee', background: '#fff', padding: '5px 12px', borderRadius: '6px', fontSize: '11px', cursor: 'pointer' },
  sidebar: { width: '240px', borderLeft: '1px solid #f5f5f5', padding: '20px', display: 'flex', flexDirection: 'column', direction: 'rtl' },
  sideSearch: { background: '#f9f9f9', borderRadius: '8px', padding: '8px', display: 'flex', alignItems: 'center', marginBottom: '20px' },
  sideCmd: { color: '#ccc', fontSize: '10px' },
  menu: { flex: 1 },
  menuItemActive: { display: 'flex', alignItems: 'center', padding: '10px 0', fontWeight: 'bold', fontSize: '14px' },
  subMenu: { color: '#3498db', paddingRight: '25px', display: 'flex', alignItems: 'center', fontSize: '13px', fontWeight: 'bold' },
  blueDot: { width: '6px', height: '6px', background: '#3498db', borderRadius: '50%', marginLeft: '8px' },
  menuItem: { display: 'flex', alignItems: 'center', padding: '10px 0', color: '#666', fontSize: '14px' },
  sideBottom: { marginTop: 'auto' },
  support: { border: '1px solid #eee', borderRadius: '10px', padding: '8px', display: 'flex', alignItems: 'center', marginBottom: '10px' },
  supText: { flex: 1, textAlign: 'right', marginRight: '10px' },
  orangeBox: { background: '#f39c12', padding: '6px', borderRadius: '8px', display: 'flex' },
  profileCombo: { border: '1px solid #eee', borderRadius: '10px', padding: '8px', display: 'flex', alignItems: 'center' },
  shopImg: { width: '32px', height: '32px', borderRadius: '6px' }
};

export default FinalDashboard;