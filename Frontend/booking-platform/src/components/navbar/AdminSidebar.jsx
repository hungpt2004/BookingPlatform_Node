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

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

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
        { title: "Lịch Booking", path: "/booking-management" },
        { title: "Booking Management", path: "/hotels/add" },
      ],
    },
    {
      title: "Quản lý phòng",
      icon: <FaBuilding />,
      submenus: [
        { title: "Danh sách phòng", path: "/rooms" },
        { title: "Thêm phòng", path: "/rooms/add" },
      ],
    },
    {
      title: "Quản lý doanh thu",
      icon: <FaChartBar />,
      path: "/monthly-owner",
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

  return (
    <div className={`sidebar-container ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <div className="logo-container">
          {!collapsed && <img src="/logo.png" alt="Logo" className="logo" />}
          {!collapsed && <span className="logo-text">Admin Panel</span>}
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
                  className={`menu-title ${
                    activeMenu === menu.title ? "active" : ""
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
        <button className="logout-button" onClick={() => navigate("/logout")}>
          <div className="menu-icon">
            <FaSignOutAlt />
          </div>
          {!collapsed && <span className="menu-text">Đăng xuất</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
