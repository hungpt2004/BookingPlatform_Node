import PropTypes from 'prop-types';
import { Container, Card, Form, Row, Col, Button } from 'react-bootstrap';
import { typeOption, nation } from '../data/HotelOption';
import { useState, useEffect } from 'react';
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import axiosInstance from '../../utils/AxiosInstance';

const Step15 = ({ prevStep, nextStep }) => {
    const [selectedGroup, setSelectedGroup] = useState(2);
    const [hotelParent, setHotelParent] = useState("");
    const [phone, setPhone] = useState("");
    const [isValid, setIsValid] = useState(true);
    const [isButtonEnabled, setIsButtonEnabled] = useState(false);
    const [user, setUser] = useState(null);
    const [city, setCity] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [documents, setDocuments] = useState({
        businessRegistration: null,
        fireProtection: null,
        securityCertificate: null,
        foodSafety: null,
        environmentalProtection: null,
        hotelRating: null
    });
    const [documentUrls, setDocumentUrls] = useState({
        businessRegistration: "",
        fireProtection: "",
        securityCertificate: "",
        foodSafety: "",
        environmentalProtection: "",
        hotelRating: ""
    });

    // Hàm lưu dữ liệu vào sessionStorage
    const saveToSessionStorage = () => {
        const selectedGroupData = typeOption.find(item => item.id === selectedGroup);
        const formData = {
            ...selectedGroupData,
            hotelParent,
            isValid,
            isButtonEnabled,
        };
        sessionStorage.setItem('step15FormData', JSON.stringify(formData));
    };

    // Lưu dữ liệu vào sessionStorage mỗi khi có sự thay đổi
    useEffect(() => {
        saveToSessionStorage();
    }, [selectedGroup, hotelParent, isValid, isButtonEnabled]);

    // Khôi phục dữ liệu từ sessionStorage khi component được tải
    useEffect(() => {
        const savedData = sessionStorage.getItem('step15FormData');
        if (savedData) {
            const parsedData = JSON.parse(savedData);
            setSelectedGroup(parsedData.selectedGroup);
            setHotelParent(parsedData.hotelParent);
            setIsValid(parsedData.isValid);
            setIsButtonEnabled(parsedData.isButtonEnabled);
        }
    }, []);

    const handleChange = (value) => {
        setPhone(value);
        setIsValid(value.length >= 10);
    };

    const handleCheckboxChange = () => {
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        setIsButtonEnabled([...checkboxes].every(checkbox => checkbox.checked));
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axiosInstance.get('/customer/current-user');
                setUser(response.data.user);
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };

        fetchUser();
    }, []);

    useEffect(() => {
        const storedLocation = sessionStorage.getItem("hotelLocation");
        if (storedLocation) {
            const { city, postalCode } = JSON.parse(storedLocation);
            setCity(city);
            setPostalCode(postalCode);
        }
    }, []);

    // Xử lý chọn file
    const handleFileSelect = (event, documentType) => {
        const file = event.target.files[0];
        if (file) {
            setDocuments(prev => ({
                ...prev,
                [documentType]: file
            }));
        }
    };

    // Tải lên từng tài liệu
    const handleUploadDocument = async (documentType) => {
        const file = documents[documentType];
        if (!file) {
            alert("Vui lòng chọn file trước.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("documentType", documentType);

        setIsUploading(true);
        try {
            const response = await axiosInstance.post("/hotel/upload-document", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            setDocumentUrls(prev => ({
                ...prev,
                [documentType]: response.data.documentUrl
            }));

            alert(`Tải file ${file.name} thành công!`);
        } catch (error) {
            console.error(`Lỗi khi tải file ${documentType}:`, error);
            alert(`Tải file thất bại.`);
        } finally {
            setIsUploading(false);
        }
    };

    const areAllDocumentsUploaded = () => {
        return Object.values(documentUrls).every(url => url !== "");
    };

    const createHotelFromSessionStorage = async () => {
        try {
            // Get all data from sessionStorage
            const hotelNameAndStar = JSON.parse(sessionStorage.getItem('hotelName&Star'));
            const hotelLocation = JSON.parse(sessionStorage.getItem('hotelLocation'));
            const hotelDescription = JSON.parse(sessionStorage.getItem('hotelDes'));
            const hotelBillInfo = JSON.parse(sessionStorage.getItem('hotelBillInfo'));

            // Check if all documents are uploaded
            if (!areAllDocumentsUploaded()) {
                alert('Vui lòng tải lên tất cả các tài liệu cần thiết trước khi hoàn thành!');
                return;
            }

            // Create PendingHost entry first
            const pendingHostData = {
                businessName: hotelBillInfo?.companyLegalName || hotelParent || hotelNameAndStar?.hotelName,
                businessDocuments: Object.values(documentUrls),
            };

            // Send pendingHost data to backend
            const pendingHostResponse = await axiosInstance.post('/hotel/create-pending', pendingHostData);

            if (!pendingHostResponse.data.success) {
                alert(`Lỗi: ${pendingHostResponse.data.message}`);
                return;
            }

            // Now create the hotel data
            const formData = new FormData();

            // Add hotel information
            formData.append('hotelName', hotelNameAndStar.hotelName);
            formData.append('star', hotelNameAndStar.star);
            formData.append('description', hotelDescription.desc);
            formData.append('address', `${hotelLocation.address}, ${hotelLocation.city}, ${hotelLocation.postalCode}`);
            formData.append('phoneNumber', user ? user.phone : phone);

            console.log(formData);

            // Send data to backend
            const response = await axiosInstance.post('/hotel/create', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.success) {
                alert('Khách sạn đã được tạo thành công! Vui lòng chờ đợi xét duyệt đăng ký của bạn.');
                nextStep(); // Move to the next step
            } else {
                alert(`Lỗi: ${response.data.message}`);
            }
        } catch (error) {
            console.error('Lỗi khi tạo khách sạn:', error);
            alert('Đã xảy ra lỗi khi tạo khách sạn. Vui lòng thử lại.');
        }
    };

    // Document types list
    const documentTypes = [
        { type: "businessRegistration", label: "Thủ tục đăng ký kinh doanh khách sạn" },
        { type: "fireProtection", label: "Giấy phép đủ điều kiện Phòng cháy chữa cháy" },
        { type: "securityCertificate", label: "Giấy chứng nhận an ninh trật tự" },
        { type: "foodSafety", label: "Giấy chứng nhận cơ sở đủ điều kiện vệ sinh an toàn thực phẩm" },
        { type: "environmentalProtection", label: "Giấy phép cam kết bảo vệ môi trường" },
        { type: "hotelRating", label: "Đăng ký xếp hạng sao/Quyết định công nhận hạng tiêu chuẩn cơ sở lưu trú du lịch" }
    ];

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
                                <Form.Control type="text" placeholder="Nhập thành phố" value={city} />
                            </Col>
                            <Col md={6}>
                                <Form.Label className='fw-bold'>Mã bưu chính</Form.Label>
                                <Form.Control type="text" placeholder="Nhập mã bưu chính" value={postalCode} />
                            </Col>
                        </Row>
                    </Form.Group>

                    {/* Thông tin cá nhân */}
                    <Form.Group className='mb-3'>
                        <h6 className='fw-bold'>Thông tin cá nhân người đại diện</h6>
                        <hr />
                        <Form.Group>
                            <Form.Label className='fw-bold'>Họ và tên</Form.Label>
                            <Form.Control type="text" placeholder="Nhập họ và tên" value={user ? user.name : ""} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label className='fw-bold'>Email</Form.Label>
                            <Form.Control type="email" placeholder="Nhập email" value={user ? user.email : ""} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label className='fw-bold'>
                                Số điện thoại <span className="text-danger">*</span>
                            </Form.Label>
                            <div className={`border rounded d-flex align-items-center ${isValid ? "" : "border-danger"}`}>
                                <PhoneInput
                                    country={"vn"}
                                    value={user ? user.phone : phone}
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

            {/* Tài liệu đăng ký khách sạn */}
            <Card className="p-4 mt-3">
                <h4 className="fw-bold">Tải lên tài liệu đăng ký khách sạn</h4>
                <p>Vui lòng tải lên các giấy tờ cần thiết sau:</p>

                {documentTypes.map((doc) => (
                    <Form.Group key={doc.type} className="mb-4 p-3 border rounded">
                        <Form.Label className="fw-bold">{doc.label}</Form.Label>
                        <div className="d-flex align-items-center mt-2">
                            <Form.Control
                                type="file"
                                onChange={(e) => handleFileSelect(e, doc.type)}
                                className="me-2"
                            />
                            <Button
                                onClick={() => handleUploadDocument(doc.type)}
                                disabled={isUploading || !documents[doc.type]}
                            >
                                {isUploading ? "Đang tải..." : "Tải lên"}
                            </Button>
                        </div>
                        {documentUrls[doc.type] && (
                            <div className="mt-2 text-success">
                                <i className="bi bi-check-circle-fill me-2"></i>
                                Đã tải lên thành công!
                                <a href={documentUrls[doc.type]} target="_blank" rel="noopener noreferrer" className="ms-2">
                                    Xem tài liệu
                                </a>
                            </div>
                        )}
                    </Form.Group>
                ))}

                <div className="alert alert-info">
                    <i className="bi bi-info-circle-fill me-2"></i>
                    Tất cả các tài liệu đều bắt buộc phải tải lên để hoàn tất quá trình đăng ký khách sạn.
                </div>
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
                    <Button
                        variant="primary"
                        onClick={createHotelFromSessionStorage}
                        disabled={!isButtonEnabled || !areAllDocumentsUploaded()}
                    >
                        Hoàn Thành
                    </Button>
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