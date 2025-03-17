import React, { useEffect, useState } from "react";
import { Navbar, Nav, Container, Dropdown, Image } from "react-bootstrap";
import { FaBell, FaCog, FaSignOutAlt, FaUserCircle } from "react-icons/fa";
import './sidebar.css';
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import axiosInstance from "../../utils/AxiosInstance";

export const AdminCustomNavbar = () => {

  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const [scrolled, setScrolled] = useState(false);

  // Xử lý sự kiện scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
    navigate('/');
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get('/customer/current-user');
        setUser(response.data.user);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, []);


  return (
    <Navbar
      bg="white"
      className="mb-3 shadow-sm py-3 border-bottom"
      expand="lg"
    >
      <Container fluid className="px-4">
        <Navbar.Brand href="#" className="fw-bold fs-2 auto-typing text-primary">
          <span className="gradient-text">TRAVELOFY</span>
        </Navbar.Brand>

        <Nav className="ms-auto d-flex align-items-center">
          {/* Notification icon */}
          <Nav.Link className="position-relative me-3">
            <FaBell size={20} className="text-secondary" />
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              2
              <span className="visually-hidden">unread messages</span>
            </span>
          </Nav.Link>

          {/* User dropdown */}
          <Dropdown align="end">
            <Dropdown.Toggle variant="white" id="dropdown-basic" className="d-flex align-items-center border-0">
              <div className="d-none d-sm-flex flex-column align-items-end me-2">
                {/* <span className="fw-bold text-dark">{user?.name}</span> */}
                <small className="text-muted">Administrator</small>
              </div>
              <Image
                src="https://mdbcdn.b-cdn.net/img/new/avatars/2.webp"
                roundedCircle
                width="40"
                height="40"
                className="border border-2 border-primary"
              />
            </Dropdown.Toggle>
            <Dropdown.Menu className="shadow border-0 py-2">
              <Dropdown.Item>
              <div className="user-details">
                {/* <h6>{user.name}</h6> */}
                {/* <p>{user.email}</p> */}
              </div>
              </Dropdown.Item>
              <Dropdown.Item href="#" className="py-2">
                <FaUserCircle className="me-2 text-secondary" /> Thông tin tài khoản
              </Dropdown.Item>
              <Dropdown.Item href="#" className="py-2">
                <FaCog className="me-2 text-secondary" /> Cài đặt
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item href="#" className="py-2 text-danger">
                <FaSignOutAlt className="me-2" /> Đăng xuất
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Nav>
      </Container>
    </Navbar>
  );
};
