import { useState, useEffect } from "react";
import axiosInstance from "../../utils/AxiosInstance"
import { Container, Card, Button, Row, Col } from "react-bootstrap";
import { FaChevronLeft, FaTimesCircle, FaUpload } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { CustomToast, CustomSuccessToast, CustomFailedToast } from "../../components/toast/CustomToast";
const HotelPhotos = () => {
    const navigate = useNavigate();
    const [files, setFiles] = useState([]);
    const [dragActive, setDragActive] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Load saved images from sessionStorage
    useEffect(() => {
        const savedFiles = JSON.parse(sessionStorage.getItem("hotelPhotos")) || [];
        setFiles(savedFiles);
    }, []);

    // Validate file
    const validateFile = (file) => {
        const validTypes = ["image/jpeg", "image/png"];
        const maxSize = 47 * 1024 * 1024; // 47MB

        if (!validTypes.includes(file.type)) {
            CustomFailedToast("Chỉ chấp nhận file JPG/JPEG/PNG");
            return false;
        }

        if (file.size > maxSize) {
            CustomFailedToast("Kích thước file tối đa 47MB");
            return false;
        }

        return true;
    };

    // Handle file selection
    const handleFiles = (newFiles) => {
        const validFiles = Array.from(newFiles).filter(validateFile);

        const readers = validFiles.map((file) => {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) =>
                    resolve({
                        name: file.name,
                        url: e.target.result,
                        file, // Lưu file để upload
                    });
                reader.readAsDataURL(file);
            });
        });

        Promise.all(readers).then((newImages) => {
            // Loại bỏ ảnh trùng tên
            const existingNames = new Set(files.map((f) => f.name));
            const uniqueNewImages = newImages.filter((img) => !existingNames.has(img.name));

            const updatedFiles = [...files, ...uniqueNewImages].slice(0, 20); // Giới hạn 20 ảnh
            setFiles(updatedFiles);
            sessionStorage.setItem("hotelPhotos", JSON.stringify(updatedFiles));
        });
    };

    // Upload images to backend
    const uploadImages = async () => {
        if (files.length === 0) {
            CustomFailedToast("Vui lòng chọn ít nhất một ảnh.");
            return;
        }

        setUploading(true);

        const formData = new FormData();
        files.forEach((fileObj) => {
            formData.append("images", fileObj.file); // Sửa từ "photos" thành "images"
        });
        console.log("Uploading images:", files);
        try {
            const response = await axiosInstance.post("/hotel/upload-images", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            // Lấy danh sách URL từ API (giả sử API trả về { imageUrls: [...] })
            const imageUrls = response.data.imageUrls || [];

            // Lưu vào sessionStorage
            sessionStorage.setItem("hotelPhotos", JSON.stringify(imageUrls));

            // **Không xóa danh sách ảnh trong state, giữ nguyên để người dùng tiếp tục làm việc**
            CustomSuccessToast("Ảnh đã được tải lên thành công!");
        } catch (error) {
            console.error("Lỗi tải ảnh lên:", error);
            CustomFailedToast("Tải ảnh lên thất bại, vui lòng thử lại.");
        } finally {
            setUploading(false);
        }
    };

    // Remove an image
    const removeImage = (index) => {
        const newFiles = files.filter((_, i) => i !== index);
        setFiles(newFiles);
        sessionStorage.setItem("hotelPhotos", JSON.stringify(newFiles));
    };

    return (
        <>
            <CustomToast />

            <Container className="mt-4 w-100">
                <h3 className="mb-4 fw-bold">Khách sạn của Quý vị trông ra sao?</h3>
                <Row>
                    <Col md={5}>
                        <Card className="mb-4">
                            <Card.Body>
                                <Card.Text className="fw-bold mb-4">
                                    Đăng tải ít nhất 5 ảnh của chỗ nghỉ. Càng đăng nhiều, Quý vị càng có cơ hội nhận đặt phòng.
                                </Card.Text>

                                <div
                                    className={`border-dashed p-5 text-center ${dragActive ? "bg-primary-light" : ""}`}
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
                                    <Button as="label" htmlFor="file-upload" variant="outline-primary">
                                        Chọn ảnh từ máy tính
                                    </Button>
                                    <p className="text-muted mt-3">JPG/JPEG hoặc PNG. Tối đa 47MB mỗi file</p>
                                </div>

                                <hr />

                                <div className="row row-cols-2 g-3 mt-4">
                                    {files.map((file, index) => (
                                        <div key={index} className="col position-relative">
                                            <div className="img-thumbnail h-100 w-100">
                                                <img src={file.url} alt={file.name} className="h-100 w-100 object-fit-cover" />
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
                            <Button variant="outline-primary" onClick={() => navigate(-1)} className="w-25">
                                <FaChevronLeft />
                            </Button>

                            <Button
                                variant="primary"
                                disabled={files.length < 5 || uploading}
                                onClick={uploadImages}
                                className="w-75"
                            >
                                {uploading ? "Đang tải ảnh..." : "Tải lên ảnh"}
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default HotelPhotos;