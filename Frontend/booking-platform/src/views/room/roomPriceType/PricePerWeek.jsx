import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Form, Button, Row, Col } from 'react-bootstrap';
const PricePerWeek = () => {
    const navigate = useNavigate();
    const [isEnabled, setIsEnabled] = useState(false);
    const [discount, setDiscount] = useState(15);

    // Load saved data from sessionStorage
    useEffect(() => {
        const savedData = JSON.parse(sessionStorage.getItem('weeklyPricingSettings')) || {};
        setIsEnabled(savedData.enabled || true);
        setDiscount(savedData.discount || 15);
    }, []);

    const handleSave = () => {
        sessionStorage.setItem('weeklyPricingSettings', JSON.stringify({
            enabled: isEnabled,
            discount: discount
        }));
        navigate(-1);
    };

    return (
        <Container className="mt-4 w-50">
            <Row>
                <h3 className="fw-bold mb-4">Thiết lập giá theo tuần</h3>

                <Col md={8}>
                    <Card className="mb-4 p-2">
                        <Card.Body>
                            <Card.Text>
                                Ngoài loại giá tiêu chuẩn Quý vị đã tạo cho chỗ nghỉ. Quý vị có thể thêm loại giá theo tuần.
                            </Card.Text>
                            <Card.Text>
                                Với loại giá này, Quý vị có thể cài đặt giá thấp hơn trong khi vẫn sử dụng cùng chính sách hủy với loại giá tiêu chuẩn. Khách lưu trú ít nhất 1 tuần rất quan tâm đến giảm giá vì họ sẽ chi nhiều hơn cho đặt phòng của mình.
                            </Card.Text>

                            <Form.Check
                                type="switch"
                                id="weekly-pricing-toggle"
                                label="Thiết lập loại giá theo tuần"
                                checked={isEnabled}
                                onChange={(e) => setIsEnabled(e.target.checked)}
                                className="mb-4"
                            />

                            {isEnabled && (
                                <>
                                    <hr />
                                    <p className="mt-4 fw-bold">
                                        Quý vị muốn loại giá này thấp hơn giá tiêu chuẩn bao nhiêu?
                                    </p>

                                    <Form.Group className="d-flex align-items-center mb-4">
                                        <Form.Control
                                            type="number"
                                            value={discount}
                                            onChange={(e) => setDiscount(Math.min(Number(e.target.value), 100))}
                                            className="w-100"
                                            min="0"
                                            max="100"
                                        />
                                        <span className="input-group-text">%</span>
                                    </Form.Group>
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

            </Row>
        </Container>
    );
};

export default PricePerWeek;