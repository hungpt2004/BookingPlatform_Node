import { Container, Card, Form, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { hotelStar, yesNo } from '../data/HotelOption';
import { FaStar } from "react-icons/fa";

const Step6 = ({ nextStep, prevStep }) => {
    const [hotelName, setHotelName] = useState("");
    const [selectedStar, setSelectedStar] = useState(null);
    const [selectedGroup, setSelectedGroup] = useState(2);
    const [hotelGroup, setHotelGroup] = useState("");
    // Save location data to sessionStorage when it changes
    useEffect(() => {
        sessionStorage.setItem("hotelName", JSON.stringify(hotelName));
    }, [hotelName]);
    return (
        <Container>
            <h4 className="fw-bold mt-4">Cho chúng tôi biết thêm về hotel của Quý vị</h4>

            <Card className="p-4 mt-3">
                <Form>
                    {/* Hotel Name */}
                    <Form.Group>
                        <Form.Label className='fw-bold'>Khách sạn của Quý vị tên gì?</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Nhập tên chỗ nghỉ"
                            value={hotelName}
                            onChange={(e) => setHotelName(e.target.value)}
                        />
                        <Form.Text className="text-muted">
                            Tên này sẽ được hiển thị tới khách khi họ tìm kiếm chỗ nghỉ.
                        </Form.Text>
                    </Form.Group>

                    <hr />

                    {/* Hotel Stars */}
                    <Form.Group>
                        <Form.Label className="fw-bold">Khách sạn của Quý vị được xếp hạng mấy sao?</Form.Label>
                        <div>
                            <Form.Check
                                type="radio"
                                id="no-star"
                                name="hotel-stars"
                                label="Không áp dụng"
                                checked={selectedStar === null}
                                onChange={() => setSelectedStar(null)}
                            />
                            {hotelStar.map((star) => (
                                <Form.Check
                                    key={star.id}
                                    type="radio"
                                    id={`star-${star.id}`}
                                    name="hotel-stars"
                                    label={
                                        <>
                                            {star.star} sao {Array.from({ length: star.star }).map((_, index) => (
                                                <FaStar key={index} color="#ffc107" />
                                            ))}
                                        </>
                                    }
                                    checked={selectedStar === star.star}
                                    onChange={() => setSelectedStar(star.star)}
                                />
                            ))}
                        </div>
                    </Form.Group>

                    <hr />

                    {/* Thuộc tập đoàn nào */}
                    <Form.Group>
                        <Form.Label className="fw-bold">
                            Quý vị có phải là công ty quản lý chỗ nghỉ hay thuộc tập đoàn hoặc chuỗi khách sạn không?
                        </Form.Label>
                        <div>
                            {yesNo.map((option) => (
                                <Form.Check
                                    key={option.id}
                                    type="radio"
                                    id={`group-${option.id}`}
                                    name="hotel-group"
                                    label={option.title}
                                    checked={selectedGroup === option.id}
                                    onChange={() => setSelectedGroup(option.id)}
                                />
                            ))}
                        </div>

                        {/* Input hiển thị khi chọn "Có" */}
                        {selectedGroup === 1 && (
                            <Form.Group className="mt-3">
                                <Form.Label className="fw-bold">Tên công ty, tập đoàn hoặc chuỗi khách sạn</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Nhập tên công ty"
                                    value={hotelGroup}
                                    onChange={(e) => setHotelGroup(e.target.value)}
                                />
                            </Form.Group>
                        )}
                    </Form.Group>

                    <hr />

                    {/* Nút Back & Next */}
                    <div className="d-flex justify-content-between">
                        <Button variant="secondary" onClick={prevStep}>Quay lại</Button>
                        <Button
                            variant="primary"
                            onClick={nextStep}
                            disabled={!hotelName.trim()} // Disable nếu chưa nhập tên khách sạn
                        >
                            Tiếp tục
                        </Button>
                    </div>
                </Form>
            </Card>
        </Container>
    );
};

Step6.propTypes = {
    nextStep: PropTypes.func.isRequired,
    prevStep: PropTypes.func.isRequired,
};

export default Step6;
