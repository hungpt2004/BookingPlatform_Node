import { useState } from "react"
import { Navbar, Nav, Container, Row, Col, Form, Button, Dropdown, Card } from "react-bootstrap"
import { Printer, Download, Filter, FileIcon as FileEarmark } from "lucide-react"
import Sidebar from "../../components/navbar/OwnerSidebar"

export default function ReviewPage() {

    return (
        <div className="booking-app">
            {/* Navigation Bar */}
            <Sidebar />
            <Container className="py-4">
                <label className="mb-2 text-dark fw-bold fs-3">Đánh giá
                </label>

                <div className="mb-4 d-flex align-items-center">
                    <div className="d-flex align-items-end gap-3">
                        <Form.Group className="">
                            <Form.Label>Lọc theo ngày</Form.Label>
                            <div className="d-flex">
                                <Form.Control type="date" placeholder="Từ ngày" />
                                <Form.Control type="date" placeholder="Đến ngày" />
                            </div >
                        </Form.Group>
                        <div className="me-3">
                            <Form.Group>
                                <Form.Label>Lọc theo một hoặc nhiều ID chỗ nghỉ
                                </Form.Label>
                                <Form.Control type="text" placeholder="Nhập một hoặc nhiều ID chỗ nghỉ" />
                            </Form.Group>
                        </div>

                        <div className="">
                            <Button variant="primary" className="w-100  ">
                                Hiển thị đánh giá
                            </Button>
                        </div>
                    </div>


                    <div className="ms-auto mt-auto w-25">
                        <Form.Control
                            type="text"
                            placeholder="Tìm theo điểm, ngày, bình luận..."
                        />
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

