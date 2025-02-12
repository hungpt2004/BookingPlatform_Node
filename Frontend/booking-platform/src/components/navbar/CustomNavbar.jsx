import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Card } from 'react-bootstrap';
import { Badge } from 'react-bootstrap';
import { generateShortCutName } from '../../utils/GenerateShortName';

function CustomNavbar({user}) {
  return (
    <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary sticky-top">
      <Container className='d-flex align-items-center justify-content-center'>
        <Navbar.Brand className='fs-2' style={{ color: 'dodgerblue' }} href="#home">Travelofy</Navbar.Brand>
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
              <Card
                style={{
                  width: '50px',
                  borderColor: 'grey',
                  borderWidth: '1px',
                  borderRadius: '20px',
                  display: 'inline-block',
                  textAlign: 'center',
                }}
              >
                {/* {generateShortCutName(user.name)} */}
                HP
              </Card>
              {/* <NavDropdown title={user.name} id="collapsible-nav-dropdown"> */}
               <NavDropdown title='Hung' id="collapsible-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Setting</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.1">Owner Account</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.2">Logout</NavDropdown.Item>
            </NavDropdown>
            </Container>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default CustomNavbar;