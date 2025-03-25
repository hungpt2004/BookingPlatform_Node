import { Container, Card, Form, Button, Row, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { hotelStar, yesNo } from '../data/HotelOption';
import { FaStar } from "react-icons/fa";
import { services } from '../data/HotelOption';
import axiosInstance from '../../utils/AxiosInstance'
export const Step6 = ({ nextStep, prevStep }) => {
    const [hotelName, setHotelName] = useState("");
    const [selectedStar, setSelectedStar] = useState(null);
    const [selectedGroup, setSelectedGroup] = useState(2);
    const [hotelGroup, setHotelGroup] = useState("");
    // Save location data to sessionStorage when it changes
    const saveNameStarHotel = () => {
        let star = null;
        if (selectedStar === null) {
            star = { id: 0, star: 0 }; // Tạo một đối tượng star mặc định khi chọn "Không áp dụng"
        } else {
            star = hotelStar.find(item => item.id === selectedStar);
        }

        const hotelNameStar = {
            ...star,
            hotelName
        };
        sessionStorage.setItem("hotelName&Star", JSON.stringify(hotelNameStar));
        sessionStorage.setItem("hotelGroup", hotelGroup);
    }

    useEffect(() => {
        saveNameStarHotel()
    }, [hotelName, selectedStar, hotelGroup]);
    return (
        <>
            <br></br>
            <br></br>
            <Container className='mt-5'>
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
        </>
    );
};

export const Step7 = ({ nextStep, prevStep }) => {
    const [hotelFacilities, setHotelFacilities] = useState([]); // Dữ liệu từ API
    const [selectedOptions, setSelectedOptions] = useState([]);

    // Gọi API để lấy danh sách tiện ích khách sạn
    useEffect(() => {
        const fetchFacilities = async () => {
            try {
                const response = await axiosInstance.get("/facility/get-hotelfacilities");

                // ✅ Đảm bảo lấy đúng dữ liệu
                if (response.data && response.data.hotelFacilities) {
                    setHotelFacilities(response.data.hotelFacilities);
                } else {
                    console.error("Dữ liệu trả về không hợp lệ:", response.data);
                }
            } catch (error) {
                console.error("Lỗi khi lấy danh sách tiện ích khách sạn:", error);
            }
        };

        fetchFacilities();
    }, []);

    // Xử lý khi chọn checkbox
    const handleCheckboxChange = (facility) => {
        setSelectedOptions((prev) => {
            const exists = prev.some((f) => f._id === facility._id);
            return exists ? prev.filter((f) => f._id !== facility._id) : [...prev, facility];
        });
    };

    // Lưu danh sách tiện ích đã chọn vào sessionStorage
    useEffect(() => {
        sessionStorage.setItem("hotelFacility", JSON.stringify(selectedOptions));
    }, [selectedOptions]);

    return (
        <Container className='mt-5'>
            <h4 className="fw-bold mt-5 pt-4">Khách có thể sử dụng gì tại khách sạn của Quý vị?</h4>

            <Card className="p-4 mt-3">
                <Form>
                    <Row>
                        {hotelFacilities.length > 0 ? (
                            hotelFacilities.map((facility) => (
                                <Col md={12} key={facility._id}>
                                    <Form.Check
                                        type="checkbox"
                                        id={`facility-${facility._id}`}
                                        label={facility.name}
                                        checked={selectedOptions.some((f) => f._id === facility._id)}
                                        onChange={() => handleCheckboxChange(facility)}
                                    />
                                </Col>
                            ))
                        ) : (
                            <p className="text-danger">Không có tiện ích nào được tìm thấy.</p>
                        )}
                    </Row>
                </Form>

                <hr />

                <div className="d-flex justify-content-between">
                    <Button variant="secondary" onClick={prevStep}>Quay lại</Button>
                    <Button variant="primary" onClick={nextStep} disabled={selectedOptions.length === 0}>
                        Tiếp tục
                    </Button>
                </div>
            </Card>
        </Container>
    );
};

Step6.propTypes = Step7.propTypes = {
    nextStep: PropTypes.func.isRequired,
    prevStep: PropTypes.func.isRequired,
};