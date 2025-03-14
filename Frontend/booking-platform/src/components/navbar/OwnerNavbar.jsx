import React from 'react'
import { Container, Nav, Navbar } from 'react-bootstrap'

export const OwnerNavbar = () => {
    return (
        <Navbar bg="primary" variant="dark" expand="lg">
            <Container>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="#" className="text-white">
                            Trang chủ Nhóm chỗ nghỉ
                        </Nav.Link>
                        <Nav.Link href="#" className="text-white">
                            Đặt phòng
                        </Nav.Link>
                        <Nav.Link href="#" className="text-white">
                            Đánh giá
                        </Nav.Link>
                        <Nav.Link href="#" className="text-white">
                            Tài chính
                        </Nav.Link>
                        <Nav.Link href="#" className="text-white">
                            Chỉnh sửa dòng loạt
                        </Nav.Link>
                        <Nav.Link href="#" className="text-white">
                            Trung tâm Cơ hội dành cho Nhóm chỗ nghỉ
                        </Nav.Link>
                        <Nav.Link href="#" className="text-white">
                            Phân tích
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}
