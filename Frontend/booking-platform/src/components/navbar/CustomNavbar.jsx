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
import '../navbar/CustomNavbar.css'; // Import file CSS mới

function CustomNavbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { logout } = useAuthStore();

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
    <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary sticky-top">
      <Container className='d-flex align-items-center justify-content-center'>
        <Navbar.Brand className='fs-1 fw-bold' style={{ color: '#003b95' }} href="/home">Travelofy</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link className="custom-nav-link fs-4" href="#deets">Website Scope</Nav.Link>
            <Nav.Link className="custom-nav-link fs-4" eventKey={2} href="#memes">Achievements</Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link className="custom-nav-link fs-4" href="/home">Home</Nav.Link>
            <Nav.Link className="custom-nav-link fs-4" href="#">About</Nav.Link>
            <NavDropdown className="fs-4" title="Service" id="collapsible-nav-dropdown">
            <NavDropdown.Item href="/favorite-list">Favorite List</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="/transaction">Transaction History</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="/feedback">My Feedback</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="/create-hotel">Create Hotel</NavDropdown.Item>
            </NavDropdown>
            <Container className="d-flex align-items-center">
              {user ? (
                <>
                  <Card className="profile-card rounded-5">
                    {user.image?.url ? (
                      <img src={user.image.url} alt={user.name} className="profile-img" />
                    ) : (
                      <span className="profile-text fs-4">{generateShortCutName(user.name.charAt(0).toUpperCase())}</span>
                    )}
                  </Card>
                  <NavDropdown className="" title={user.name} id="collapsible-nav-dropdown">
                    <NavDropdown.Item href="/update-customer">Setting</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="#action/3.1">Owner Account</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                  </NavDropdown>
                </>
              ) : (
                <Nav.Link className="custom-nav-link" href="/">Login</Nav.Link>
              )}
            </Container>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default CustomNavbar;
