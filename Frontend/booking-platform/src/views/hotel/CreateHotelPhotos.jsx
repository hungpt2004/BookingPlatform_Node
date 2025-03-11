import { useState, useEffect } from 'react';
import { Container, Card, Button, Row, Col, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaChevronLeft, FaTimes, FaTimesCircle, FaUpload } from 'react-icons/fa';

const HotelPhotos = () => {
    const navigate = useNavigate();
    const [files, setFiles] = useState([]);
    const [dragActive, setDragActive] = useState(false);
    const [open, setOpen] = useState(true);

    // Load saved images from sessionStorage
    useEffect(() => {
        const savedFiles = JSON.parse(sessionStorage.getItem('hotelPhotos')) || [];
        setFiles(savedFiles);
    }, []);

    // Handle file validation
    const validateFile = (file) => {
        const validTypes = ['image/jpeg', 'image/png'];
        const maxSize = 47 * 1024 * 1024; // 47MB

        if (!validTypes.includes(file.type)) {
            alert('Chỉ chấp nhận file JPG/JPEG/PNG');
            return false;
        }

        if (file.size > maxSize) {
            alert('Kích thước file tối đa 47MB');
            return false;
        }

        return true;
    };

    // Handle file upload
    const handleFiles = (newFiles) => {
        const validFiles = Array.from(newFiles).filter(validateFile);

        const readers = validFiles.map(file => {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) => resolve({
                    name: file.name,
                    url: e.target.result
                });
                reader.readAsDataURL(file);
            });
        });

        Promise.all(readers).then(newImages => {
            const updatedFiles = [...files, ...newImages].slice(0, 20); // Limit to 20 files
            setFiles(updatedFiles);
            sessionStorage.setItem('hotelPhotos', JSON.stringify(updatedFiles));
        });
    };

    // Drag and drop handlers
    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files) {
            handleFiles(e.dataTransfer.files);
        }
    };

    // Remove image
    const removeImage = (index) => {
        const newFiles = files.filter((_, i) => i !== index); +
            setFiles(newFiles);
        sessionStorage.setItem('hotelPhotos', JSON.stringify(newFiles));
    };

    const ToggleOpen = () => {
        setOpen(!open);
    }

    return (
        <Container className="mt-4 w-100"
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
        >
            <h3 className="mb-4 fw-bold">Khách sạn của Quý vị trông ra sao?</h3>

            <Row>
                <Col md={5}>
                    <Card className="mb-4">
                        <Card.Body>
                            <Card.Text className="fw-bold mb-4">
                                Đăng tải ít nhất 5 ảnh của chỗ nghỉ. Càng đăng nhiều, Quý vị càng có cơ hội nhận đặt phòng.
                            </Card.Text>

                            <div
                                className={`border-dashed p-5 text-center ${dragActive ? 'bg-primary-light' : ''}`}
                            >
                                <FaUpload className="h3 mb-3" />
                                <p>Kéo và thả ảnh vào đây hoặc</p>
                                <input
                                    type="file"
                                    id="file-upload"
                                    multiple
                                    accept="image/jpeg, image/png"
                                    onChange={(e) => handleFiles(e.target.files)}
                                    hidden
                                />
                                <Button
                                    as="label"
                                    htmlFor="file-upload"
                                    variant="outline-primary"
                                >
                                    Chọn ảnh từ máy tính
                                </Button>
                                <p className="text-muted mt-3">
                                    JPG/JPEG hoặc PNG. Tối đa 47MB mỗi file
                                </p>
                            </div>

                            {/* Image Preview Grid */}
                            <div className="row row-cols-3 g-3 mt-4">
                                {files.map((file, index) => (
                                    <div key={index} className="col position-relative">
                                        <img
                                            src={file.url}
                                            alt={file.name}
                                            className="img-thumbnail h-100 w-100 object-fit-cover"
                                        />
                                        <FaTimesCircle
                                            className="position-absolute top-0 end-0 mt-2 , me-3 text-danger"
                                            onClick={() => removeImage(index)}
                                            style={{
                                                cursor: "pointer",
                                                zIndex: 10,
                                            }}

                                        />
                                    </div>
                                ))}

                            </div>
                        </Card.Body>
                    </Card>

                    <div className="d-flex justify-content-between gap-3">
                        <Button
                            variant="outline-primary "
                            onClick={() => navigate(-1)}
                            className='w-25'
                        >
                            <FaChevronLeft />
                        </Button>

                        <Button
                            variant="primary "
                            disabled={files.length < 5}
                            onClick={() => navigate('/create-hotel')}
                            className='w-75'
                        >
                            Tiếp tục
                        </Button>
                    </div>
                </Col>
                {open && (
                    <Col md={3}>
                        <Card className="p-3">
                            <FaTimes
                                className="position-absolute top-0 end-0 mt-3 me-3"
                                onClick={ToggleOpen}
                                style={{
                                    cursor: "pointer",
                                    zIndex: 10,
                                }}
                            />
                            <h6 className="fw-bold mb-3">Nếu tôi không có ảnh chụp chuyên nghiệp thì sao?</h6>
                            <p className="small text-muted">
                                Không sao cả! Quý vị có thể sử dụng smartphone hoặc máy ảnh kỹ thuật số.
                                Sau đây là một số mẹo chụp ảnh đẹp cho chỗ nghỉ của Quý vị:
                            </p>
                            <ul className="small text-muted">
                                <li>Chụp vào ban ngày với đủ ánh sáng</li>
                                <li>Chụp từ nhiều góc độ khác nhau</li>
                                <li>Giữ khung hình gọn gàng</li>
                            </ul>
                            <p className="small text-muted">
                                <strong>Lưu ý:</strong> Chỉ sử dụng ảnh của bạn hoặc có sự cho phép của chủ sở hữu.
                            </p>
                        </Card>
                    </Col>
                )}
            </Row>
        </Container>
    );
};

export default HotelPhotos;