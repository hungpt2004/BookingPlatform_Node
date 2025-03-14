import PropTypes from 'prop-types';
import { Container, Card, Form, Row, Col, Button } from 'react-bootstrap';
import { typeOption, nation } from '../data/HotelOption';
import { useState, useEffect } from 'react'; // Thêm useEffect
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
    const [zipFile, setZipFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [documentUrl, setDocumentUrl] = useState("");

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
                const response = await axiosInstance.get('/customer/current-user'); // Gọi API từ backend
                setUser(response.data.user);
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };

        fetchUser();
    }, []);
    //get data from session storage
    useEffect(() => {
        const storedLocation = sessionStorage.getItem("hotelLocation");
        if (storedLocation) {
            const { city, postalCode } = JSON.parse(storedLocation);
            setCity(city);
            setPostalCode(postalCode);
        }
    }, []);

    // Xử lý chọn file ZIP
    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file && file.type === "application/zip") {
            setZipFile(file);
        } else {
            alert("Vui lòng chọn một file ZIP hợp lệ.");
        }
    };

    // Gửi file ZIP lên backend
    const handleUploadZip = async () => {
        if (!zipFile) {
            alert("Vui lòng chọn file ZIP trước.");
            return;
        }

        const formData = new FormData();
        formData.append("file", zipFile);

        setIsUploading(true);
        try {
            const response = await axiosInstance.post("/hotel/upload-zip", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            setDocumentUrl(response.data.documentUrl);
            alert("Tải file ZIP thành công!");
        } catch (error) {
            console.error("Lỗi khi tải file ZIP:", error);
            alert("Tải file ZIP thất bại.");
        } finally {
            setIsUploading(false);
        }
    };

    const createHotelFromSessionStorage = async () => {
        try {
            // Get all data from sessionStorage
            const hotelNameAndStar = JSON.parse(sessionStorage.getItem('hotelName&Star'));
            const hotelLocation = JSON.parse(sessionStorage.getItem('hotelLocation'));
            const hotelDescription = JSON.parse(sessionStorage.getItem('hotelDes'));
            const hotelBillInfo = JSON.parse(sessionStorage.getItem('hotelBillInfo'));
            //const hotelServices = JSON.parse(sessionStorage.getItem('ServiceOptions'));
            //const hotelPhotos = JSON.parse(sessionStorage.getItem('hotelPhotos'));

            // First create a PendingHost entry with the business documents
            if (!documentUrl) {
                alert('Vui lòng tải lên tài liệu đăng ký khách sạn trước khi hoàn thành!');
                return;
            }

            // Create PendingHost entry first
            const pendingHostData = {
                businessName: hotelBillInfo.companyLegalName || hotelNameAndStar.hotelName, // Use company name if available, or hotel name as fallback
                businessDocuments: [documentUrl], // Use the document URL from the ZIP upload
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

            // Add facilities from service options
            // if (hotelServices && Array.isArray(hotelServices)) {
            //     hotelServices.forEach(service => {
            //         formData.append('facilities', service.name);
            //     });
            // }
            console.log(formData);
            // Handle images
            // if (hotelPhotos && hotelPhotos.length > 0) {
            //     // Convert base64 images to files
            //     hotelPhotos.forEach((photo, index) => {
            //         if (photo.url && photo.url.startsWith('data:')) {
            //             const blob = dataURLtoBlob(photo.url);
            //             const file = new File([blob], photo.name || `hotel-image-${index}.jpg`, {
            //                 type: blob.type
            //             });
            //             formData.append('images', file);
            //         }
            //     });
            // }

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

    // Helper function to convert base64/dataURL to Blob
    // const dataURLtoBlob = (dataURL) => {
    //     const arr = dataURL.split(',');
    //     const mime = arr[0].match(/:(.*?);/)[1];
    //     const bstr = atob(arr[1]);
    //     let n = bstr.length;
    //     const u8arr = new Uint8Array(n);

    //     while (n--) {
    //         u8arr[n] = bstr.charCodeAt(n);
    //     }

    //     return new Blob([u8arr], { type: mime });
    // };




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
            <Card className="p-4 mt-3">
                <h4 className="fw-bold">Tải tài liệu đăng ký khách sạn</h4>
                <Form.Group>
                    <Form.Label>Chọn file ZIP chứa các tài liệu</Form.Label>
                    <Form.Control type="file" accept=".zip" onChange={handleFileSelect} />
                </Form.Group>
                <Button className="mt-3" onClick={handleUploadZip} disabled={isUploading}>
                    {isUploading ? "Đang tải..." : "Tải lên ZIP"}
                </Button>

                {documentUrl && (
                    <p className="mt-3 text-success">Tài liệu đã tải lên: <a href={documentUrl} target="_blank" rel="noopener noreferrer">Xem tài liệu</a></p>
                )}
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
                        disabled={!isButtonEnabled}
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