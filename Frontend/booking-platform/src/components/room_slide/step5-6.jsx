import { useState, useEffect } from "react";
import { Container, Form, Button, Card, Row, Col, Table } from "react-bootstrap";
import { FaTimes, FaCheck, FaInfo, FaChevronDown } from "react-icons/fa";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { FaChevronLeft, FaCircleCheck, FaCircleInfo, FaPeopleGroup, FaPerson } from "react-icons/fa6";
import { formatCurrencyVND } from "../../utils/FormatPricePrint";
import { DEFAULT_CANCEL_POLICY, DEFAULT_WEEKLY_PRICING_SETTINGS, DEFAULT_NON_REFUNDABLE_SETTINGS } from "./Constant";

export const Step5 = ({ nextStep, prevStep }) => {
    const [price, setPrice] = useState("");
    const [open, setOpen] = useState(true);
    const commissionRate = 0.15;

    useEffect(() => {
        if (price) {
            sessionStorage.setItem("price", price);
        }
    }, [price])


    const handlePriceChange = (e) => {
        const rawValue = e.target.value.replace(/[^0-9]/g, "");
        setPrice(rawValue);
    };

    const formatCurrency = (value) => {
        return Number(value).toLocaleString("vi-VN");
    };

    const calculateRevenue = () => {
        if (!price) return "0";
        const revenue = Number(price) * (1 - commissionRate);
        return formatCurrency(revenue);
    };

    const handleOpenChange = () => {
        setOpen(false);
    };


    return (
        <Container className="mt-4 w-50">
            <h3 className="mb-3 fw-bold">Thiết lập giá mỗi đêm cho phòng này</h3>
            <Row>
                <Col md={8}>
                    <Card className="mb-3" style={{ padding: "1.5rem" }}>
                        <h5 className="mb-4">Quý vị muốn thu bao nhiêu tiền mỗi đêm?</h5>

                        <Form.Group controlId="price" className="mb-4">
                            <Form.Label><strong>Số tiền khách trả</strong></Form.Label>
                            <Form.Group className="d-flex align-items-center">
                                <span className="input-group-text">VND</span>
                                <Form.Control
                                    type="text"
                                    value={formatCurrency(price).replace(" VND", "")}
                                    onChange={handlePriceChange}
                                    onBlur={() => setPrice(price.padStart(1, "0"))}
                                    placeholder="Nhập số tiền"
                                    min={0}
                                />

                            </Form.Group>
                            <Form.Text className="text-muted">
                                Bao gồm các loại thuế, phí và hoa hồng
                            </Form.Text>
                        </Form.Group>

                        {price > 0 && (
                            <div className="mb-4 ps-3">
                                <h6 >
                                    15,00% Hoa hồng cho Booking.com
                                </h6>
                                <div className="ps-5" style={{ fontSize: "0.8rem" }}>
                                    <div className="d-flex align-items-center mb-2" >
                                        <FaCheck className="me-2 text-success" />
                                        <span className="text-muted">Trợ giúp 24/7 bằng ngôn ngữ của Quý vị</span>
                                    </div>
                                    <div className="d-flex align-items-center mb-2">
                                        <FaCheck className="me-2 text-success" />
                                        <span className="text-muted">Tiết kiệm thời gian với đặt phòng được xác nhận tự động</span>
                                    </div>
                                    <div className="d-flex align-items-center mb-2">
                                        <FaCheck className="me-2 text-success" />
                                        <span className="text-muted">Chúng tôi sẽ quảng bá chỗ nghỉ của Quý vị trên Google</span>
                                    </div>

                                </div>

                                <hr />

                                <div className="mt-3 d-flex align-items-center">
                                    <p className="text-muted me-2">VND {calculateRevenue()} </p>
                                    <p className="">Doanh thu của Quý vị (bao gồm thuế)</p>
                                </div>
                            </div>
                        )}

                    </Card>

                    <Row className="mt-3">
                        <Col>
                            <Button variant="outline-primary" onClick={prevStep}>
                                &lt; Trở lại
                            </Button>
                        </Col>
                        <Col className="text-end">
                            <Button
                                variant="primary"
                                onClick={nextStep}
                                disabled={!price}
                            >
                                Tiếp tục &gt;
                            </Button>
                        </Col>
                    </Row>
                </Col>

                {open && (
                    <Col md={4}>
                        <Card className="p-3 position-relative">
                            <FaTimes
                                className="position-absolute top-0 end-0 m-2 text-muted"
                                style={{ cursor: "pointer" }}
                                onClick={handleOpenChange}
                            />

                            <div>
                                <h6 className="text-dark fw-bold mb-3">
                                    Nếu tôi cảm thấy chưa chắc chắn về giá thì sao?
                                </h6>
                                <p style={{ fontSize: "0.9rem" }}>
                                    Đừng lo lắng, Quý vị có thể đối lại bất cứ lúc nào. Thậm chí Quý vị có thể thiết lập giá cuối tuần,
                                    giữa tuần và theo mùa, nhờ đó giúp Quý vị kiểm soát doanh thu tốt hơn.
                                </p>
                            </div>
                        </Card>
                    </Col>
                )}
            </Row>
        </Container>
    );
};

export const Step6 = ({ nextStep, prevStep }) => {
    const navigate = useNavigate();
    const [discounts, setDiscounts] = useState([]);

    // Get room capacity from sessionStorage
    const roomDetails = JSON.parse(sessionStorage.getItem('roomDetails'));
    const guestCapacity = roomDetails?.capacity || 0;
    const roomPrice = sessionStorage.getItem('price');
    console.log(roomPrice);
    // Load discounts from sessionStorage on mount
    useEffect(() => {
        const savedDiscounts = JSON.parse(sessionStorage.getItem('groupDiscounts'))?.discounts || [];
        console.log("savedDiscounts", savedDiscounts[1]?.discount);
        const initialDiscounts = Array(parseInt(guestCapacity)).fill(0).map((_, idx) => ({
            guests: guestCapacity - idx,
            discount: savedDiscounts[idx]?.discount ?? Math.min(0.05 * (idx), 0.3),
        }));
        setDiscounts(initialDiscounts);
    }, [guestCapacity]);
    console.log("discounts", discounts);


    // Handle navigation to edit page
    const handleEditNavigate = () => {
        const currentData = JSON.parse(sessionStorage.getItem('groupDiscounts')) || {};
        const isEnabled = currentData?.enabled ?? true

        //Update if data changed
        if (JSON.stringify(currentData) !== JSON.stringify({ discounts, roomPrice, guestCapacity })) {
            sessionStorage.setItem('groupDiscounts', JSON.stringify({
                discounts,
                roomPrice,
                guestCapacity,
                enabled: isEnabled
            }));
        }
        navigate('/edit-capacity-price');
    };


    const toCreateHotel = () => {
        const roomDetails = JSON.parse(sessionStorage.getItem('roomDetails'));
        const comfortOptions = JSON.parse(sessionStorage.getItem('comfortOptions'));
        const price = sessionStorage.getItem('price');
        const bathroomData = JSON.parse(sessionStorage.getItem('bathroomData'));
        const roomName = sessionStorage.getItem('roomName') || "Phòng Giường Đôi";
        const groupDiscounts = JSON.parse(sessionStorage.getItem('groupDiscounts')) || discounts;
        const nonRefundableSettings = JSON.parse(sessionStorage.getItem('nonRefundableSettings')) || DEFAULT_NON_REFUNDABLE_SETTINGS;
        const weeklyPricingSettings = JSON.parse(sessionStorage.getItem('weeklyPricingSettings')) || DEFAULT_WEEKLY_PRICING_SETTINGS;
        const cancelPolicy = JSON.parse(sessionStorage.getItem('cancelPolicy')) || DEFAULT_CANCEL_POLICY;
        const id = sessionStorage.getItem('id');

        let rooms = JSON.parse(sessionStorage.getItem('rooms')) || [];
        const roomCount = rooms.length + 1;

        const newRoom = {
            id: id ? parseInt(id) : roomCount,
            roomDetails,
            comfortOptions,
            price,
            bathroomData,
            roomName,
            groupDiscounts,
            nonRefundableSettings,
            weeklyPricingSettings,
            cancelPolicy,
            createdAt: new Date().toISOString()
        };
        if (!id) {
            rooms.push(newRoom);
        } else {
            rooms = rooms.map((room) => room.id === parseInt(id) ? newRoom : room)
        }

        sessionStorage.setItem('rooms', JSON.stringify(rooms));

        sessionStorage.removeItem('id');

        sessionStorage.setItem('roomStep', 1);
        sessionStorage.removeItem('roomDetails');
        sessionStorage.removeItem('comfortOptions');
        sessionStorage.removeItem('price');
        sessionStorage.removeItem('bathroomData');
        sessionStorage.removeItem('roomName');
        sessionStorage.removeItem('groupDiscounts');
        sessionStorage.removeItem('nonRefundableSettings');
        sessionStorage.removeItem('weeklyPricingSettings');
        sessionStorage.removeItem('cancelPolicy');

        navigate('/create-hotel');
    };

    return (
        <Container className="mt-4 w-50">
            <h3 className="mb-4 fw-bold">Loại giá</h3>
            <Card className="mb-5">
                <Card.Body>
                    <Card.Text>Để thu hút nhiều đối tượng khách hơn, chúng tôi đề xuất Quý vị nên thiết lập nhiều loại giá. Các mức giá và chính sách đề xuất cho mỗi loại giá được dựa trên dữ liệu từ các chỗ nghỉ tương tự như Quý vị. Tuy nhiên, Quý vị có thể chỉnh sửa các chi tiết này ngay bây giờ hoặc sau khi hoàn tất đăng ký.
                    </Card.Text>
                </Card.Body>
            </Card>

            <div>
                <h5 className="fw-bold my-3">Loại giá tiêu chuẩn</h5>
                {/* Standard Price Card */}
                <Card className="mb-5">
                    <Card.Body>
                        <Row className="align-items-center mb-3">
                            <Col>
                                <p className="fw-bold fs-5">Giá theo cỡ nhóm <span><FaCircleInfo /></span>
                                </p>
                            </Col>
                            <Col className="text-end">
                                <Button
                                    variant="outline-primary"
                                    onClick={handleEditNavigate}
                                >
                                    Chỉnh sửa
                                </Button>
                            </Col>
                        </Row>
                        <hr />
                        <Table>
                            <thead>
                                <tr className="fw-bold fs-5">
                                    <th>Số lượng khách</th>
                                    <th>Khách thanh toán</th>
                                </tr>
                            </thead>
                            <tbody>
                                {discounts.map((item, idx) => (
                                    <tr key={idx}>
                                        <td className="d-flex align-center">
                                            <span className="material-symbols-outlined me-2">
                                                person
                                            </span>
                                            {item.guests}
                                        </td>
                                        <td>
                                            {formatCurrencyVND(
                                                roomPrice * (1 - item.discount)
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>

                        <div className="mt-4">

                            <Row className="align-items-center mb-3">
                                <Col>
                                    <p className="fw-bold fs-5 m-0">Chính sách hủy <span><FaCircleInfo /></span></p>
                                </Col>
                                <Col className="text-end">
                                    <Button
                                        variant="outline-primary"
                                        onClick={() => navigate('/cancel-policy')}
                                    >
                                        Chỉnh sửa
                                    </Button>
                                </Col>
                            </Row>

                            <p className="text-muted" style={{ fontSize: "0.8rem" }}>Chính sách này được cài đặt ở cấp độ chỗ nghỉ – bất cứ thay đổi nào được thực hiện sẽ được áp dụng cho tất cả phòng.</p>
                            <hr />
                            <div className="d-flex align-items-center">
                                <span className="align-self-start">
                                    <FaCircleCheck className="text-secondary me-2" size={30} />
                                </span>
                                <p className="text-muted">Khách có thể hủy đặt phòng miễn phí trước 18h00 ngày nhận phòng. Khách sẽ bị tính phí giá cho đêm đầu tiên nếu hủy sau thời điểm này.</p>
                            </div>
                            <div className="d-flex align-items-center">
                                <span className="align-self-start">
                                    <FaCircleCheck className="me-2 text-secondary" size={30} />
                                </span>
                                <p className="text-muted">Khách hủy trong vòng 24 giờ sẽ được miễn phí hủy.</p>
                            </div>
                        </div>
                    </Card.Body>
                </Card>


            </div>

            {/* Non-refundable Price Card */}
            <h5 className="fw-bold my-3">Loại giá không hoàn tiền</h5>
            <Card className="mb-5">
                <Card.Body>
                    <Row className="align-items-center mb-3">
                        <Col>
                            <p className="fw-bold fs-5 m-0">Giá và chính sách hủy <span><FaCircleInfo /></span></p>
                        </Col>
                        <Col className="text-end">
                            <Button
                                variant="outline-primary"
                                onClick={() => navigate('/edit-non-refundable')}
                            >
                                Chỉnh sửa
                            </Button>
                        </Col>
                    </Row>

                    <hr />

                    <div className="d-flex align-items-center">
                        <span className="align-self-start">
                            <FaCircleCheck className="text-secondary me-2" size={30} />
                        </span>
                        <p className="text-muted">Với giá không hoàn tiền, khách sẽ trả ít hơn 10% so với giá tiêu chuẩn.</p>
                    </div>
                    <div className="d-flex align-items-center">
                        <span className="align-self-start">
                            <FaCircleCheck className="me-2 text-secondary" size={30} />
                        </span>
                        <p className="text-muted">Khách không thể hủy đặt phòng miễn phí vào bất kỳ lúc nào.</p>
                    </div>

                </Card.Body>
            </Card >

            {/* Weekly Price Card */}
            <h5 className="fw-bold my-3">Loại giá theo tuần</h5>
            <Card Card className="mb-4" >
                <Card.Body>
                    <Row className="align-items-center mb-3">
                        <Col>
                            <p className="fw-bold fs-5 m-0">Giá và chính sách hủy <span><FaCircleInfo /></span></p>
                        </Col>
                        <Col className="text-end">
                            <Button
                                variant="outline-primary"
                                onClick={() => navigate('/edit-weekly-price')}
                            >
                                Chỉnh sửa
                            </Button>
                        </Col>
                    </Row>
                    <hr />

                    <div className="d-flex align-items-center">
                        <span className="align-self-start">
                            <FaCircleCheck className="text-secondary me-2" size={30} />
                        </span>
                        <p className="text-muted">Khách sẽ trả ít hơn 15% so với giá tiêu chuẩn khi đặt tối thiểu 7 đêm.</p>
                    </div>
                    <div className="d-flex align-items-center">
                        <span className="align-self-start">
                            <FaCircleCheck className="me-2 text-secondary" size={30} />
                        </span>
                        <p className="text-muted">Khách có thể hủy đặt phòng miễn phí trước 18h00 ngày nhận phòng. Khách sẽ bị tính phí giá cho đêm đầu tiên nếu hủy sau thời điểm này (dựa theo chính sách hủy của giá tiêu chuẩn).</p>
                    </div>
                </Card.Body>

            </Card >
            <Row className="mt-3">
                <Col>
                    <Button variant="outline-primary" onClick={prevStep}>
                        <FaChevronLeft />
                    </Button>
                </Col>
                <Col className="text-end">
                    <Button
                        variant="primary"
                        onClick={toCreateHotel}
                    >
                        Tiếp tục
                    </Button>
                </Col>
            </Row>

        </Container >
    );
};

Step5.propTypes = Step6.propTypes = {
    nextStep: PropTypes.func.isRequired,
    prevStep: PropTypes.func.isRequired
};