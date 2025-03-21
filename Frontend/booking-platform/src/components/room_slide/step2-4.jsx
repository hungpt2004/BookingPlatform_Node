import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import PropTypes from "prop-types";
import { FaChevronLeft, FaTimes } from "react-icons/fa";
import { FaLightbulb } from "react-icons/fa6";
import axiosInstance from "../../utils/AxiosInstance";

export const Step2 = ({ nextStep, prevStep }) => {
    const savedData = JSON.parse(sessionStorage.getItem("bathroomData")) || {
        isPrivateBathroom: true,
        amenities: [],
    };
    const [formData, setFormData] = useState(savedData);

    const amenitiesList = [
        "Giấy vệ sinh",
        "Vòi sen",
        "Nhà vệ sinh",
        "Máy sấy tóc",
        "Bồn tắm",
        "Đồ vệ sinh cá nhân miễn phí",
        "Chậu rửa vệ sinh (bidet)",
        "Dép",
        "Áo choàng tắm",
        "Bồn tắm spa",
    ];
    useEffect(() => {
        sessionStorage.setItem("bathroomData", JSON.stringify(formData));
    }, [formData]);


    // Handle change for radio buttons
    const handleRadioChange = (value) => {
        setFormData((prev) => ({
            ...prev,
            isPrivateBathroom: value,
        }));
    };

    // Handle checkbox change
    const handleCheckboxChange = (amenity) => {
        setFormData((prev) => {
            const updatedAmenities = prev.amenities.includes(amenity)
                ? prev.amenities.filter((item) => item !== amenity)
                : [...prev.amenities, amenity];

            return { ...prev, amenities: updatedAmenities };
        });
    };

    return (
        <Container fluid className="bg-light p-4">
            <Row className="w-75">
                <Col md={8}>
                    <h4 className="mb-3 fw-bold fs-3">Thông tin phòng tắm</h4>

                    <Card className="p-4">
                        {/* Private or Shared Bathroom */}
                        <Form.Group>
                            <Form.Label className="fw-bold">Đây có phải phòng tắm riêng không?</Form.Label>
                            <div>
                                <Form.Check
                                    type="radio"
                                    label="Đúng"
                                    name="isPrivateBathroom"
                                    checked={formData.isPrivateBathroom}
                                    onChange={() => handleRadioChange(true)}
                                />
                                <Form.Check
                                    type="radio"
                                    label="Không phải, đây là phòng tắm chung"
                                    name="isPrivateBathroom"
                                    checked={!formData.isPrivateBathroom}
                                    onChange={() => handleRadioChange(false)}
                                />
                            </div>
                        </Form.Group>

                        <hr />

                        {/* Bathroom Amenities */}
                        <Form.Group>
                            <Form.Label className="fw-bold">Phòng tắm trong phòng này có vật dụng gì?</Form.Label>
                            {amenitiesList.map((amenity, index) => (
                                <Form.Check
                                    key={index}
                                    type="checkbox"
                                    label={amenity}
                                    checked={formData.amenities.includes(amenity)}
                                    onChange={() => handleCheckboxChange(amenity)}
                                />
                            ))}
                        </Form.Group>
                    </Card>
                    {/* Navigation Buttons */}
                    <Row className="mt-4">
                        <Col>
                            <Button variant="secondary" onClick={prevStep}>
                                Quay lại
                            </Button>
                        </Col>
                        <Col className="text-end">
                            <Button variant="primary" onClick={nextStep}>
                                Tiếp tục
                            </Button>
                        </Col>
                    </Row>

                </Col>

                {/* Hint Box on the Right */}
                <Col md={4} className="mt-5">
                    <Card className="p-3">
                        <strong>Quý vị vẫn đang cân nhắc?</strong>
                        <p className="mt-2 mb-0">
                            Đừng lo, Quý vị có thể cập nhật các vật dụng phòng tắm tại chỗ nghỉ sau.
                        </p>
                    </Card>
                </Col>

            </Row>

        </Container>
    );
};
export const Step3 = ({ nextStep, prevStep }) => {
    const storageKey = "facilities";
    const [generalOptions, setGeneralOptions] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState(() => {
        const savedSelections = sessionStorage.getItem(storageKey);
        return savedSelections ? JSON.parse(savedSelections) : [];
    });

    useEffect(() => {
        const fetchFacilities = async () => {
            try {
                const response = await axiosInstance.get('/roomFacility/get-hotelfacilities');
                setGeneralOptions(response.data.facilities);
            } catch (error) {
                console.error('Error fetching facilities:', error);
                // Optionally set default facilities here
                setGeneralOptions([
                    { _id: "1", name: "Giá treo quần áo" },
                    { _id: "2", name: "TV màn hình phẳng" },
                    { _id: "3", name: "Wifi" },
                    { _id: "4", name: "Tivi" },
                ]); // Default facilities
            }
        };
        fetchFacilities();
    }, []);

    const handleCheckboxChange = (facilityId) => {
        const updatedSelections = selectedOptions.includes(facilityId)
            ? selectedOptions.filter(id => id !== facilityId)
            : [...selectedOptions, facilityId];

        setSelectedOptions(updatedSelections);
        sessionStorage.setItem(storageKey, JSON.stringify(updatedSelections));
    };

    return (
        <Container className="mt-4 w-50">
            <h3 className="mb-3 fs-3 fw-bold">Khách có thể sử dụng gì trong phòng này?</h3>
            <Card className="p-3 mb-3">
                <div className="mb-3">
                    <h5 className="fw-bold">Tiện nghi chung</h5>
                    {generalOptions.map((facility) => (
                        <Form.Check
                            key={facility._id}
                            label={facility.name}
                            checked={selectedOptions.includes(facility._id)}
                            onChange={() => handleCheckboxChange(facility._id)}
                        />
                    ))}
                </div>

                {/* Commented out other sections */}
                {/* <hr />
                <div className="mt-3 mb-3">
                    <h5 className="fw-bold">Không gian ngoài trời và tầm nhìn</h5>
                    {outsidesOptions.map((item) => (
                        <Form.Check
                            key={item}
                            label={item}
                            checked={selectedOptions.includes(item)}
                            onChange={() => handleCheckboxChange(item)}
                        />
                    ))}
                </div>
                <hr />
                <div className="mt-3">
                    <h5 className="fw-bold">Đồ ăn thức uống</h5>
                    {foodDrinkOptions.map((item) => (
                        <Form.Check
                            key={item}
                            label={item}
                            checked={selectedOptions.includes(item)}
                            onChange={() => handleCheckboxChange(item)}
                        />
                    ))}
                </div> */}
            </Card>

            <Row className="mt-3">
                <Col>
                    <Button variant="outline-primary" onClick={prevStep}>
                        <FaChevronLeft />
                    </Button>
                </Col>
                <Col className="text-end">
                    <Button variant="primary" onClick={nextStep} disabled={selectedOptions.length === 0}>
                        Tiếp tục
                    </Button>
                </Col>
            </Row>
        </Container>
    );
};

export const Step4 = ({ nextStep, prevStep }) => {
    const storageKey = "roomName";
    const [open, setOpen] = useState(true);

    // Load saved room name or set a default value
    const [roomName, setRoomName] = useState(() => {
        return sessionStorage.getItem(storageKey) || "Phòng Giường Đôi";
    });

    const handleRoomChange = (e) => {
        const newRoomName = e.target.value;
        setRoomName(newRoomName);
        sessionStorage.setItem(storageKey, newRoomName);
    };

    const handleOpenChange = () => {
        setOpen(!open);
    };

    return (
        <Container className="mt-4 w-50">
            <h3 className="mb-3 fw-bold">Tên của phòng này là gì?</h3>
            <Row>
                <Col md={8}>
                    <Card className=" mb-3" style={{ padding: "1.5rem", paddingBottom: "10rem" }}>
                        <p>
                            Đây là tên mà khách sẽ thấy trên trang chỗ nghỉ của Quý vị. Hãy chọn tên
                            miêu tả phòng này chính xác nhất.
                        </p>

                        <Form.Group controlId="roomName">
                            <Form.Label><strong>Tên phòng</strong></Form.Label>
                            <Form.Select value={roomName} onChange={handleRoomChange}>
                                <option value="Phòng giường đôi">Phòng giường đôi</option>
                                <option value="Phòng giường đơn">Phòng giường đơn</option>
                                <option value="Phòng giường 4 người">Phòng giường 4 người</option>
                                <option value="Phòng 2 giường đơn">Phòng 2 giường đơn</option>
                            </Form.Select>
                        </Form.Group>
                    </Card>
                    <Row className="mt-3">
                        <Col>
                            <Button variant="outline-primary" onClick={prevStep}>
                                &lt; Trở lại
                            </Button>
                        </Col>
                        <Col className="text-end">
                            <Button variant="primary" onClick={nextStep} disabled={!roomName}>
                                Tiếp tục &gt;
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
                                        Vì sao tôi không thể sử dụng tên phòng tùy chỉnh?
                                    </p>
                                    <div style={{ fontSize: "0.9rem" }}>
                                        <p>Tên phòng tiêu chuẩn có nhiều lợi ích mà tên tùy chỉnh không có:</p>
                                        <ul>
                                            <li>Cung cấp đầy đủ thông tin hơn</li>
                                            <li>Thống nhất trên trang web, giúp khách dễ so sánh</li>
                                            <li>Dễ hiểu với khách quốc tế</li>
                                            <li>Được phiên dịch sang 43 ngôn ngữ</li>
                                        </ul>
                                        <p className="text-muted">
                                            Sau khi đăng ký, Quý vị sẽ có lựa chọn để thêm tên phòng tùy chỉnh.
                                            Với những tên này, khách sẽ không thấy nhưng Quý vị có thể sử dụng để
                                            tham khảo nội bộ.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </Col>
                )}
            </Row>
        </Container>
    );
};



Step2.propTypes = Step3.propTypes = Step4.propTypes = {
    nextStep: PropTypes.func.isRequired,
    prevStep: PropTypes.func.isRequired,
};
