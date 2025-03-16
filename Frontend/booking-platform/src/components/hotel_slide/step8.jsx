import PropTypes from "prop-types"
import { useState, useEffect } from "react";
import { Container, Card, Form, Button, Row, Col } from "react-bootstrap";
import { FaChevronLeft } from "react-icons/fa";

export const Step8 = ({ nextStep, prevStep }) => {
    const [formData, setFormData] = useState({
        // Breakfast
        serveBreakfast: "",        // "Có" / "Không"
        includedInPrice: "",       // "Có" / "Không"
        breakfastTypes: [],        // multiple choices
        breakfastPrice: "",        // number


        // Parking
        hasParking: "",            // "Có" / "Không"
        parkingFeeType: "",        // "Miễn phí" / "Tính phí (theo ngày)" / ...
        parkingLocation: "",       // "Trong khuôn viên" / "Gần đó" / ...
        reservationNeeded: "",     // "Có" / "Không"
        parkingFee: "",            // number
        parkingFeeTimeType: "", // "Mỗi ngày" / "Mỗi giờ" / "Mỗi kỳ lưu trú"
        parkingTypes: "",          // "Riêng" / "Công cộng"
    });

    // Store in sessionStorage whenever formData changes
    useEffect(() => {
        sessionStorage.setItem("hotelService", JSON.stringify(formData));
    }, [formData]);

    // Generic handler for radio / text inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handler for multiple checkboxes (breakfastTypes)
    const handleBreakfastTypesChange = (typeValue) => {
        setFormData((prev) => {
            const currentTypes = prev.breakfastTypes;
            const alreadySelected = currentTypes.includes(typeValue);
            return {
                ...prev,
                breakfastTypes: alreadySelected
                    ? currentTypes.filter((t) => t !== typeValue)
                    : [...currentTypes, typeValue],
            };
        });
    };

    return (
        <Container className="float-start" style={{ width: "35%", marginLeft: "5%" }} >
            <br></br>
            <br></br>
            <h2 className="fw-bold mt-5">Dịch vụ tại chỗ nghỉ</h2>

            <Form className="mb-4">
                {/* BỮA SÁNG */}
                <Card className="p-4 mt-3">

                    <Card.Title className="mb-3 fs-4 pb-4 fw-bold" style={{ borderBottom: "1px solid #ccc" }}>Bữa sáng</Card.Title>

                    <Form.Label className="fw-bold">Quý vị có phục vụ bữa sáng cho khách không?</Form.Label>
                    <div className="mb-2 d-flex flex-column">
                        <Form.Check
                            inline
                            type="radio"
                            label="Có"
                            name="serveBreakfast"
                            value="Có"
                            checked={formData.serveBreakfast === "Có"}
                            onChange={handleChange}
                        />
                        <Form.Check
                            inline
                            type="radio"
                            label="Không"
                            name="serveBreakfast"
                            value="Không"
                            checked={formData.serveBreakfast === "Không"}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Show additional fields IF serveBreakfast === "Có" */}
                    {formData.serveBreakfast === "Có" && (
                        <>
                            <Form.Label className="fw-bold">
                                Bữa sáng có bao gồm trong giá khách trả không?
                            </Form.Label>
                            <div className="mb-3 d-flex flex-column">
                                <Form.Check
                                    inline
                                    type="radio"
                                    label="Có"
                                    name="includedInPrice"
                                    value="Có"
                                    checked={formData.includedInPrice === "Có"}
                                    onChange={handleChange}
                                />
                                <Form.Check
                                    inline
                                    type="radio"
                                    label="Không, bữa sáng sẽ tính thêm"
                                    name="includedInPrice"
                                    value="Không"
                                    checked={formData.includedInPrice === "Không"}
                                    onChange={handleChange}
                                />
                            </div>

                            {formData.includedInPrice === "Không" && (
                                <div className="mb-3 ">
                                    <Form.Label className="fw-bold">
                                        Giá bữa sáng/người/ngày
                                    </Form.Label>
                                    <Form.Group className="d-flex w-50">
                                        <span className="input-group-text w-25">VND</span>

                                        <Form.Control
                                            type="number"
                                            name="breakfastPrice"
                                            value={formData.breakfastPrice}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </div>
                            )}


                            <Form.Label className="fw-bold">Quý vị cung cấp bữa sáng loại nào?</Form.Label>
                            <Row>
                                {[
                                    "Kiểu lục địa",
                                    "Tự chọn",
                                    "Kiểu Á",
                                    "Kiểu Mỹ",
                                    "Halal",
                                    "Kosher",
                                    "Không gluten",
                                    "Ăn chay",
                                    "Ăn kiêng",
                                    "Buffet",
                                ].map((type) => (
                                    <Col key={type} xs={6} md={4} className="mb-2">
                                        <Form.Check
                                            type="checkbox"
                                            label={type}
                                            checked={formData.breakfastTypes.includes(type)}
                                            onChange={() => handleBreakfastTypesChange(type)}
                                        />
                                    </Col>
                                ))}
                            </Row>
                        </>
                    )}
                </Card>


                <Card className="p-4 mt-3">
                    {/* CHỖ ĐẬU XE */}
                    <Card.Title className="mb-3 fs-4 pb-4 fw-bold" style={{ borderBottom: "1px solid #ccc" }}>Chỗ đậu xe</Card.Title>

                    <Form.Label className="fw-bold">Quý vị có chỗ đậu xe cho khách không?</Form.Label>
                    <div className="mb-2 d-flex flex-column">
                        <Form.Check
                            inline
                            type="radio"
                            label="Có, miễn phí"
                            name="hasParking"
                            value="Có, miễn phí"
                            checked={formData.hasParking === "Có, miễn phí"}
                            onChange={handleChange}
                        />
                        <Form.Check
                            inline
                            type="radio"
                            label="Có, tính phí"
                            name="hasParking"
                            value="Có, tính phí"
                            checked={formData.hasParking === "Có, tính phí"}
                            onChange={handleChange}
                        />
                        <Form.Check
                            inline
                            type="radio"
                            label="Không"
                            name="hasParking"
                            value="Không"
                            checked={formData.hasParking === "Không"}
                            onChange={handleChange}
                        />
                    </div>
                    {(formData.hasParking === "Có, tính phí" || formData.hasParking === "Có, miễn phí") && (
                        <>
                            {
                                formData.hasParking === "Có, tính phí" && (
                                    <div className="mb-3 ">
                                        <Form.Label className="fw-bold">Phí đậu xe là bao nhiêu?</Form.Label>
                                        <div className="d-flex w-75">
                                            <Form.Group className="d-flex">
                                                <span className="input-group-text w-25">VND</span>
                                                <Form.Control
                                                    type="text"
                                                    name="parkingFee"
                                                    value={formData.parkingFee}
                                                    onChange={handleChange}
                                                />

                                            </Form.Group>                                {/* Parking Fee Time Type */}
                                            <Form.Select
                                                className="w-50"
                                                name="parkingFeeTimeType"
                                                value={formData.parkingFeeTimeType}
                                                onChange={handleChange}
                                            >
                                                <option value="Mỗi ngày">Mỗi ngày</option>
                                                <option value="Mỗi giờ">Mỗi giờ</option>
                                                <option value="Mỗi kỳ lưu trú">Mỗi kỳ lưu trú</option>
                                            </Form.Select>

                                        </div>
                                    </div>

                                )
                            }


                            < Form.Label className="fw-bold"> Vị trí chỗ đậu xe</Form.Label>
                            <div className="mb-3 d-flex flex-column">
                                <Form.Check
                                    inline
                                    type="radio"
                                    label="Trong khuôn viên"
                                    name="parkingLocation"
                                    value="Trong khuôn viên"
                                    checked={formData.parkingLocation === "Trong khuôn viên"}
                                    onChange={handleChange}
                                />
                                <Form.Check
                                    inline
                                    type="radio"
                                    label="Ngoài khuôn viên"
                                    name="parkingLocation"
                                    value="Ngoài khuôn viên"
                                    checked={formData.parkingLocation === "Ngoài khuôn viên"}
                                    onChange={handleChange}
                                />
                            </div>

                            <Form.Label className="fw-bold">Khách có cần đặt trước chỗ đậu xe không?</Form.Label>
                            <div className="mb-3 d-flex flex-column">
                                <Form.Check
                                    inline
                                    type="radio"
                                    label="Có"
                                    name="reservationNeeded"
                                    value="Có"
                                    checked={formData.reservationNeeded === "Có"}
                                    onChange={handleChange}
                                />
                                <Form.Check
                                    inline
                                    type="radio"
                                    label="Không"
                                    name="reservationNeeded"
                                    value="Không"
                                    checked={formData.reservationNeeded === "Không"}
                                    onChange={handleChange}
                                />
                            </div>

                            <Form.Label className="fw-bold">Đây là loại chỗ đậu xe gì?</Form.Label>
                            <div className="mb-3 d-flex flex-column">
                                <Form.Check
                                    inline
                                    type="radio"
                                    label="Riêng"
                                    name="parkingTypes"
                                    value="Riêng"
                                    checked={formData.parkingTypes === "Riêng"}
                                    onChange={handleChange}
                                />
                                <Form.Check
                                    inline
                                    type="radio"
                                    label="Công cộng"
                                    name="parkingTypes"
                                    value="Công cộng"
                                    checked={formData.parkingTypes === "Riêng"}
                                    onChange={handleChange}
                                />
                            </div>

                        </>
                    )}

                </Card>
            </Form>



            <div className="d-flex">
                <Button variant="outline-primary" onClick={prevStep} className="w-25 me-2">
                    <FaChevronLeft style={{ fontSize: "" }} />
                </Button>
                <Button variant="primary" onClick={nextStep} className="w-75"
                    disabled={formData.serveBreakfast === "" || formData.hasParking === ""}>
                    Tiếp tục
                </Button>
            </div>
        </Container >
    );
};

Step8.propTypes = {
    nextStep: PropTypes.func.isRequired,
    prevStep: PropTypes.func.isRequired
}
