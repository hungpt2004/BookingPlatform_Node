import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { Container, Card, Form, Button, Row, Col } from "react-bootstrap";
import { FaChevronLeft } from "react-icons/fa";
import axiosInstance from "../../utils/AxiosInstance";

export const Step8 = ({ nextStep, prevStep }) => {
    const [hotelServices, setHotelServices] = useState([]);
    const [formData, setFormData] = useState({
        hotelServices: []
    });

    // Fetch hotel services on component mount
    useEffect(() => {
        const fetchHotelServices = async () => {
            try {
                const response = await axiosInstance.get("/hotel-service/get-all-hotel-services");
                setHotelServices(response.data.hotelServices);
            } catch (error) {
                console.error("Error fetching hotel services:", error);
            }
        };
        fetchHotelServices();
    }, []);

    // Save to session storage when formData changes
    useEffect(() => {
        sessionStorage.setItem("hotelService", JSON.stringify(formData));
    }, [formData]);

    // Handle checkbox changes
    const handleServiceToggle = (service) => {
        setFormData(prev => {
            const exists = prev.hotelServices.some(s => s._id === service._id);
            if (exists) {
                return {
                    ...prev,
                    hotelServices: prev.hotelServices.filter(s => s._id !== service._id)
                };
            }
            return {
                ...prev,
                hotelServices: [...prev.hotelServices, service]
            };
        });
    };

    return (
        <Container className="" style={{ width: "35%" }}>
            <br />
            <br />
            <h2 className="fw-bold mt-5">Dịch vụ tại chỗ nghỉ</h2>

            <Form className="mb-4">
                <Card className="p-4 mt-3">
                    {hotelServices.length > 0 ? (
                        hotelServices.map(service => (
                            <Form.Check
                                key={service._id}
                                type="checkbox"
                                id={service._id}
                                label={service.name}
                                className="mb-3"
                                checked={formData.hotelServices.some(s => s._id === service._id)}
                                onChange={() => handleServiceToggle(service)}
                            />
                        ))
                    ) : (
                        <p>Đang tải dịch vụ...</p>
                    )}
                </Card>
            </Form>

            <div className="d-flex">
                <Button variant="outline-primary" onClick={prevStep} className="w-25 me-2">
                    <FaChevronLeft />
                </Button>
                <Button
                    variant="primary"
                    onClick={nextStep}
                    className="w-75"
                    disabled={formData.hotelServices.length === 0}
                >
                    Tiếp tục
                </Button>
            </div>
        </Container>
    );
};

Step8.propTypes = {
    nextStep: PropTypes.func.isRequired,
    prevStep: PropTypes.func.isRequired
};