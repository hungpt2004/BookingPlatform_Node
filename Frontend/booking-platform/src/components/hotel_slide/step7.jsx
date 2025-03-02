import { Container, Card, Form, Button, Row, Col } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { services } from '../data/HotelOption';

const Step7 = ({ nextStep, prevStep }) => {
  const [selectedServices, setSelectedServices] = useState([]);

  const handleCheckboxChange = (service) => {
    setSelectedServices((prev) => {
      const exists = prev.some((s) => s.id === service.id);
      return exists ? prev.filter((s) => s.id !== service.id) : [...prev, service];
    });
  };

  // Lưu cả ID và Name vào sessionStorage
  useEffect(() => {
    sessionStorage.setItem("service", JSON.stringify(selectedServices));
  }, [selectedServices]);

  return (
    <Container>
      <h4 className="fw-bold mt-4">Khách có thể sử dụng gì tại khách sạn của Quý vị?</h4>

      <Card className="p-4 mt-3">
        <Form>
          <Row>
            {services.map((service) => (
              <Col md={12} key={service.id}>
                <Form.Check
                  type="checkbox"
                  id={`service-${service.id}`}
                  label={service.name}
                  checked={selectedServices.some((s) => s.id === service.id)}
                  onChange={() => handleCheckboxChange(service)}
                />
              </Col>
            ))}
          </Row>
        </Form>

        <hr />

        {/* Nút Back & Next */}
        <div className="d-flex justify-content-between">
          <Button variant="secondary" onClick={prevStep}>Quay lại</Button>
          <Button variant="primary" onClick={nextStep} disabled={selectedServices.length === 0}>
            Tiếp tục
          </Button>
        </div>
      </Card>
    </Container>
  );
};

Step7.propTypes = {
  nextStep: PropTypes.func.isRequired,
  prevStep: PropTypes.func.isRequired,
};

export default Step7;
