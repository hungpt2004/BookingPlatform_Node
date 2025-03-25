/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Table,
  Badge,
  Button,
  Spinner,
  Modal,
  Form,
  Row,
  Col,
  Alert,
} from "react-bootstrap";
import axiosInstance from "../../utils/AxiosInstance";
import {
  FaFileAlt,
  FaCheck,
  FaTimes,
  FaArrowLeft,
  FaDownload,
  FaEye,
} from "react-icons/fa";

const HotelApprovalPage = () => {
  const [pendingHotels, setPendingHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [isDetailView, setIsDetailView] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [adminComment, setAdminComment] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showDocumentPreviewModal, setShowDocumentPreviewModal] =
    useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const navigate = useNavigate();

  // Document title mapping
  const documentTitles = {
    businessRegistration: "Thủ tục đăng ký kinh doanh khách sạn",
    fireProtection: "Giấy phép đủ điều kiện Phòng cháy chữa cháy",
    securityCertificate: "Giấy chứng nhận an ninh trật tự",
    foodSafety: "Giấy chứng nhận cơ sở đủ điều kiện vệ sinh an toàn thực phẩm",
    environmentalProtection: "Giấy phép cam kết bảo vệ môi trường",
    hotelRating: "Đăng ký xếp hạng sao / Quyết định công nhận hạng tiêu chuẩn",
  };

  useEffect(() => {
    fetchPendingHotels(currentPage);
  }, [currentPage]);

  const fetchPendingHotels = async (page) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `/hotel-approval/pending?page=${page}&limit=10`
      );
      setPendingHotels(response.data.data.hotels);
      setTotalPages(response.data.data.pages);
      setLoading(false);
    } catch (err) {
      setError("Failed to load pending hotels");
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleViewHotelDetails = async (hotelId) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/hotel-approval/${hotelId}`);
      setSelectedHotel(response.data.data.hotel);
      setIsDetailView(true);
      setLoading(false);
    } catch (err) {
      setError("Failed to load hotel details");
      setLoading(false);
    }
  };

  const handleDocumentPreview = (doc) => {
    setSelectedDocument(doc);
    setShowDocumentPreviewModal(true);
  };

  const handleDocumentDownload = async (url, title, hotelName, hotelId) => {
    if (!url) {
      setError("Document URL is missing or invalid");
      return;
    }

    try {
      // Fetch the document
      const response = await fetch(url, { method: "GET" });

      if (!response.ok) {
        setError("Unable to download document");
        return;
      }

      // Get the blob
      const blob = await response.blob();

      // Improved sanitization function for Vietnamese characters
      const sanitizeFilename = (name) => {
        if (!name) return "unknown";

        // Remove diacritical marks
        const removeDiacritics = (str) => {
          return str
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/đ/g, "d")
            .replace(/Đ/g, "D");
        };

        // Convert to lowercase and remove special characters
        let sanitized = removeDiacritics(name)
          .toLowerCase()
          .replace(/[^a-z0-9]/gi, "_")
          .replace(/_+/g, "_")
          .trim();

        // Ensure the string is not empty
        return sanitized || "unknown";
      };

      // Construct filename with hotel details and document title
      const sanitizedHotelName = sanitizeFilename(hotelName);
      const sanitizedDocumentTitle = sanitizeFilename(
        documentTitles[title] || title || "document"
      );

      const filename = `${sanitizedHotelName}_${hotelId}_${sanitizedDocumentTitle}${getFileExtension(
        url
      )}`;

      // Create a link and trigger download
      const downloadLink = document.createElement("a");
      downloadLink.href = window.URL.createObjectURL(blob);
      downloadLink.download = filename;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } catch (error) {
      setError("Download failed: " + error.message);
      console.error("Download error:", error);
    }
  };

  // Existing getFileExtension function
  const getFileExtension = (url) => {
    const extension = url.split(".").pop().toLowerCase();
    return extension ? `.${extension}` : ".pdf";
  };

  const handleApproveHotel = async () => {
    try {
      setIsProcessing(true);
      await axiosInstance.post("/hotel-approval/process", {
        hotelId: selectedHotel._id,
        isApproved: true,
        adminComment: adminComment.trim() || undefined,
      });
      setIsProcessing(false);
      setSuccessMessage("Hotel approved successfully");

      // Reset and go back to list after 2 seconds
      setTimeout(() => {
        setIsDetailView(false);
        setSelectedHotel(null);
        setSuccessMessage("");
        fetchPendingHotels(currentPage);
      }, 2000);
    } catch (err) {
      setIsProcessing(false);
      setError(err.response?.data?.message || "Failed to approve hotel");
    }
  };

  const handleRejectHotel = async () => {
    if (!rejectionReason.trim()) {
      setError("Rejection reason is required");
      return;
    }

    try {
      setIsProcessing(true);
      await axiosInstance.post("/hotel-approval/process", {
        hotelId: selectedHotel._id,
        isApproved: false,
        adminComment: rejectionReason,
      });

      setShowRejectModal(false);
      setIsProcessing(false);
      setSuccessMessage("Hotel rejected successfully");

      // Reset and go back to list after 2 seconds
      setTimeout(() => {
        setIsDetailView(false);
        setSelectedHotel(null);
        setRejectionReason("");
        setSuccessMessage("");
        fetchPendingHotels(currentPage);
      }, 2000);
    } catch (err) {
      setIsProcessing(false);
      setError(err.response?.data?.message || "Failed to reject hotel");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const goBack = () => {
    setIsDetailView(false);
    setSelectedHotel(null);
    setError(null);
    setSuccessMessage("");
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "70vh" }}
      >
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  const documentOrder = [
    "businessRegistration",
    "fireProtection",
    "securityCertificate",
    "foodSafety",
    "environmentalProtection",
    "hotelRating",
  ];

  const sortedDocuments =
    selectedHotel?.businessDocuments?.length > 0
      ? [...selectedHotel.businessDocuments].sort((a, b) => {
          return (
            documentOrder.indexOf(a.title) - documentOrder.indexOf(b.title)
          );
        })
      : [];

  return (
    <div className="container-fluid p-4">
      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}

      {successMessage && (
        <Alert
          variant="success"
          onClose={() => setSuccessMessage("")}
          dismissible
        >
          {successMessage}
        </Alert>
      )}

      {!isDetailView ? (
        <Card className="shadow-sm border-0">
          <Card.Header className="bg-white py-3">
            <h4 className="mb-0 fw-bold">Phê Duyệt Khách Sạn</h4>
          </Card.Header>
          <Card.Body>
            {pendingHotels.length === 0 ? (
              <div className="text-center py-5">
                <p className="text-muted mb-0">
                  Không có khách sạn cần phê duyệt
                </p>
              </div>
            ) : (
              <>
                <Table responsive hover className="align-middle">
                  <thead>
                    <tr>
                      <th>STT</th>
                      <th>Tên Khách Sạn</th>
                      <th>Chủ Sở Hữu</th>
                      <th>Địa Chỉ</th>
                      <th>Ngày Đăng Ký</th>
                      <th>Tài Liệu</th>
                      <th>Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingHotels.map((hotel, index) => (
                      <tr key={hotel._id}>
                        <td>{(currentPage - 1) * 10 + index + 1}</td>
                        <td>{hotel.hotelName}</td>
                        <td>
                          <div>{hotel.owner.name}</div>
                          <div className="text-muted small">
                            {hotel.owner.email}
                          </div>
                        </td>
                        <td className="text-wrap" style={{ maxWidth: "250px" }}>
                          {hotel.address}
                        </td>
                        <td>{formatDate(hotel.requestDate)}</td>
                        <td>
                          <Badge bg="info">
                            {hotel.businessDocuments?.length || 0} tài liệu
                          </Badge>
                        </td>
                        <td>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => handleViewHotelDetails(hotel._id)}
                          >
                            Xem Chi Tiết
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <Button
                    variant="outline-primary"
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    Previous
                  </Button>
                  <span>
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline-primary"
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    Next
                  </Button>
                </div>
              </>
            )}
          </Card.Body>
        </Card>
      ) : (
        // Detail view
        <div>
          <Button variant="link" className="mb-3 ps-0" onClick={goBack}>
            <FaArrowLeft className="me-2" /> Quay lại danh sách
          </Button>

          <Row>
            <Col lg={8}>
              <Card className="shadow-sm border-0 mb-4">
                <Card.Header className="bg-white py-3 d-flex justify-content-between align-items-center">
                  <h4 className="mb-0 fw-bold">Thông Tin Khách Sạn</h4>
                  <Badge bg="warning" className="px-3 py-2">
                    Chờ Phê Duyệt
                  </Badge>
                </Card.Header>
                <Card.Body>
                  <Row className="mb-4">
                    <Col md={6}>
                      <p className="mb-1 text-muted">Tên Khách Sạn</p>
                      <h5>{selectedHotel?.hotelName}</h5>
                    </Col>
                    <Col md={6}>
                      <p className="mb-1 text-muted">Ngày Đăng Ký</p>
                      <h5>{formatDate(selectedHotel?.requestDate)}</h5>
                    </Col>
                  </Row>

                  <p className="mb-1 text-muted">Mô Tả</p>
                  <p className="mb-4">{selectedHotel?.description}</p>

                  <p className="mb-1 text-muted">Địa Chỉ</p>
                  <p className="mb-4">{selectedHotel?.address}</p>

                  <h5 className="mb-3">Tiện Nghi</h5>
                  <Row className="mb-4">
                    {selectedHotel?.facilities?.map((facility) => (
                      <Col key={facility._id} xs={6} md={4} className="mb-2">
                        <Badge
                          bg="light"
                          text="dark"
                          className="px-3 py-2 w-100 text-start"
                        >
                          {facility.name}
                        </Badge>
                      </Col>
                    ))}
                  </Row>

                  <h5 className="mb-3">Dịch Vụ</h5>
                  <Row className="mb-4">
                    {selectedHotel?.services?.map((service) => (
                      <Col key={service._id} xs={6} md={4} className="mb-2">
                        <Badge
                          bg="light"
                          text="dark"
                          className="px-3 py-2 w-100 text-start"
                        >
                          {service.name}
                        </Badge>
                      </Col>
                    ))}
                  </Row>
                </Card.Body>
              </Card>

              <Card className="shadow-sm border-0 mb-4">
                <Card.Header className="bg-white py-3">
                  <h4 className="mb-0 fw-bold">Tài Liệu Kinh Doanh</h4>
                </Card.Header>
                <Card.Body>
                  {sortedDocuments.length > 0 ? (
                    <div className="d-flex flex-wrap gap-3">
                      {sortedDocuments.map((doc, index) => (
                        <div
                          key={doc._id || index}
                          className="text-center"
                          style={{ cursor: "pointer" }}
                        >
                          <div
                            className="mb-2 p-3 bg-light rounded d-flex flex-column align-items-center justify-content-center"
                            style={{ width: "180px", height: "180px" }}
                          >
                            <FaFileAlt
                              size={48}
                              className="text-primary mb-2"
                            />
                            <div className="d-flex justify-content-center gap-2">
                              <FaDownload
                                size={16}
                                className="text-secondary"
                                onClick={() =>
                                  handleDocumentDownload(
                                    doc.url,
                                    doc.title,
                                    selectedHotel.hotelName,
                                    selectedHotel._id
                                  )
                                }
                              />
                              <FaEye
                                size={16}
                                className="text-info"
                                onClick={() => handleDocumentPreview(doc)}
                              />
                            </div>
                          </div>
                          <p className="small mb-0" style={{ width: "180px" }}>
                            {documentTitles[doc.title] ||
                              `Tài liệu ${index + 1}`}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted">
                      Không có tài liệu được đính kèm
                    </p>
                  )}
                </Card.Body>
              </Card>
            </Col>

            <Col lg={4}>
              <Card className="shadow-sm border-0 mb-4">
                <Card.Header className="bg-white py-3">
                  <h4 className="mb-0 fw-bold">Thông Tin Chủ Sở Hữu</h4>
                </Card.Header>
                <Card.Body>
                  <p className="mb-1 text-muted">Tên</p>
                  <h5 className="mb-3">{selectedHotel?.owner?.name}</h5>

                  <p className="mb-1 text-muted">Email</p>
                  <h5 className="mb-3">{selectedHotel?.owner?.email}</h5>

                  <p className="mb-1 text-muted">Số Điện Thoại</p>
                  <h5 className="mb-3">{selectedHotel?.owner?.phoneNumber}</h5>

                  <p className="mb-1 text-muted">Địa Chỉ</p>
                  <h5>{selectedHotel?.owner?.address}</h5>
                </Card.Body>
              </Card>

              <Card className="shadow-sm border-0">
                <Card.Header className="bg-white py-3">
                  <h4 className="mb-0 fw-bold">Quyết Định</h4>
                </Card.Header>
                <Card.Body>
                  <Form.Group className="mb-4">
                    <Form.Label>Ghi chú (tùy chọn)</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Nhập ghi chú cho chủ khách sạn..."
                      value={adminComment}
                      onChange={(e) => setAdminComment(e.target.value)}
                    />
                    <Form.Text className="text-muted">
                      Ghi chú sẽ được gửi qua email cho chủ khách sạn
                    </Form.Text>
                  </Form.Group>

                  <div className="d-grid gap-2">
                    <Button
                      variant="success"
                      className="py-2"
                      disabled={isProcessing}
                      onClick={handleApproveHotel}
                    >
                      {isProcessing ? (
                        <Spinner
                          animation="border"
                          size="sm"
                          className="me-2"
                        />
                      ) : (
                        <FaCheck className="me-2" />
                      )}
                      Phê Duyệt Khách Sạn
                    </Button>
                    <Button
                      variant="danger"
                      className="py-2"
                      disabled={isProcessing}
                      onClick={() => setShowRejectModal(true)}
                    >
                      <FaTimes className="me-2" />
                      Từ Chối Khách Sạn
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>
      )}

      {/* Document Preview Modal */}
      <Modal
        show={showDocumentPreviewModal}
        onHide={() => setShowDocumentPreviewModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {documentTitles[selectedDocument?.title] || "Document Preview"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedDocument && (
            <div className="text-center">
              <img
                src={selectedDocument.url}
                alt="Document Preview"
                style={{
                  maxWidth: "100%",
                  maxHeight: "70vh",
                  objectFit: "contain",
                }}
              />
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={() =>
              handleDocumentDownload(
                selectedDocument.url,
                selectedDocument.title,
                selectedHotel.hotelName,
                selectedHotel._id
              )
            }
          >
            <FaDownload className="me-2" /> Download
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Rejection Modal */}
      <Modal
        show={showRejectModal}
        onHide={() => setShowRejectModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Từ Chối Khách Sạn</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>
              Lý Do Từ Chối <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Vui lòng cung cấp lý do từ chối cho chủ khách sạn..."
            />
            <Form.Text className="text-muted">
              Lý do từ chối sẽ được gửi qua email cho chủ khách sạn
            </Form.Text>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRejectModal(false)}>
            Hủy
          </Button>
          <Button
            variant="danger"
            onClick={handleRejectHotel}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <Spinner animation="border" size="sm" className="me-2" />
            ) : (
              <FaTimes className="me-2" />
            )}
            Xác Nhận Từ Chối
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default HotelApprovalPage;
