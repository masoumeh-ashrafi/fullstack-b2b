import "./StoresPage.css";

import { Bell, ChevronDown, Search, Users } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";

import api from "../api/axiosConfigs";
import logoRazy from "../assets/RazyLogo.png";
import { useNavigate } from "react-router-dom";

const StoresPage = () => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [serverMsg, setServerMsg] = useState("");

  // (فعلاً پروفایل رو ساده نگه می‌داریم)
  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  }, []);

  const fullName = user?.FullName || user?.fullName || "کاربر سیستم";
  const mobile = user?.Mobile || user?.phoneNumber || "";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchStores = async () => {
      try {
        setLoading(true);
        setPageError("");
        setServerMsg("");

        // ✅ همون endpoint که گفتی
        const res = await api.get("/b2b/Commodity/Stores");

        // برای دیباگ:
        console.log("STORES raw response.data =>", res.data);

        const msg = res.data?.message || "";
        setServerMsg(msg);

        // استاندارد شما: { status, resultCode, message, errors, data }
        const arr = res.data?.data;

        if (Array.isArray(arr)) {
          setStores(arr);
        } else {
          setStores([]);
        }
      } catch (err) {
        console.error("Stores API error:", err?.response?.data || err);

        const msg = err?.response?.data?.message || "";
        const errors = err?.response?.data?.errors || [];
        const combined = [msg, ...errors].filter(Boolean).join(" - ");

        setPageError(combined || "خطا در دریافت لیست مشتریان");
        setStores([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, [navigate]);

  const filteredStores = stores.filter((store) => {
    const name = (store.Name || store.StoreName || "").toLowerCase();
    return name.includes(searchTerm.toLowerCase());
  });

  return (
    <div
      className="dashboard-wrapper"
      style={{
        display: "flex",
        flexDirection: "row-reverse",
        justifyContent: "flex-end",
        direction: "rtl",
      }}
    >
      {/* محتوای اصلی */}
      <div className="main-layout-container" style={{ flexGrow: 1 }}>
        <header className="top-nav">
          <div className="top-nav-right">
            <div className="breadcrumb">
              <h1>داشبورد</h1>
            </div>
          </div>

          <div className="top-nav-center"></div>

          <div className="top-nav-left">
            <div className="user-profile-header">
              <ChevronDown size={16} color="#9ca3af" />
              <div className="user-info">
                <span className="user-name">{fullName}</span>
                <span className="user-phone">{mobile}</span>
              </div>

              <div className="avatar-container">
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: "50%",
                    background: "#e2e8f0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    color: "#334155",
                  }}
                  title={fullName}
                >
                  {String(fullName).trim()?.[0] || "ک"}
                </div>
                <div className="status-dot"></div>
              </div>

              <Bell size={20} color="#4b5563" className="header-icon" />
            </div>
          </div>
        </header>

        <main className="main-content">
          <div className="table-card">
            <div className="table-header">
              <div className="table-title">
                <Users size={20} color="#f97316" />
                <span>لیست مشتریان من</span>
              </div>

              <div className="table-search-box">
                <input
                  type="text"
                  placeholder="جستجو"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search size={18} color="#9ca3af" />
              </div>
            </div>

            <table className="data-table">
              <thead>
                <tr>
                  <th>
                    <input type="checkbox" className="custom-checkbox" />
                  </th>
                  <th>نام فروشگاه‌ها</th>
                  <th>شماره تماس</th>
                  <th>عملیات</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: "center", padding: 20 }}>
                      در حال بارگذاری...
                    </td>
                  </tr>
                ) : pageError ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: "center", padding: 20, color: "red" }}>
                      {pageError}
                    </td>
                  </tr>
                ) : filteredStores.length > 0 ? (
                  filteredStores.map((store, index) => (
                    <tr
                      key={store.Id || store.ID || index}
                      onClick={() => navigate("/stock")}
                      className="clickable-row"
                    >
                      <td>
                        <input type="checkbox" onClick={(e) => e.stopPropagation()} />
                      </td>
                      <td className="name-cell">{store.Name || store.StoreName || "بدون نام"}</td>
                      <td className="phone-cell">{store.Mobile || store.PhoneNumber || "---"}</td>
                      <td>
                        <button className="details-btn" onClick={(e) => e.stopPropagation()}>
                          نمایش جزییات
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: "center", padding: 20 }}>
                      {/* اگر سرور پیام داده هم نشون بده */}
                      {serverMsg ? `${serverMsg} (لیست خالی است)` : "مشتری یافت نشد."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* سایدبار */}
      <aside className="right-sidebar" style={{ width: 280, flexShrink: 0 }}>
        <div className="sidebar-content">
          <div className="logo-section" style={{ marginBottom: 40 }}>
            <img src={logoRazy} alt="logo" className="sidebar-logo" />
          </div>

          <nav className="side-menu">
            <div className="menu-group active">
              <div className="menu-item active">
                <ChevronDown size={16} />
                <span>مشتریان من</span>
                <Users size={20} />
              </div>
            </div>
          </nav>
        </div>
      </aside>
    </div>
  );
};

export default StoresPage;
