import React from 'react'
import { Container, Nav, Navbar } from 'react-bootstrap'


export const OwnerNavbar = () => {
    return (
        <Navbar bg="primary" variant="dark" expand="lg">
            <Container>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav ">
                    <Nav className="me-auto">
                        <Nav.Link href="/owner-homepage" className="text-white">
                            Trang chủ Nhóm chỗ nghỉ
                        </Nav.Link>
                        <Nav.Link href="booking-management" className="text-white">
                            Đặt phòng
                        </Nav.Link>
                        <Nav.Link href="/reviews" className="text-white">
                            Đánh giá
                        </Nav.Link>
                        <Nav.Link href="/owner-finance" className="text-white">
                            Tài chính
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}
