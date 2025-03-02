import { useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { mainOptions, extraOptions } from "../data/HotelOption.js";
import PropTypes from "prop-types";

const Step2 = ({ nextStep, prevStep }) => {
    const [selected, setSelected] = useState(null);
    const [showExtra, setShowExtra] = useState(false);

    return (
        <Container className="mt-4 pb-5">
            <h2 className="text-center mb-4" style={{ userSelect: "none" }}>Chỗ nghỉ nào trong danh sách dưới đây giống với chỗ nghỉ của Quý vị nhất?</h2>

            <Card className="p-4 shadow-sm">
                <Row className="g-3">
                    {[...mainOptions, ...(showExtra ? extraOptions : [])].map((option) => (
                        <Col key={option.id} xs={12} md={6} lg={4}>
                            <Card
                                className={`p-2 shadow-sm ${selected === option.id ? "border-primary border-3" : ""}`}
                                style={{ cursor: "pointer", minHeight: "150px", userSelect: "none" }}
                                onClick={() => setSelected(option.id)}
                            >
                                <Card.Body>
                                    <Card.Title className="fs-5">{option.title}</Card.Title>
                                    <Card.Text className="text-muted">{option.desc}</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>

                {/* Nút Thêm lựa chọn / Thu gọn */}
                <div className="text-center mt-3">
                    {!showExtra ? (
                        <Button variant="outline-primary" onClick={() => setShowExtra(true)}>
                            + Thêm lựa chọn
                        </Button>
                    ) : (
                        <Button variant="outline-secondary" onClick={() => setShowExtra(false)}>
                            - Thu gọn lựa chọn
                        </Button>
                    )}
                </div>
            </Card>

            {/* Nút Quay lại & Tiếp tục */}
            <div className="d-flex justify-content-between mt-4 mb-5">
                <Button variant="secondary" onClick={prevStep}>
                    Quay lại
                </Button>
                <Button variant="primary" disabled={!selected} onClick={nextStep}>
                    Tiếp tục
                </Button>
            </div>
        </Container>
    );
};
Step2.propTypes = {
    nextStep: PropTypes.func.isRequired,
    prevStep: PropTypes.func.isRequired
};
export default Step2;
