import React from 'react';
import { useNavigate } from 'react-router-dom';

const MainLayout = ({ children, title }) => {
  const navigate = useNavigate();

  return (
    <div style={s.dashboard}>
      {/* پنل سمت راست - سایدبار طبق عکس bc95c8 */}
      <aside style={s.sidebar}>
        <div style={s.logoBox}>
          <img src="/logo-razisoft.png" alt="لوگو" style={{width: '80px'}} />
          <div style={s.searchIcon}>⌨️ F</div>
        </div>
        
        <nav style={s.menu}>
          <div style={s.menuItem} onClick={() => navigate('/stores')}>
            <span>👥</span> مشتریان من
          </div>
          <div style={s.menuItemActive}>
            <span style={{color: '#0052cc'}}>🔵</span> فروشگاه‌ها
          </div>
          <div style={s.menuItem}>
            <span>⚙️</span> تنظیمات
          </div>
        </nav>

        <div style={s.supportCard}>
          <div style={s.supportIcon}>💬</div>
          <div>
            <div style={{fontWeight: 'bold', fontSize: '12px'}}>پشتیبانی</div>
            <div style={{fontSize: '10px', color: '#999'}}>هر سوالی داری بپرس!</div>
          </div>
        </div>

        <div style={s.userCard}>
          <img src="/avatar-sara.png" style={s.avatar} />
          <div style={{marginRight: '10px'}}>
            <div style={{fontWeight: 'bold', fontSize: '13px'}}>پوشاک سارا</div>
            <div style={{fontSize: '10px', color: '#999'}}>تامین کننده</div>
          </div>
          <span>▼</span>
        </div>
      </aside>

      {/* بخش محتوا */}
      <div style={s.mainContent}>
        <header style={s.topBar}>
          <div style={s.topBarRight}>
             <span style={{fontSize: '18px', fontWeight: 'bold'}}>{title}</span>
             <div style={s.breadcrumb}>پیشخوان {'>'} عمده فروشان</div>
          </div>
          <div style={s.topBarLeft}>
            <div style={s.searchTop}>🔍 جستجو <span style={s.keyHint}>⌘ F</span></div>
            <div style={s.userTop}>
              <span style={s.notif}>🔔</span>
              <div style={{textAlign: 'left'}}>
                <div style={{fontWeight: 'bold'}}>سارا محمدی</div>
                <div style={{fontSize: '10px', color: '#999'}}>۰۹۱۲۸۸۸۴۸۴۹</div>
              </div>
              <img src="/avatar-sara.png" style={s.smallAvatar} />
            </div>
          </div>
        </header>
        {children}
      </div>
    </div>
  );
};

const s = {
  dashboard: { display: 'flex', height: '100vh', direction: 'rtl', backgroundColor: '#fdfdfd', fontFamily: 'Vazir, Tahoma' },
  sidebar: { width: '240px', backgroundColor: '#fff', borderLeft: '1px solid #f0f0f0', padding: '20px', display: 'flex', flexDirection: 'column' },
  logoBox: { display: 'flex', justifyContent: 'space-between', marginBottom: '40px' },
  searchIcon: { background: '#f5f5f5', padding: '5px 10px', borderRadius: '8px', fontSize: '12px' },
  menu: { flex: 1 },
  menuItem: { display: 'flex', gap: '10px', padding: '12px', color: '#555', cursor: 'pointer', borderRadius: '10px' },
  menuItemActive: { display: 'flex', gap: '10px', padding: '12px', backgroundColor: '#f0f7ff', color: '#0052cc', borderRadius: '10px', fontWeight: 'bold' },
  supportCard: { background: '#fff', border: '1px solid #f0f0f0', borderRadius: '12px', padding: '10px', display: 'flex', gap: '10px', marginBottom: '15px' },
  userCard: { display: 'flex', alignItems: 'center', padding: '10px', border: '1px solid #f0f0f0', borderRadius: '12px' },
  avatar: { width: '40px', height: '40px', borderRadius: '50%' },
  mainContent: { flex: 1, padding: '20px', overflowY: 'auto' },
  topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
  breadcrumb: { fontSize: '11px', color: '#0052cc', marginTop: '5px' },
  topBarLeft: { display: 'flex', alignItems: 'center', gap: '20px' },
  searchTop: { background: '#fff', border: '1px solid #f0f0f0', padding: '8px 15px', borderRadius: '10px', width: '250px', color: '#999', display: 'flex', justifyContent: 'space-between' },
  keyHint: { background: '#f5f5f5', padding: '2px 6px', borderRadius: '4px', fontSize: '10px' },
  userTop: { display: 'flex', alignItems: 'center', gap: '10px' },
  smallAvatar: { width: '35px', height: '35px', borderRadius: '50%' },
  notif: { fontSize: '20px', position: 'relative' }
};

export default MainLayout;

