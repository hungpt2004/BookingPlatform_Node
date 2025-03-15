import { Search, ThumbsUp, ThumbsDown, Clock } from "lucide-react";
import { Button, Container, Table, Alert, Form, InputGroup } from "react-bootstrap";
import { OwnerNavbar } from "../../components/navbar/OwnerNavbar";

export default function BookingDashboard() {
    return (
        <>
            <OwnerNavbar />

            <Container className="py-4">
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1 className="fs-3 fw-bold">Trang chủ Nhóm chỗ nghỉ</h1>
                    <Button variant="primary p-2" style={{ width: "fit-content" }}>Thêm chỗ nghỉ mới</Button>
                </div>

                {/* Warning Box */}
                {/* <Alert variant="warning" className="d-flex gap-3">
                    <Clock size={20} className="" />
                    <div>
                        <Alert.Heading>Cần hành động: bổ sung thông tin ngân hàng cho chỗ nghỉ</Alert.Heading>
                        <p>
                            Vui lòng bổ sung thông tin ngân hàng để nhận Thanh toán bởi Booking.com. Nếu không có thông tin này trong hệ thống, chúng tôi sẽ không thể thanh toán cho Quý vị, đồng thời các vấn đề pháp lý có thể sẽ phát sinh.
                        </p>
                        <Button variant="link" className="p-0 text-decoration-none" style={{ width: "fit-content" }}>Thêm thông tin ngân hàng</Button>
                    </div>
                </Alert> */}

                {/* Filters */}
                <div className="d-flex gap-3 mb-4">
                    <Form.Select className="w-auto">
                        <option value="all">Tất cả chỗ nghỉ</option>
                        <option value="active">Đang hoạt động</option>
                        <option value="inactive">Không hoạt động</option>
                    </Form.Select>

                    <InputGroup className="w-50">
                        <InputGroup.Text><Search size={18} /></InputGroup.Text>
                        <Form.Control type="text" placeholder="Lọc theo ID chỗ nghỉ, tên" />
                    </InputGroup>
                </div>

                {/* Table */}
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Chỗ nghỉ</th>
                            <th>Trạng thái trên Booking.com</th>
                            <th>Đến trong 48 giờ tới</th>
                            <th>Rời đi trong 48 giờ tới</th>
                            <th>Tin nhắn từ khách</th>
                            <th>Tin nhắn từ Booking.com</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>13774829</td>
                            <td>
                                <div className="d-flex align-items-center gap-2">
                                    <img
                                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-dVWD6wnwW85l8IBwpvTwKLB25dmY3V.png"
                                        alt="Vietnam flag"
                                        className="" style={{ width: '24px', height: '16px' }}
                                    />
                                    <span>Sora</span>
                                </div>
                            </td>
                            <td className="d-flex align-items-center gap-2">
                                <span className="bg-success rounded-circle d-inline-block" style={{ width: '8px', height: '8px' }}></span>
                                Mở / Có thể đặt phòng
                            </td>
                            <td>0</td>
                            <td>0</td>
                            <td>0</td>
                            <td>0</td>
                        </tr>
                    </tbody>
                </Table>

                {/* Feedback Section */}
                <div className="p-3 bg-light border rounded mt-4">
                    <p className="mb-2">Phản hồi của Quý vị rất quan trọng với chúng tôi. Quý vị thấy dữ liệu này có hữu ích không?</p>
                    <div className="d-flex gap-2">
                        <Button variant="outline-primary">
                            <ThumbsUp size={18} />
                        </Button>
                        <Button variant="outline-secondary">
                            <ThumbsDown size={18} />
                        </Button>
                    </div>
                </div>
            </Container>

        </>
    );
}