import PropTypes from 'prop-types';
import { Container, Card, Form, Row, Col, Button } from 'react-bootstrap';
import { typeOption, nation, documentTypes } from '../data/HotelOption';
import { useState, useEffect } from 'react';
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import axiosInstance from '../../utils/AxiosInstance';
import { useNavigate } from 'react-router-dom';
import { CustomFailedToast, CustomSuccessToast, CustomToast } from '../toast/CustomToast';
const Step15 = ({ prevStep }) => {
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
    const navigate = useNavigate();
    // Hàm lưu dữ liệu vào sessionStorage
    const saveToSessionStorage = () => {
        const selectedGroupData = typeOption.find(item => item.id === selectedGroup);
        const formData = {
            ...selectedGroupData,
            isValid,
            isButtonEnabled,
        };
        sessionStorage.setItem('step15FormData', JSON.stringify(formData));
    };

    // Lưu dữ liệu vào sessionStorage mỗi khi có sự thay đổi
    useEffect(() => {
        saveToSessionStorage();
    }, [selectedGroup, isValid, isButtonEnabled]);

    // Khôi phục dữ liệu từ sessionStorage khi component được tải và data user
    useEffect(() => {
        //user
        const fetchUser = async () => {
            try {
                const response = await axiosInstance.get('/customer/current-user');
                setUser(response.data.user);
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };
        //sessionStorage        
        const savedData = sessionStorage.getItem('step15FormData');
        if (savedData) {
            const parsedData = JSON.parse(savedData);
            setSelectedGroup(parsedData.selectedGroup);
            setIsValid(parsedData.isValid);
            setIsButtonEnabled(parsedData.isButtonEnabled);
        }
        //location
        const storedLocation = sessionStorage.getItem("hotelLocation");
        if (storedLocation) {
            const { city, postalCode } = JSON.parse(storedLocation);
            setCity(city);
            setPostalCode(postalCode);
        }
        // Call fetchUser
        fetchUser();
        //get hotelGroup from sessionStorage
        const savedHotelGroup = sessionStorage.getItem("hotelGroup");
        if (savedHotelGroup) {
            setSelectedGroup(2);
            setHotelParent(savedHotelGroup);
        }
        else{
            setSelectedGroup(1);
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

    //validate upload documents
    const handleFileSelect = (event, documentType) => {
        const file = event.target.files[0];

        if (!file) return; // Tránh lỗi nếu không có file được chọn

        // Kiểm tra định dạng file hợp lệ (ví dụ: PDF, PNG, JPG)
        const allowedTypes = ["application/pdf", "image/png", "image/jpeg"];
        if (!allowedTypes.includes(file.type)) {
            CustomFailedToast("Vui lòng chọn tệp có định dạng PDF, PNG hoặc JPG.");
            event.target.value = "";
            return;
        }

        setDocuments(prev => ({
            ...prev,
            [documentType]: file
        }));
    };

    //upload all documents to server
    const handleUploadAllDocuments = async () => {
        if (!areAllDocumentsSelected()) {
            CustomFailedToast("Vui lòng chọn tất cả các tài liệu trước khi tải lên.");
            return;
        }

        const formData = new FormData();

        const documentTypesArray = [];
        Object.entries(documents).forEach(([type, file]) => {
            formData.append("files", file);
            documentTypesArray.push(type);
        });

        formData.append("documentTypes", documentTypesArray.join(",")); // Gửi đúng định dạng
        setIsUploading(true);
        try {
            const response = await axiosInstance.post("/hotel/upload-documents", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            if (response.data.success) {
                setDocumentUrls(response.data.documentUrls);
                //sessionStorage.setItem('documentUrls', JSON.stringify(response.data.documentUrls));
                CustomSuccessToast("Tất cả tài liệu đã được tải lên thành công!");
            } else {
                CustomFailedToast(`Lỗi: ${response.data.message}`);
            }
        } catch (error) {
            console.error("Lỗi khi tải tài liệu:", error);
            CustomFailedToast("Tải tài liệu thất bại.");
        } finally {
            setIsUploading(false);
        }
    };

    // Kiểm tra xem đã chọn đủ tài liệu chưa
    const areAllDocumentsSelected = () => {
        return documentTypes.every(doc => documents[doc.type]);
    };
    //xóa tất cả sessionStorage ngoại trừ token
    const clearSessionStorageExceptToken = () => {
        Object.keys(sessionStorage).forEach((key) => {
            if (key !== 'token') {
                sessionStorage.removeItem(key);
            }
        });
    };
   
    const createHotelFromSessionStorage = async () => {
        try {
            // Get all data from sessionStorage
            const hotelNameAndStar = JSON.parse(sessionStorage.getItem('hotelName&Star'));
            const hotelLocation = JSON.parse(sessionStorage.getItem('hotelLocation'));
            const hotelDescription = JSON.parse(sessionStorage.getItem('hotelDes'));
            //const hotelBillInfo = JSON.parse(sessionStorage.getItem('hotelBillInfo'));
            const hotelFacilities = JSON.parse(sessionStorage.getItem('hotelFacility'));
            const hotelServiceData = JSON.parse(sessionStorage.getItem('hotelService'));
            const imageUrls = JSON.parse(sessionStorage.getItem('hotelPhotos'));
            // Tạo FormData để gửi thông tin khách sạn
            const formData = new FormData();
            formData.append('hotelName', hotelNameAndStar.hotelName);
            formData.append('star', hotelNameAndStar.star);
            formData.append('description', hotelDescription.desc);
            formData.append('address', `${hotelLocation.address}, ${hotelLocation.city}, ${hotelLocation.postalCode}`);
            formData.append('phoneNumber', user ? user.phone : phone);
            formData.append('businessDocuments', JSON.stringify(documentUrls));
            formData.append('facilities', JSON.stringify(hotelFacilities.map(facility => facility._id)));
            formData.append('services', JSON.stringify(hotelServiceData));
            formData.append('imageUrls', JSON.stringify(imageUrls));
            formData.append('hotelGroup', hotelParent ? hotelParent : '');
            const response = await axiosInstance.post('/hotel/create', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('services:', hotelServiceData);
            if (response.data.success) {
                CustomSuccessToast('Khách sạn đã được tạo thành công! Vui lòng chờ đợi xét duyệt đăng ký của bạn.');
                clearSessionStorageExceptToken();
                setTimeout(() => {
                    navigate('/home');
                }, 800)
            } else {
                CustomFailedToast(`Lỗi: ${response.data.message}`);
            }
        } catch (error) {
            console.error('Lỗi khi tạo khách sạn:', error);
            CustomFailedToast('Đã xảy ra lỗi khi tạo khách sạn. Vui lòng thử lại.');
        }
    };

    return (
        <>
            <CustomToast />
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
                            <Form.Control
                                type="file"
                                onChange={(e) => handleFileSelect(e, doc.type)}
                                className="mt-2"
                            />
                        </Form.Group>
                    ))}

                    <Button
                        onClick={handleUploadAllDocuments}
                        disabled={isUploading || !areAllDocumentsSelected()}
                        className="mt-3"
                    >
                        {isUploading ? "Đang tải..." : "Tải lên tất cả"}
                    </Button>

                    {/* {Object.entries(documentUrls).length > 0 && (
                    <div className="mt-3 alert alert-success">
                        <i className="bi bi-check-circle-fill me-2"></i>
                        Tất cả tài liệu đã được tải lên thành công!
                    </div>
                )} */}
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
                            disabled={!isButtonEnabled || !areAllDocumentsSelected()}
                        >
                            Hoàn Thành
                        </Button>
                    </div>
                </Card>
            </Container>
        </>
    );
}

Step15.propTypes = {
    prevStep: PropTypes.func.isRequired,

};

export default Step15;