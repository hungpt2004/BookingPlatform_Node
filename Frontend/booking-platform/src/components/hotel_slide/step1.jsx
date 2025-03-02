import { Button, Card, Badge } from "react-bootstrap";
import { MdFlashOn } from "react-icons/md";
import { FaHotel } from "react-icons/fa6";
import PropTypes from "prop-types";
const Step1 = ({ nextStep }) => {
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

Step1.propTypes = {
    nextStep: PropTypes.func.isRequired
}
export default Step1;
