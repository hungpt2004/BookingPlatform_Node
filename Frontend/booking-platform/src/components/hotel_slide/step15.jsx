import PropTypes from 'prop-types';
import { Container, Card, Form, Row, Col, Button } from 'react-bootstrap';
import { typeOption, nation } from '../data/HotelOption';
import { useState } from 'react';
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const Step15 = ({ prevStep, nextStep }) => {
    const [selectedGroup, setSelectedGroup] = useState(2);
    const [hotelParent, setHotelParent] = useState("");
    const [phone, setPhone] = useState("");
    const [isValid, setIsValid] = useState(true);
    const [isButtonEnabled, setIsButtonEnabled] = useState(false);

    const handleChange = (value) => {
        setPhone(value);
        setIsValid(value.length >= 10);
    };

    const handleCheckboxChange = () => {
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        setIsButtonEnabled([...checkboxes].every(checkbox => checkbox.checked));
    };

    return (
        <Container>
            <Card className='p-4 mt-3'>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">
                            Quý vị đang cho nghỉ với tư cách Doanh Nghiệp hay Cá Nhân?
                        </Form.Label>
                        <Form.Text>
                            Câu trả lời của quý vị giúp chúng tôi đảm bảo hợp đồng có đầy đủ thông tin cần thiết.
                        </Form.Text>
                        <Form>
                            {typeOption.map((option) => (
                                <div key={option.id} className="mb-2">
                                    <Form.Check
                                        type="radio"
                                        id={`group-${option.id}`}
                                        name="hotel-group"
                                        label={option.type}
                                        checked={selectedGroup === option.id}
                                        onChange={() => setSelectedGroup(option.id)}
                                    />
                                    <div className="text-muted ms-4" style={{ fontSize: "14px" }}>
                                        {option.desc}
                                    </div>
                                </div>
                            ))}
                        </Form>
                        <hr />
                        {selectedGroup === 2 && (
                            <Form.Group className="mb-3">
                                <h6 className='fw-bold'>Tên doanh nghiệp hợp pháp</h6>
                                <Form.Label className="fw-bold">
                                    Tên công ty, tập đoàn hoặc chuỗi khách sạn
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Nhập tên công ty"
                                    value={hotelParent}
                                    onChange={(e) => setHotelParent(e.target.value)}
                                />
                            </Form.Group>
                        )}
                    </Form.Group>

                    {/* Địa chỉ đăng ký kinh doanh */}
                    <Form.Group className="mb-3">
                        <h6 className='fw-bold'>Địa chỉ đăng ký kinh doanh</h6>
                        <hr />
                        <Form.Group>
                            <Form.Label>Quốc gia/Vùng</Form.Label>
                            <Form.Select>
                                {nation.map((option) => (
                                    <option key={option.id} value={option.id}>
                                        {option.name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Row className='mt-3'>
                            <Col md={6}>
                                <Form.Label className='fw-bold'>Thành phố</Form.Label>
                                <Form.Control type="text" placeholder="Nhập thành phố" />
                            </Col>
                            <Col md={6}>
                                <Form.Label className='fw-bold'>Mã bưu chính</Form.Label>
                                <Form.Control type="text" placeholder="Nhập mã bưu chính" />
                            </Col>
                        </Row>
                    </Form.Group>

                    {/* Thông tin cá nhân */}
                    <Form.Group className='mb-3'>
                        <h6 className='fw-bold'>Thông tin cá nhân người đại diện</h6>
                        <hr />
                        <Form.Group>
                            <Form.Label className='fw-bold'>Họ và tên</Form.Label>
                            <Form.Control type="text" placeholder="Nhập họ và tên" />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label className='fw-bold'>Email</Form.Label>
                            <Form.Control type="email" placeholder="Nhập email" />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label className='fw-bold'>
                                Số điện thoại <span className="text-danger">*</span>
                            </Form.Label>
                            <div className={`border rounded d-flex align-items-center ${isValid ? "" : "border-danger"}`}>
                                <PhoneInput
                                    country={"vn"}
                                    value={phone}
                                    onChange={handleChange}
                                    inputStyle={{ border: "none", width: "100%" }}
                                    buttonStyle={{ border: "none", background: "transparent" }}
                                />
                                {!isValid && <span className="text-danger ms-2">⚠</span>}
                            </div>
                            {!isValid && <small className="text-danger">Vui lòng nhập số điện thoại hợp lệ.</small>}
                        </Form.Group>
                    </Form.Group>
                </Form>
            </Card>

            {/* Xác nhận đăng ký */}
            <Card className='p-4 mt-3'>
                <Form>
                    <Form.Group className='mb-3'>
                        <h4 className='fw-bold'>Quý vị gần xong rồi</h4>
                        <Form.Text>Sau khi hoàn tất đăng ký, Quý vị sẽ có thể:</Form.Text>
                        <hr />
                        <ul>
                            <li>Quản lý chỗ nghỉ từ dashboard</li>
                            <li>Nhận đặt phòng và tăng doanh thu</li>
                            <li>Đồng bộ lịch đặt phòng</li>
                        </ul>
                        <hr />
                        <Form.Group>
                            <Form.Label className='fw-bold'>Xin vui lòng xác nhận</Form.Label>
                            <Form.Text>
                                Tôi cam đoan rằng đây là doanh nghiệp hợp pháp với đầy đủ giấy tờ cần thiết. Travelofy giữ quyền xác minh và điều tra thông tin.
                            </Form.Text>
                        </Form.Group>
                        <hr />
                        <Form.Check
                            type="checkbox"
                            label="Tôi đã đọc, chấp nhận và đồng ý với Điều khoản chung."
                            onChange={handleCheckboxChange}
                        />
                        <Form.Check
                            type="checkbox"
                            label="Xác nhận rằng đây là cơ sở kinh doanh hợp pháp có đầy đủ giấy tờ."
                            onChange={handleCheckboxChange}
                        />
                    </Form.Group>
                </Form>
                <div className="d-flex justify-content-between mt-3">
                    <Button variant="secondary" onClick={prevStep}>Quay lại</Button>
                    <Button variant="primary" onClick={nextStep} disabled={!isButtonEnabled}>Tiếp tục</Button>
                </div>
            </Card>
        </Container>
    );
}

Step15.propTypes = {
    prevStep: PropTypes.func.isRequired,
    nextStep: PropTypes.func.isRequired
};

export default Step15;
