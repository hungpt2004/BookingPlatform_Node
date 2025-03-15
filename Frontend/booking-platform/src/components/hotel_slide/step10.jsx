import React, { useState } from "react";
import { Button, Card, Container, Form } from "react-bootstrap";
import { FaCheckCircle, FaChevronUp, FaInfoCircle, FaPercentage, FaSave, FaUserAltSlash } from "react-icons/fa";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { FaHandshake, FaHandshakeSlash, FaHandsHolding, FaPercent, FaShield } from "react-icons/fa6";

export const Step10 = ({ nextStep, prevStep }) => {
    const navigate = useNavigate();
    const getInitialPaymentMethod = () => {
        const initialPayment = sessionStorage.getItem("paymentMethod");
        if (!initialPayment) {
            sessionStorage.setItem("paymentMethod", JSON.stringify("creditCard"));
        }
        return JSON.parse(initialPayment)
    }
    const [selectedMethod, setSelectedMethod] = useState(getInitialPaymentMethod());

    const handlePaymentChange = (method) => {
        setSelectedMethod(method);
        sessionStorage.setItem("paymentMethod", JSON.stringify(method));
    };

    return (
        <Container style={{ maxWidth: "50%" }}>
            {/* Payment Method Section */}
            <h2 className="mt-5 mb-4 fw-bold">Thanh toán</h2>

            <Card className="p-4 mt-3">

                <div className="mb-5">
                    <h5 className="fw-bold">Khách thanh toán tiền phòng bằng cách nào?</h5>

                    <Form.Group className="mb-4">
                        <Form.Check
                            type="radio"
                            name="paymentMethod"
                            id="onlinePayment"
                            label="Thanh toán online khi đặt phòng. Booking.com sẽ hỗ trợ xử lý các khoản thanh toán của khách với dịch vụ Thanh toán bởi Booking.com."
                            checked={selectedMethod === "online"}
                            onChange={() => handlePaymentChange("online")}
                            className="mb-3"
                        />

                        {selectedMethod === "online" && (
                            <div className="ms-4">
                                <p><span className="me-2"><FaUserAltSlash /> </span>Giảm số lượt hủy</p>
                                <p><span className="me-2"><FaShield /> </span>Tránh lừa đảo và thẻ không hợp lệ</p>
                                <p><span className="me-2"><FaHandshake /> </span>Nhiều phương thức thanh toán hơn cho khách</p>
                            </div>
                        )}

                        <Form.Check
                            type="radio"
                            name="paymentMethod"
                            id="creditCard"
                            label="Bằng thẻ tín dụng, tại chỗ nghỉ"
                            checked={selectedMethod === "creditCard"}
                            onChange={() => handlePaymentChange("creditCard")}
                        />
                    </Form.Group>

                </div>
            </Card >
            <Card className="p-4 mt-3">

                <div className="mb-1">
                    <h5 className="fw-bold">Cách hoạt động của Thanh toán bởi Booking.com</h5>
                    <ol className="mt-3">
                        <li className="mb-3">
                            <strong>Khách sẽ thanh toán</strong> thông qua Booking.com với các tùy chọn như PayPal,
                            WeChat Pay và AllPay.
                        </li>
                        <li className="mb-3">
                            <strong>Chúng tôi xử lý khoản thanh toán của khách</strong> để Quý vị không phải lo lắng
                            về bồi hoàn, gian lận hay thẻ không hợp lệ.
                        </li>
                        <li>
                            <strong>Booking.com gửi thanh toán cho Quý vị.</strong> Quý vị sẽ nhận được chuyển khoản
                            ngân hàng trễ nhất là ngày 15 hằng tháng, bao gồm tất cả mọi đặt phòng có ngày trả phòng
                            trong tháng trước đó.
                        </li>
                    </ol>
                </div>


            </Card>

            {/* Action Buttons */}
            <div className="d-flex justify-content-between mt-5">
                <Button variant="outline-secondary" onClick={prevStep}>
                    Quay lại
                </Button>
                <Button
                    variant="primary"
                    onClick={nextStep}
                    disabled={!selectedMethod}
                >
                    Tiếp tục
                </Button>
            </div>
        </Container >
    );
};

Step10.propTypes = {
    nextStep: PropTypes.func.isRequired,
    prevStep: PropTypes.func.isRequired
};