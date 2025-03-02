import { Container, Card, Button, Col, Row, InputGroup, Form, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { hotelType } from '../data/HotelOption';
import PropTypes from 'prop-types';

const Step3 = ({ nextStep, prevStep, selectedHotel }) => {
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
Step3.propTypes = {
    nextStep: PropTypes.func.isRequired,
    prevStep: PropTypes.func.isRequired,
    selectedHotel: PropTypes.func.isRequired
}
export default Step3;