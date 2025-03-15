import React, { useState } from "react";
import { Button, Card, Container, Form, Row, Col } from "react-bootstrap";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

export const Step11 = ({ nextStep, prevStep }) => {
    const navigate = useNavigate();
    const ownerName = "son thai"; // Hardcoded for now
    const hotelName = JSON.parse(sessionStorage.getItem("hotelName")) || "";
    const [invoiceInfo, setInvoiceInfo] = useState(
        JSON.parse(sessionStorage.getItem("hotelBillInfo")) || {
            invoiceType: "", // 'owner', 'hotel', or 'company'
            companyLegalName: "",
        }
    );

    const handleInputChange = (field, value) => {
        const updatedInfo = {
            ...invoiceInfo,
            [field]: value
        };
        setInvoiceInfo(updatedInfo);
        sessionStorage.setItem("hotelBillInfo", JSON.stringify(updatedInfo));
    };

    const isFormValid = () => {
        if (invoiceInfo.invoiceType === 'company') {
            return invoiceInfo.companyLegalName.trim() !== "";
        }
        return invoiceInfo.invoiceType !== "";
    };

    return (
        <Container style={{ maxWidth: "50%" }}>
            <h2 className="mt-5 mb-4 fw-bold">Hóa đơn</h2>

            <Card className="p-4 mt-3">
                {/* Invoice Name Section */}
                <div className="mb-5">
                    <h5 className="fw-bold">Tên trên hóa đơn là gì?</h5>
                    <Form.Group className="mb-4">
                        <Form.Check
                            type="radio"
                            label={ownerName}
                            name="invoiceType"
                            checked={invoiceInfo.invoiceType === 'owner'}
                            onChange={() => handleInputChange("invoiceType", 'owner')}
                            className="mb-2"
                        />
                        <Form.Check
                            type="radio"
                            label={hotelName}
                            name="invoiceType"
                            checked={invoiceInfo.invoiceType === 'hotel'}
                            onChange={() => handleInputChange("invoiceType", 'hotel')}
                            className="mb-2"
                        />
                        <Form.Check
                            type="radio"
                            label="Tên pháp lý của công ty (vui lòng nêu rõ)"
                            name="invoiceType"
                            checked={invoiceInfo.invoiceType === 'company'}
                            onChange={() => handleInputChange("invoiceType", 'company')}
                        />

                        {invoiceInfo.invoiceType === 'company' && (
                            <Form.Control
                                type="text"
                                placeholder="Nhập tên pháp lý công ty"
                                value={invoiceInfo.companyLegalName}
                                onChange={(e) => handleInputChange("companyLegalName", e.target.value)}
                                className="mt-3"
                            />
                        )}
                    </Form.Group>
                </div>

            </Card>
            <div className="d-flex justify-content-between mt-5">
                <Button variant="outline-secondary" onClick={prevStep}>
                    Quay lại
                </Button>
                <Button
                    variant="primary"
                    onClick={nextStep}
                    disabled={!isFormValid()}
                >
                    Tiếp tục
                </Button>
            </div>

        </Container>
    );
};

Step11.propTypes = {
    nextStep: PropTypes.func.isRequired,
    prevStep: PropTypes.func.isRequired
};