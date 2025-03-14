import { useState } from "react"
import { Navbar, Nav, Container, Row, Col, Form, Button, Dropdown, Card } from "react-bootstrap"
import { Printer, Download, Filter, FileIcon as FileEarmark } from "lucide-react"
import { OwnerNavbar } from "../../components/navbar/OwnerNavbar"

export default function ReviewPage() {

    return (
        <div className="booking-app">
            {/* Navigation Bar */}
            <OwnerNavbar />
            <Container className="py-4">
                <label className="mb-2 text-dark fw-bold fs-3">Đánh giá
                </label>

                <div className="mb-4 d-flex align-items-center">
                    <div className="me-3">
                        <Form.Group>
                            <Form.Label>Ngày</Form.Label>
                            <Dropdown>
                                <Dropdown.Toggle variant="light" className=" text-start border">
                                    Nhận phòng
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item>Đặt phòng</Dropdown.Item>
                                    <Dropdown.Item>Nhận phòng</Dropdown.Item>
                                    <Dropdown.Item>Ngày đi</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Form.Group>
                    </div>

                    <div className="d-flex align-items-end gap-3">
                        <Form.Group className="">
                            <Form.Label>Lọc theo ngày</Form.Label>
                            <Form.Control type="date" className="border" />
                        </Form.Group>
                        <div className="">
                            <Button variant="outline-primary" >
                                <Filter className="me-2" size={16} />
                                Thêm bộ lọc
                            </Button>
                        </div>

                        <div className="">
                            <Button variant="primary" className="w-100  ">
                                Hiển thị đặt phòng
                            </Button>
                        </div>
                    </div>


                    <div className="ms-auto d-flex">
                        <Button variant="link" className="me-2 w-100 text-secondary">
                            <Printer size={16} />
                            <span className="ms-2 d-none d-lg-inline">In danh sách đặt phòng</span>
                        </Button>
                        <Button variant="link" className="text-secondary">
                            <Download size={16} />
                            <span className="ms-2 d-none d-lg-inline">Tải về</span>
                        </Button>
                    </div>

                </div>

                {/* No Bookings Message */}
                <Card className="text-center py-5 ">
                    <Card.Body>
                        <div className="mb-3">
                            <FileEarmark size={48} className="text-secondary" />
                        </div>
                        <Card.Text className="text-secondary">
                            Quý vị không có đặt phòng trong khoảng thời gian được chọn.
                        </Card.Text>
                    </Card.Body>
                </Card>
            </Container>
        </div>
    )
}

