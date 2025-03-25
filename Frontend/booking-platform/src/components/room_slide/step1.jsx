import { useState, useEffect, useRef } from "react";
import {
    Button,
    Card,
    Container,
    Row,
    Col,
    Form,
    InputGroup
} from "react-bootstrap";
import PropTypes from "prop-types";
import { useNavigate, useParams } from "react-router-dom";
import { FaBed } from "react-icons/fa6";
import axiosInstance from "../../utils/AxiosInstance";
// Example bed types

export const Step1 = ({ nextStep, prevStep }) => {
    const navigate = useNavigate();
    const { hotelId } = useParams();

    const [bedTypes, setBedTypes] = useState([]);
    const handleBefore = () => {
        if (hotelId) {
            navigate(`/room-management-2?hotelId=${hotelId}`)
        } else {
            toCreateHotel()
        }
    }


    const fetchBedTypes = async () => {
        try {
            const res = await axiosInstance.get("/bed/get-all-bed");
            // Add count property to each bed type
            const bedsWithCount = res.data.beds.map(bed => ({
                ...bed,
                count: 0 // Initialize count to 0
            }));
            setBedTypes(bedsWithCount);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchBedTypes();
    }, []);

    const [formData, setFormData] = useState({
        roomType: "Phòng giường đôi",
        roomQuantity: 1,
        bedTypes: [], // Initialize as empty array
        capacity: 2,
        roomArea: 0,
        AreaType: "meter",
        isSmoking: false,
    });

    // Update formData when bedTypes are fetched
    useEffect(() => {
        if (bedTypes.length > 0) {
            setFormData(prev => ({
                ...prev,
                bedTypes: bedTypes
            }));
        }
    }, [bedTypes]);


    // Whenever formData changes, save to sessionStorage
    useEffect(() => {
        sessionStorage.setItem("roomDetails", JSON.stringify(formData));
    }, [formData]);

    // Handle changes in simple fields
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const lastClickTimeRef = useRef(0);

    const handleBedCountChange = (index, delta) => {
        const now = Date.now();
        if (now - lastClickTimeRef.current < 50) return;
        lastClickTimeRef.current = now;

        setFormData((prev) => {
            const updatedBedTypes = prev.bedTypes.map((bed, i) => {
                if (i === index) {
                    const newCount = bed.count + delta;
                    return { ...bed, count: Math.max(newCount, 0) };
                }
                return bed;
            });
            return { ...prev, bedTypes: updatedBedTypes };
        });
    };
    const totalBedCount = formData.bedTypes.reduce((acc, bed) => acc + bed.count, 0);
    const totalBedCountMaxed = totalBedCount > 25;

    const toCreateHotel = () => {
        navigate('/create-hotel')
    }

    // Render bed type rows
    const renderBedTypes = () =>
        formData.bedTypes.map((bed, index) => (
            <Row key={bed._id} className="align-items-center mb-2 p-0" >
                <Col xs={8} className="d-flex align-items-center">
                    <span className="material-symbols-outlined me-2" style={{ fontSize: "2rem", }}>
                        {bed.name === "Giường đơn" ? "single_bed" : "king_bed"}
                    </span>
                    <div className="d-flex flex-column">
                        <Form.Label className="mb-0">{bed.name}</Form.Label>
                        <p className="text-secondary mb-0" style={{ fontSize: "0.8rem" }}>{bed.lengthDetail}</p>
                    </div>
                </Col>

                <Col xs={4} className="">
                    <Card className="d-flex align-items-center justify-center flex-row">
                        <Button
                            className="py-2 px-0 text-primary"
                            variant="light"
                            size="sm"
                            disabled={bed.count === 0}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleBedCountChange(index, -1);
                            }}
                        >
                            -
                        </Button>
                        <p className="px-2 my-0">{bed.count}</p>
                        <Button
                            className="py-2 text-primary"
                            variant="light"
                            size="sm"
                            disabled={totalBedCountMaxed}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleBedCountChange(index, +1);
                            }}
                        >
                            +
                        </Button>

                    </Card>
                </Col>
            </Row >
        ));

    return (
        <Container style={{ maxWidth: "65%" }}>
            <h3 className="fw-bold mt-5 pt-2">Chi tiết phòng</h3>

            <Row className="mt-3">
                <Col md={8}>
                    <Form>
                        <Card className="p-4 mb-3">
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-bold mb-3" style={{ fontSize: "17px" }}>Đây là loại chỗ nghỉ gì?</Form.Label>
                                <Form.Select
                                    name="roomType"
                                    value={formData.roomType}
                                    onChange={handleChange}
                                >
                                    <option value="Phòng giường đôi">Phòng giường đôi</option>
                                    <option value="Phòng giường đơn">Phòng giường đơn</option>
                                    <option value="Phòng giường 4 người">Phòng giường 4 người</option>
                                    <option value="Phòng 2 giường đơn">Phòng 2 giường đơn</option>
                                </Form.Select>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label className="fw-bold mb-3" style={{ fontSize: "17px" }}>Quý vị có bao nhiêu phòng loại này?</Form.Label>
                                <Form.Control
                                    className="w-25"
                                    type="number"
                                    name="roomQuantity"
                                    min="1"
                                    value={formData.roomQuantity}
                                    onChange={handleChange}
                                />
                            </Form.Group>

                        </Card>
                        {/* Bed Types */}
                        <Card className="p-4 mb-3">
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-bold mb-3" style={{ fontSize: "17px" }}>Có loại giường nào trong phòng này?</Form.Label>
                                {renderBedTypes()}
                            </Form.Group>

                        </Card>
                        {/* Capacity */}
                        <Card className="p-4 mb-3">
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-bold mb-3" style={{ fontSize: "17px" }}> Bao nhiêu khách có thể ở trong phòng này?</Form.Label>
                                <Form.Control
                                    className="w-25"
                                    type="number"
                                    name="capacity"
                                    min="1"
                                    value={formData.capacity}
                                    onChange={handleChange}
                                />

                            </Form.Group>

                        </Card>
                        <Card className="p-4 mb-3">
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-bold mb-3" style={{ fontSize: "17px" }}>Phòng này rộng bao nhiêu?
                                </Form.Label>
                                <p className="text-secondary mb-0">Diện tích phòng - không bắt buộc                                </p>
                                <div className="d-flex align-items-center">
                                    <Form.Control
                                        className="w-25"
                                        type="number"
                                        name="area"
                                        min="1"
                                        value={formData.Area}
                                        onChange={handleChange}
                                    />
                                    <Form.Select
                                        className="w-25 ms-2"
                                        name="AreaType"
                                        value={formData.AreaType}
                                        onChange={handleChange}
                                        style={{ backgroundColor: "#E7E7E7" }}
                                    >
                                        <option value="meter">mét vuông</option>
                                        <option value="feet">feet vuông</option>
                                    </Form.Select>
                                </div>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label className="fw-bold " style={{ fontSize: "17px" }}>Có được hút thuốc trong phòng này không?                                </Form.Label>
                                <Form.Check
                                    type="radio"
                                    label="Phòng không hút thuốc"
                                    name="isSmoking"
                                    checked={formData.isSmoking}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, isSmoking: e.target.checked }))}
                                />
                                <Form.Check
                                    type="radio"
                                    label="Phòng hút thuốc"
                                    name="isSmoking"
                                    checked={!formData.isSmoking}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, isSmoking: !e.target.checked }))}
                                />

                            </Form.Group>

                        </Card>
                        {/* ACTION BUTTONS */}
                        <div className="d-flex justify-content-between mt-3">
                            <Button variant="secondary" onClick={handleBefore}>
                                Quay lại
                            </Button>
                            <Button variant="primary" onClick={nextStep} disabled={totalBedCount === 0}>
                                Tiếp tục
                            </Button>
                        </div>

                    </Form>
                </Col>

                {/* RIGHT COLUMN: Info Card */}
                <Col md={4}>
                    <Card className="p-3">
                        <h5 className="fw-bold mb-3" style={{ fontSize: "17px" }}>Quý vị có bố trí chỗ ngủ khác không?                        </h5>
                        <p className="text-muted mb-0">
                            Hiện tại, Quý vị chỉ cần thiết lập các thông tin cơ bản cho phòng này.
                            Những chi tiết khác như chính sách lưu trú, thuế, hoặc phí dịch vụ sẽ
                            được thiết lập trong các bước tiếp theo. Quý vị có thể chỉnh sửa thông
                            tin này bất cứ lúc nào sau khi đăng ký.
                        </p>
                    </Card>
                </Col>
            </Row>

        </Container >
    );
};

Step1.propTypes = {
    nextStep: PropTypes.func.isRequired,
    prevStep: PropTypes.func.isRequired,
};
