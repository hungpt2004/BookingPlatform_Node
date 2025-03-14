import React from "react";
import { Navbar, Nav, Container, Dropdown, Image } from "react-bootstrap";
import './sidebar.css'

export const AdminCustomNavbar = () => {
  return (
    <Navbar bg="white"  className="mb-3 text-dark">
      <Container>
         <Navbar.Brand href="#" className="fw-bold fs-2 auto-typing">TRAVELOFY</Navbar.Brand>
        <Nav className="ms-auto">
          <Dropdown align="end">
            <Dropdown.Toggle variant="white" id="dropdown-basic" className="d-flex align-items-center text-dark">
              <Image
                src="https://mdbcdn.b-cdn.net/img/new/avatars/2.webp" // Thay bằng link avatar thật
                roundedCircle
                width="40"
                height="40"
                className="me-2"
              />
              <span className="text-dark">HungPT</span>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item href="#">Settings</Dropdown.Item>
              <Dropdown.Item href="#">Logout</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Nav>
      </Container>
    </Navbar>
  );
};
