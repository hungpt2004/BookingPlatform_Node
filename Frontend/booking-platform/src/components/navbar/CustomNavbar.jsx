import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/AxiosInstance'; // Import axiosInstance
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Card } from 'react-bootstrap';
import { useAuthStore } from '../../store/authStore';
import { generateShortCutName } from '../../utils/GenerateShortName';

function CustomNavbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    setUser(null);
    navigate('/'); // Điều hướng về trang đăng nhập
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get('/customer/current-user'); // Gọi API từ backend
        setUser(response.data.user);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, []);

  // const handleLogout = () => {
  //   sessionStorage.removeItem('token'); // Xóa token khi logout
  //   setUser(null);
  //   navigate('/'); // Điều hướng về trang đăng nhập
  // };

  return (
    <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary sticky-top">
      <Container className='d-flex align-items-center justify-content-center'>
        <Navbar.Brand className='fs-2' style={{ color: 'dodgerblue' }} href="/home">Travelofy</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#deets">Website Scope</Nav.Link>
            <Nav.Link eventKey={2} href="#memes">Achievements</Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link href="/home">Home</Nav.Link>
            <Nav.Link href="#">About</Nav.Link>
            <NavDropdown title="Service" id="collapsible-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Favorite List</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="/transaction">Transaction History</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.3">Information</NavDropdown.Item>
            </NavDropdown>
            <Container className="d-flex align-items-center">
              {user ? (
                <>
                  <Card
                    style={{
                      width: '50px',
                      height: '50px',
                      borderColor: 'grey',
                      borderWidth: '1px',
                      borderRadius: '50%',
                      display: 'inline-block',
                      textAlign: 'center',
                      overflow: 'hidden',
                    }}
                  >
                    {user.image?.url ? (
                      <img
                        src={user.image.url}
                        alt={user.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    ) : (
                      <span style={{ fontSize: '20px', lineHeight: '50px', color: 'white' }}>
                        {generateShortCutName(user.name.charAt(0).toUpperCase())}
                      </span>
                    )}
                  </Card>
                  <NavDropdown title={user.name} id="collapsible-nav-dropdown">
                    <NavDropdown.Item href="#action/3.1">Setting</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="#action/3.1">Owner Account</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                  </NavDropdown>
                </>
              ) : (
                <Nav.Link href="/">Login</Nav.Link>
              )}
            </Container>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default CustomNavbar;