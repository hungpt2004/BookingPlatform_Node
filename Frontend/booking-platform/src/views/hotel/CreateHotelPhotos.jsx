import { useState, useEffect } from 'react';
import { Container, Card, Button, Row, Col, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaChevronLeft, FaTimes, FaTimesCircle, FaUpload } from 'react-icons/fa';
import "./CreateHotelPhoto.css";
const HotelPhotos = () => {
    const navigate = useNavigate();
    const [files, setFiles] = useState([]);
    const [dragActive, setDragActive] = useState(false);
    const [open, setOpen] = useState(true);

    // Move image position
    const moveImage = (fromIndex, toIndex) => {
        const newFiles = [...files];
        const [movedItem] = newFiles.splice(fromIndex, 1);
        newFiles.splice(toIndex, 0, movedItem);
        setFiles(newFiles);
        sessionStorage.setItem('hotelPhotos', JSON.stringify(newFiles));
    };

    // Set main image
    const setMainImage = (index) => {
        const newFiles = [...files];
        const [selectedItem] = newFiles.splice(index, 1);
        newFiles.unshift(selectedItem);
        setFiles(newFiles);
        sessionStorage.setItem('hotelPhotos', JSON.stringify(newFiles));
    };

    // Remove image
    const removeImage = (index) => {
        const newFiles = files.filter((_, i) => i !== index);
        setFiles(newFiles);
        sessionStorage.setItem('hotelPhotos', JSON.stringify(newFiles));
    };
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

    const ToggleOpen = () => {
        setOpen(!open);
    }

    return (
        <Container className="mt-4 w-100"
        >
            <h3 className="mb-4 fw-bold">Khách sạn của Quý vị trông ra sao?</h3>

            <Row>
                <Col md={5}>
                    <Card className="mb-4" >
                        <Card.Body>
                            <Card.Text className="fw-bold mb-4">
                                Đăng tải ít nhất 5 ảnh của chỗ nghỉ. Càng đăng nhiều, Quý vị càng có cơ hội nhận đặt phòng.
                            </Card.Text>

                            <div
                                className={`border-dashed p-5 text-center ${dragActive ? 'bg-primary-light' : ''}`}
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    setDragActive(true);
                                }}
                                onDragLeave={() => setDragActive(false)}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    setDragActive(false);
                                    handleFiles(e.dataTransfer.files);
                                }}
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

                            <hr />

                            <div
                                className="row row-cols-2 g-3 mt-4"
                                onDragEnter={(e) => e.preventDefault()}
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    e.dataTransfer.dropEffect = 'move';
                                }}
                                onDragLeave={(e) => e.preventDefault()}
                            >
                                {files.map((file, index) => (
                                    <div
                                        key={index}
                                        className="col position-relative"
                                        draggable
                                        onDragStart={(e) => {
                                            e.dataTransfer.setData("index", index);
                                            e.currentTarget.classList.add('dragging');
                                        }}
                                        onDragEnd={(e) => {
                                            e.currentTarget.classList.remove('dragging');
                                        }}
                                        onDragOver={(e) => {
                                            e.preventDefault();
                                            const currentTarget = e.currentTarget;
                                            const boundingBox = currentTarget.getBoundingClientRect();
                                            const offsetY = e.clientY - boundingBox.top - boundingBox.height / 2;

                                            if (offsetY < 0) {
                                                currentTarget.style.transform = 'translateY(-5px)';
                                            } else {
                                                currentTarget.style.transform = 'translateY(5px)';
                                            }
                                        }}
                                        onDrop={(e) => {
                                            e.preventDefault();
                                            const fromIndex = parseInt(e.dataTransfer.getData("index"));
                                            const toIndex = index;
                                            moveImage(fromIndex, toIndex);

                                            // Reset transformations
                                            document.querySelectorAll('.col').forEach(item => {
                                                item.style.transform = 'none';
                                            });
                                        }}
                                    >
                                        {index === 0 && (
                                            <div className="position-absolute top-0 start-0 m-2 badge bg-primary">
                                                Ảnh chính
                                            </div>
                                        )}

                                        <div
                                            className={`img-thumbnail h-100 w-100 position-relative 
                    ${index === 0 ? 'border border-3 border-primary' : ''}`}
                                            style={{
                                                width: '200px',
                                                height: '150px',
                                                cursor: 'move',
                                                transition: 'transform 0.2s, opacity 0.2s'
                                            }}
                                        >
                                            <img
                                                src={file.url}
                                                alt={file.name}
                                                className="h-100 w-100 object-fit-cover"
                                                draggable="false"
                                            />

                                            {/* Set as main button */}
                                            {index !== 0 && (
                                                <Button
                                                    variant="dark"
                                                    size="sm"
                                                    className="position-absolute bottom-0 start-0 m-1"
                                                    onClick={() => setMainImage(index)}
                                                >
                                                    Đặt làm ảnh chính
                                                </Button>
                                            )}

                                            {/* Remove button */}
                                            <FaTimesCircle
                                                className="position-absolute top-0 end-0 m-1 text-danger"
                                                onClick={() => removeImage(index)}
                                                style={{ cursor: "pointer", zIndex: 10 }}
                                            />
                                        </div>
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