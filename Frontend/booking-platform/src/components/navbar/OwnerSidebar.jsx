import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaHotel,
  FaChevronDown,
  FaChevronRight,
  FaBuilding,
  FaCog,
  FaTachometerAlt,
  FaChartBar,
  FaUserCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";
import "./sidebar.css";
import { useAuthStore } from "../../store/authStore";

const OwnerSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const { logout } = useAuthStore();

  // Submenus
  const menus = [
    {
      title: "Dashboard",
      icon: <FaTachometerAlt />,
      path: "/dashboard",
    },
    {
      title: "Quản lý khách sạn",
      icon: <FaHotel />,
      submenus: [
        { title: "Thông tin Khách Sạn", path: "/hotel-management" },
        { title: "Quản lý Booking", path: "/booking-management" },
        { title: "Quản lý Doanh Thu", path: "/monthly-owner" },
      ],
    },
    {
      title: "Quản lý phòng",
      icon: <FaBuilding />,
      submenus: [
        { title: "Danh sách phòng", path: "/room-management" },
        { title: "Thêm phòng", path: "/rooms/add" },
        { title: "Quản lý phòng", path: "/room-management-2" },
      ],
    },
    {
      title: "Quản lý dịch vụ",
      icon: <FaBuilding />,
      submenus: [
        { title: "Danh sách dịch vụ", path: "/service-management" },
        { title: "Danh sách đánh giá", path: "/feedback-management" },
        { title: "Danh sách tiện ích", path: "/rooms/add" },
      ],
    },
    {
      title: "Cài đặt",
      icon: <FaCog />,
      path: "/settings",
    },
  ];

  const toggleSubmenu = (menu) => {
    if (activeMenu === menu) {
      setActiveMenu("");
    } else {
      setActiveMenu(menu);
    }
  };

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  // Kiểm tra đường dẫn hiện tại để xác định menu active
  useEffect(() => {
    menus.forEach((menu) => {
      if (menu.path === location.pathname) {
        setActiveMenu("");
      } else if (menu.submenus) {
        const hasActiveSubmenu = menu.submenus.some(
          (submenu) => submenu.path === location.pathname
        );
        if (hasActiveSubmenu) {
          setActiveMenu(menu.title);
        }
      }
    });
  }, [location.pathname]);

  const handleLogout = async () => {
    if (localStorage.getItem('payment_link')) {
      localStorage.removeItem('payment_link');
    }
    logout();
    setUser(null);
    navigate('/');
  };

  return (
    <div className={`sidebar-container ${collapsed ? "collapsed" : ""} h-100vh`} style={{ height: '100vh', position: 'sticky', top: 0, overflowY: "hidden" }}>
      <div className="sidebar-header">
        <div className="logo-container">
          {!collapsed && <img src="/logo.png" alt="Logo" className="logo" />}
          {!collapsed && <span className="logo-text">Owner Panel</span>}
        </div>
        <button className="toggle-button" onClick={toggleSidebar}>
          {collapsed ? <FaBars /> : <FaTimes />}
        </button>
      </div>

      <div className="sidebar-menu">
        {menus.map((menu, index) => (
          <div key={index} className="menu-item">
            {menu.submenus ? (
              <>
                <div
                  className={`menu-title ${activeMenu === menu.title ? "active" : ""
                    }`}
                  onClick={() => toggleSubmenu(menu.title)}
                >
                  <div className="menu-icon">{menu.icon}</div>
                  {!collapsed && (
                    <>
                      <span className="menu-text">{menu.title}</span>
                      <div className="menu-arrow">
                        {activeMenu === menu.title ? (
                          <FaChevronDown />
                        ) : (
                          <FaChevronRight />
                        )}
                      </div>
                    </>
                  )}
                </div>
                {activeMenu === menu.title && !collapsed && (
                  <div className="submenu">
                    {menu.submenus.map((submenu, subIndex) => (
                      <NavLink
                        key={subIndex}
                        to={submenu.path}
                        className={({ isActive }) =>
                          isActive ? "submenu-item active" : "submenu-item"
                        }
                      >
                        {submenu.title}
                      </NavLink>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <NavLink
                to={menu.path}
                className={({ isActive }) =>
                  isActive ? "menu-title active" : "menu-title"
                }
              >
                <div className="menu-icon">{menu.icon}</div>
                {!collapsed && <span className="menu-text">{menu.title}</span>}
              </NavLink>
            )}
          </div>
        ))}
      </div>

      <div className="sidebar-footer">
        <NavLink to="/dashboard" className="profile-link">
          <div className="menu-icon">
            <FaUserCog />
          </div>
          {!collapsed && <span className="menu-text">Hồ sơ</span>}
        </NavLink>
        <button className="logout-button" onClick={() => handleLogout()}>
          <div className="menu-icon">
            <FaSignOutAlt />
          </div>
          {!collapsed && <span className="menu-text">Đăng xuất</span>}
        </button>
      </div>
    </div>
  );
};

export default OwnerSidebar;
