import { Container, Card, Button } from 'react-bootstrap';
import { FaHotel } from "react-icons/fa6";
import PropTypes from 'prop-types';

const Step4 = ({ nextStep, prevStep, hotelType }) => {
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

Step4.propTypes = {
    nextStep: PropTypes.func.isRequired,
    prevStep: PropTypes.func.isRequired,
    hotelType: PropTypes.shape({
        title: PropTypes.string.isRequired
    }).isRequired
};

export default Step4;
