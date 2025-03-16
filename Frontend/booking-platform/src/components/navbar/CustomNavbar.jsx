import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/AxiosInstance';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Card } from 'react-bootstrap';
import { useAuthStore } from '../../store/authStore';
import { generateShortCutName } from '../../utils/GenerateShortName';
import './CustomNavbar.css'

function CustomNavbar() {
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
      collapseOnSelect 
      expand="lg" 
      className={`navbar-custom ${scrolled ? 'navbar-scrolled' : ''}`}
      fixed="top"
    >
      <Container>
        <Navbar.Brand className='brand-logo' href="/home">
          Travelofy
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link className="nav-item" href="#deets">Website Scope</Nav.Link>
            <Nav.Link className="nav-item" href="#memes">Achievements</Nav.Link>
          </Nav>
          <Nav className='d-flex justify-content-center align-items-center'>
            <Nav.Link className="nav-item" href="/home">Trang chủ</Nav.Link>
            <Nav.Link className="nav-item" href="#">Về Travelofy</Nav.Link>
            <NavDropdown title="Dịch Vụ" id="service-dropdown" className="custom-dropdown">
              <div className="dropdown-inner">
                <NavDropdown.Item href="/favorite">
                  <i className="fas fa-heart me-2"></i>
                  DS Yêu Thích 
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="/transaction">
                  <i className="fas fa-history me-2"></i>
                  Lịch sử giao dịch
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="/feedback">
                  <i className="fas fa-comment me-2"></i>
                  Đánh giá của tôi
                </NavDropdown.Item>
              </div>

            </NavDropdown>
            
            {user ? (
              <div className="profile-section">
                <div className="user-avatar" onClick={() => document.getElementById('profile-dropdown').click()}>
                  {user.image?.url ? (
                    <img src={user.image.url} alt={user.name} className="avatar-img" />
                  ) : (
                    <span className="avatar-text">{generateShortCutName(user.name.charAt(0).toUpperCase())}</span>
                  )}
                </div>
                <NavDropdown title={user.name} id="profile-dropdown" className="custom-dropdown user-dropdown">
                  <div className="dropdown-inner">
                    <div className="user-info">
                      <div className="user-avatar-large">
                        {user.image?.url ? (
                          <img src={user.image.url} alt={user.name} />
                        ) : (
                          <span>{generateShortCutName(user.name.charAt(0).toUpperCase())}</span>
                        )}
                      </div>
                      <div className="user-details">
                        <h6>{user.name}</h6>
                        <p>{user.email}</p>
                      </div>
                    </div>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="/update-customer">
                      <i className="fas fa-cog me-2"></i>
                      Cài đặt tài khoản
                    </NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.1">
                      <i className="fas fa-home me-2"></i>
                      Tài khoản chủ nhà
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={handleLogout} className="logout-item">
                      <i className="fas fa-sign-out-alt me-2"></i>
                      Đăng xuất
                    </NavDropdown.Item>
                  </div>
                </NavDropdown>
              </div>
            ) : (
              <Nav.Link className="login-btn" href="/">Đăng nhập</Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default CustomNavbar;