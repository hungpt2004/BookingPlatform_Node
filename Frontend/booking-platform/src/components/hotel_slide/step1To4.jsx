import { Button, Card, Badge, Col, Row, Container, OverlayTrigger, Form, Tooltip, InputGroup } from "react-bootstrap";
import { MdFlashOn } from "react-icons/md";
import { FaHotel } from "react-icons/fa6";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { mainOptions, extraOptions, hotelType } from "../data/HotelOption.js";

export const Step1 = ({ nextStep }) => {
    return (
        <>
            <div className="text-center mt-5">
                <h1>Tạo khách sạn của bạn thật nhanh với Travelofy</h1>
                <h3>Để bắt đầu, hãy chọn chỗ nghỉ mà bạn muốn đăng ký trên Travelofy</h3>
            </div>

            <div className="container mt-5">
                <div className="justify-content-center row">
                    {[
                        { title: "Khách sạn", icon: <FaHotel size={100} className="text-primary mt-3 pt-3" /> }

                    ].map((item, index) => (
                        <div key={index} className="col-md-3">
                            <Card className="align-items-center card-hover" onClick={nextStep} style={{ cursor: "pointer" }}>
                                {index === 0 && (
                                    <div className="position-absolute" style={{ top: "-12px", left: "50%", transform: "translateX(-50%)", zIndex: 10 }}>
                                        <Badge bg="success" className="px-3 py-2 d-flex align-items-center ">
                                            <MdFlashOn size={16} className="me-1" /> Bắt đầu nhanh
                                        </Badge>
                                    </div>
                                )}
                                {item.icon}
                                <Card.Body className="text-center">
                                    <Card.Title>{item.title}</Card.Title>
                                    <Card.Text>Chỗ nghỉ tự nấu với đầy đủ nội thất</Card.Text>
                                    <Button variant="primary">Chọn</Button>
                                </Card.Body>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>

            <style>
                {`
                .card-hover {
                    transition: all 0.3s ease-in-out;
                    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
                }

                .card-hover:hover {
                    transform: translateY(-5px);
                    box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.3);
                }
                `}
            </style>
        </>
    );
};
export const Step2 = ({ nextStep, prevStep }) => {
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
export const Step3 = ({ nextStep, prevStep, selectedHotel }) => {
    // Initialize with value from sessionStorage if available
    const savedHotel = JSON.parse(sessionStorage.getItem("selectedHotel") || '{"id":1}');
    const [selected, setSelected] = useState(savedHotel.id);

    // Initialize hotelCount from sessionStorage if available and if option 2 is selected
    const [hotelCount, setHotelCount] = useState(() => {
        return savedHotel.hotelCount || "";
    });

    // When component mounts, trigger the selectedHotel callback with the current selection
    useEffect(() => {
        const currentSelection = hotelType.find(item => item.id === selected);
        if (currentSelection) {
            const hotelData = {
                ...currentSelection,
                hotelCount: selected === 2 ? hotelCount : undefined
            };

            // Save to sessionStorage
            sessionStorage.setItem("selectedHotel", JSON.stringify(hotelData));

            // Update parent component
            selectedHotel(hotelData);
        }
    }, []);

    const renderTooltip = (props) => (
        <Tooltip id="input-tooltip" {...props}>
            Số khách sạn phải từ 2 đến 10
        </Tooltip>
    );

    //validate number input 
    const handleNumberInput = (e) => {
        let value = parseInt(e.target.value, 10);
        if (isNaN(value)) value = "";
        else {
            if (value < 2) value = 2;
            if (value > 10) value = 10;
        }
        setHotelCount(value);

        // Update the selected hotel data with the hotel count
        if (selected === 2) {
            const currentSelection = hotelType.find(item => item.id === selected);
            const hotelData = {
                ...currentSelection,
                hotelCount: value
            };

            // Save to sessionStorage
            sessionStorage.setItem("selectedHotel", JSON.stringify(hotelData));

            // Update parent component
            selectedHotel(hotelData);
        }
    }

    const handleSelect = (option) => {
        setSelected(option.id);

        // Create hotel data object including hotelCount if option 2 is selected
        const hotelData = {
            ...option,
            hotelCount: option.id === 2 ? hotelCount : undefined
        };

        // Save to sessionStorage
        sessionStorage.setItem("selectedHotel", JSON.stringify(hotelData));

        // Pass the entire hotel object to the parent component
        selectedHotel(hotelData);
    };

    return (
        <Container className='mt-4 pb-5'>
            <h2 className="text-center mb-4" style={{ userSelect: "none" }}>
                Quý vị định đăng ký bao nhiêu khách sạn?
            </h2>

            <Card className="p-4 shadow-sm">
                <Col className="g-2">
                    {hotelType.map((option) => (
                        <Row key={option.id} xs={2} md={2} lg={2}>
                            <Card
                                className={`p-3 g-3 shadow-sm ${selected === option.id ? "border-primary border-3" : ""}`}
                                style={{ cursor: "pointer", minHeight: "100px", userSelect: "none" }}
                                onClick={() => handleSelect(option)}
                            >
                                <Card.Body>
                                    <Card.Title className="fs-5">{option.title}</Card.Title>
                                </Card.Body>
                            </Card>
                        </Row>
                    ))}
                </Col>

                {/* Chỉ hiển thị InputGroup nếu chọn "Nhiều khách sạn với nhiều phòng" (id=2) */}
                {selected === 2 && (
                    <OverlayTrigger
                        placement="right"
                        delay={{ show: 250, hide: 400 }}
                        overlay={renderTooltip}>
                        <Form.Group className={`mt-3 shadow-sm ${selected ? "border-primary border-3" : ""}`} style={{ width: "400px" }}>
                            <Form.Label className="fw-bold" style={{ userSelect: "none" }}>Số khách sạn</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    type="number"
                                    placeholder="Nhập số khách sạn"
                                    value={hotelCount}
                                    onChange={handleNumberInput}
                                    aria-label="Số khách sạn"
                                    min="2"
                                    max="10"
                                />
                            </InputGroup>
                        </Form.Group>
                    </OverlayTrigger>
                )}
            </Card>

            {/* Nút Quay lại & Tiếp tục */}
            <div className="d-flex justify-content-between mt-4 mb-5">
                <Button variant="secondary" onClick={prevStep}>
                    Quay lại
                </Button>
                <Button variant="primary" disabled={selected === 2 && !hotelCount} onClick={nextStep}>
                    Tiếp tục
                </Button>
            </div>
        </Container>
    );
};
export const Step4 = ({ nextStep, prevStep, hotelType }) => {
    const handlePrevStep = () => {
        sessionStorage.removeItem("selectedHotel");
        prevStep();
    }
    return (
        <Container className="mt-5 pb-5 d-flex justify-content-center">
            <Card className="p-4 shadow-sm" style={{ width: "420px" }}>
                <Card.Body className="text-center">
                    <p className="fw-semibold">Quý vị đang đăng:</p>
                    <FaHotel size={80} className="text-primary my-3" />
                    <Card.Title className="fw-bold fs-5">
                        {hotelType?.title || "Error"}
                    </Card.Title>
                    <Card.Text className="mt-3">
                        Quý vị thấy có đúng như chỗ nghỉ của mình không?
                    </Card.Text>

                    <div className="d-grid gap-3 mt-4">
                        <Button variant="primary" size="lg" className="w-100" onClick={nextStep}>
                            Tiếp tục
                        </Button>
                        <Button variant="outline-primary" size="lg" className="w-100" onClick={handlePrevStep}>
                            Không, tôi cần thay đổi
                        </Button>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
};

Step1.propTypes = Step2.propTypes = Step3.propTypes = Step4.propTypes = {
    nextStep: PropTypes.func.isRequired,
    prevStep: PropTypes.func.isRequired,
    selectedHotel: PropTypes.func.isRequired,
    hotelType: PropTypes.shape({
        title: PropTypes.string.isRequired
    }).isRequired

}

