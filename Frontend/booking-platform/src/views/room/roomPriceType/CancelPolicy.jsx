import { useState, useEffect } from 'react';
import { Card, Form, Button, Row, Col, Container, Spinner } from 'react-bootstrap';
import { FaChevronLeft, FaLightbulb, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const CancelPolicy = () => {
    const storageKey = 'cancelPolicy';
    const [open, setOpen] = useState(true);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    // Initialize state from sessionStorage
    const [policy, setPolicy] = useState({
        freeBefore: '18h00 ngày nhận phòng',
        chargeType: 'firstNight',
        protectBooking: false
    });

    const handleRadioChange = (e) => {
        setPolicy(prev => ({
            ...prev,
            chargeType: e.target.value
        }));
    };

    const handleCheckboxChange = () => {
        setPolicy(prev => ({
            ...prev,
            protectBooking: !prev.protectBooking
        }));
    };

    const toCreateRoom = () => {
        navigate('/create-room');
    }

    const handleSave = () => {
        setIsLoading(true);
        sessionStorage.setItem(storageKey, JSON.stringify(policy));
        setTimeout(() => {
            toCreateRoom();
            setIsLoading(false);
        }, 1000)
    };

    const handleCancel = () => {
        const savedData = sessionStorage.getItem(storageKey);
        if (savedData) {
            setPolicy(JSON.parse(savedData));
        } else {
            setPolicy({
                freeBefore: '18h00 ngày nhận phòng',
                chargeType: '',
                protectBooking: false
            });
        }
        toCreateRoom();
    };

    const handleOpenChange = () => {
        setOpen(!open);
    }

    return (
        <Container fluid>
            {isLoading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
                    <Spinner
                        animation="border"
                        role="status"
                        style={{ width: "3rem", height: "3rem" }} // Bigger size
                    />
                </div>
            ) : (
                <div className='mx-auto' style={{ maxWidth: '60%' }}>
                    <h4 className="mb-4 mt-5 fw-bold">Chính sách hủy đặt phòng</h4>
                    <Row>
                        <Col md={8}>
                            <Card className="mb-4">
                                <Card.Body>
                                    {/* Free cancellation section */}
                                    <div className="mb-4">
                                        <h6 className='fw-bold'>Khách có thể hủy đặt phòng miễn phí khi nào?</h6>
                                        <Form.Select
                                            value={policy.freeBefore}
                                            onChange={(e) => setPolicy(prev => ({ ...prev, freeBefore: e.target.value }))}
                                            className="mt-3"
                                        >
                                            <option value="18h00">Trước 18h00 ngày nhận phòng</option>
                                            <option value="1 day">Cho tới 1 ngày trước ngày nhận phòng</option>
                                            <option value="2 days">Cho tới 2 ngày trước ngày nhận phòng</option>
                                            <option value="3 days">Cho tới 3 ngày trước ngày nhận phòng</option>
                                            <option value="7 days">Cho tới 7 ngày trước ngày nhận phòng</option>
                                        </Form.Select>
                                    </div>

                                    {/* Charge type section */}
                                    <div className="mb-4">
                                        <h6 className='fw-bold'>Khách bị tính phí bao nhiêu nếu họ hủy sau thời gian hủy miễn phí (trước 18h00 ngày nhận phòng)?</h6>
                                        <Form.Group className="mt-3">
                                            <Form.Check
                                                type="radio"
                                                label="Giá cho đêm đầu tiên"
                                                value="firstNight"
                                                checked={policy.chargeType === 'firstNight'}
                                                onChange={handleRadioChange}
                                                className="mb-2"
                                            />
                                            <Form.Check
                                                type="radio"
                                                label="100% tổng giá"
                                                value="fullPrice"
                                                checked={policy.chargeType === 'fullPrice'}
                                                onChange={handleRadioChange}
                                            />
                                        </Form.Group>
                                    </div>

                                    {/* Protection section */}
                                    <div className="mb-4">
                                        <h6 className='fw-bold'>Bảo vệ khỏi đặt phòng do nhầm lẫn</h6>
                                        <Form.Check
                                            type="switch"
                                            label="Bật"
                                            checked={policy.protectBooking}
                                            onChange={handleCheckboxChange}
                                            className="mt-2"
                                        />
                                        <Form.Text className="text-muted">
                                            Để tránh việc Quý vị tốn thời gian xử lý các đặt phòng do nhầm lẫn,
                                            chúng tôi tự động miễn phí hủy cho các khách hủy trong vòng 24 giờ
                                            kể từ thời điểm đặt.
                                        </Form.Text>
                                    </div>


                                </Card.Body>

                            </Card>
                            <Row className="mt-4">
                                <Col md={3}>
                                    <Button variant="outline-primary" onClick={handleCancel}>
                                        <FaChevronLeft className='me-2' /> Hủy
                                    </Button>
                                </Col>
                                <Col md={9} className="text-end">
                                    <Button variant="primary" className='w-100' onClick={handleSave}>
                                        Lưu
                                    </Button>
                                </Col>
                            </Row>

                        </Col>
                        {open && (
                            <Col md={4}>
                                <Card className="p-3 position-relative">
                                    <FaTimes
                                        className="position-absolute top-0 end-0 mt-3    me-2 text-muted"
                                        style={{ cursor: "pointer" }}
                                        onClick={handleOpenChange}
                                    />

                                    <div className="d-flex">
                                        <span className="me-2"><FaLightbulb /></span>
                                        <div>
                                            <p className="text-dark fw-bold">
                                                Tôi nên chọn chính sách nào?
                                            </p>
                                            <div style={{ fontSize: "0.9rem" }}>
                                                <p>Các chính sách này có thể dễ dàng cập nhật lại sau.</p>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </Col>
                        )}
                    </Row>
                </div>
            )}
        </Container>
    );
};

export default CancelPolicy;