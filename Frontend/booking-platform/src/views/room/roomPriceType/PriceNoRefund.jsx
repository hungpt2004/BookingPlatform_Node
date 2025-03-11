import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Form, Button, Row, Col, Table } from 'react-bootstrap';
import { formatCurrencyVND } from '../../../utils/FormatPricePrint';
import { FaInfo, FaInfoCircle, FaTimes } from 'react-icons/fa';

const PriceNoRefund = () => {
    const navigate = useNavigate();
    const [isEnabled, setIsEnabled] = useState(false);
    const [discount, setDiscount] = useState(10);
    const [open, setOpen] = useState(true);
    const basePrice = Number(sessionStorage.getItem('price')) || 0;

    // Load saved data from sessionStorage
    useEffect(() => {
        const savedData = JSON.parse(sessionStorage.getItem('nonRefundableSettings')) || {};
        setIsEnabled(savedData.enabled || true);
        setDiscount(savedData.discount || 10);
    }, []);

    const handleSave = () => {
        sessionStorage.setItem('nonRefundableSettings', JSON.stringify({
            enabled: isEnabled,
            discount: discount
        }));
        navigate(-1);
    };

    const ToggleOpen = () => {
        setOpen(!open);
    };

    const calculateFinalPrice = () => {
        return basePrice * (1 - discount / 100);
    };

    return (
        <Container className="mt-4 w-50">
            <Row>
                <h3 className="fw-bold mb-4">Thiết lập loại giá không hoàn tiền</h3>

                <Col md={8}>
                    <Card className="mb-4 p-2">
                        <Card.Body>
                            <Card.Text>Ngoài loại giá tiêu chuẩn Quý vị đã tạo cho chỗ nghỉ, Quý vị có thể thêm loại giá không hoàn tiền.
                            </Card.Text>
                            <Card.Text>
                                Với việc này, Quý vị thiết lập giảm giá nhưng <strong>doanh thu của Quý vị cho các đặt phòng này lại được đảm bảo</strong> vì khách sẽ không được hoàn tiền nếu họ hủy hoặc vắng mặt.
                            </Card.Text>
                            <Form.Check
                                type="switch"
                                id="non-refundable-toggle"
                                label="Thiết lập loại giá không hoàn tiền"
                                checked={isEnabled}
                                onChange={(e) => setIsEnabled(e.target.checked)}
                                className="mb-5"
                            />

                            {isEnabled && (
                                <>
                                    <hr />
                                    <p className="mb-3 mt-4 fw-bold">Giảm giá cho khách đặt với loại giá này:</p>
                                    <Form.Group className='d-flex align-items-center mb-4'>
                                        <Form.Control
                                            type="number"
                                            value={discount}
                                            onChange={(e) => setDiscount(Math.min(Number(e.target.value), 99))}
                                            className='w-100'
                                            min={1}
                                        />
                                        <span className='input-group-text'>%</span>

                                    </Form.Group>
                                    <div className="mb-4">
                                        <div className='row'>
                                            <p className='col-6'>{formatCurrencyVND(basePrice)}</p>
                                            <div className="text-muted  col-6">Giá cơ bản</div>

                                        </div>
                                        <div className='row'>
                                            <p className="text-danger col-6">{discount}%</p>
                                            <div className="text-muted  col-6">Giảm giá khi khách đặt lựa chọn không hoàn tiền</div>

                                        </div>
                                        <div className='row' style={{ backgroundColor: '#F0F6FF' }}>
                                            <p className='col-6'>{formatCurrencyVND(calculateFinalPrice())}</p>
                                            <div className="text-muted col-6" >Giá không hoàn tiền</div>
                                        </div>
                                    </div>

                                    <div className='d-flex '>
                                        <span><FaInfoCircle className='text-secondary me-2' /></span>
                                        <p>Những khách chọn mức giá không hoàn tiền thường muốn tìm mức giá cạnh tranh. Giảm giá ít nhất 10% sẽ thu hút nhiều khách hơn bằng cách cải thiện mức độ hiển thị của chỗ nghỉ.
                                        </p>
                                    </div>

                                </>
                            )}

                        </Card.Body>
                    </Card>

                    <div className="d-flex justify-content-between mt-4">
                        <Button variant="outline-secondary" onClick={() => navigate(-1)}>
                            Hủy
                        </Button>
                        <Button variant="primary" onClick={handleSave}>
                            Lưu
                        </Button>
                    </div>
                </Col>

                {open && (
                    <Col md={4}>
                        <Card className="p-4 position-relative">
                            <FaTimes
                                className="position-absolute top-0 end-0 m-2 text-muted"
                                style={{ cursor: 'pointer' }}
                                onClick={ToggleOpen}
                            />
                            <h6 className="fw-bold">Tại sao tôi cần thêm loại giá không hoàn tiền?</h6>
                            <p className="small">
                                Khi xóa loại giá này, tất cả thiết lập liên quan sẽ bị mất.
                                Bạn có thể tạo lại bất cứ lúc nào.
                            </p>
                        </Card>
                    </Col>
                )}
            </Row>
        </Container>
    );
};

export default PriceNoRefund;