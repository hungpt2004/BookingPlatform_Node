import { useEffect, useState } from "react";
import axiosInstance from "../../utils/AxiosInstance";
import { Table, Button, Form, Modal, Card, Badge, Container, Row, Col, Spinner } from "react-bootstrap";
import CustomNavbar from "../../components/navbar/CustomNavbar";
import ReactPaginate from "react-paginate";
import { HashLoader } from "react-spinners";
import { FaEdit, FaTrash, FaStar, FaRegStar } from "react-icons/fa";
import "./Feedback.css"; // Thêm file CSS riêng
import { CustomFailedToast, CustomSuccessToast, CustomToast } from "../../components/toast/CustomToast";

const FeedbackPage = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [editingFeedback, setEditingFeedback] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ content: "", rating: "" });
    const [loading, setLoading] = useState(false);
    // Phân trang
    const [currentPage, setCurrentPage] = useState(0);
    const feedbacksPerPage = 8; // Số feedback hiển thị mỗi trang
    const pageCount = Math.ceil(feedbacks.length / feedbacksPerPage);
    const offset = currentPage * feedbacksPerPage;
    const currentFeedbacks = feedbacks.slice(offset, offset + feedbacksPerPage);

    const fetchFeedbacks = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get("/feedback/get");
            setFeedbacks(response.data?.feedback);
        } catch (error) {
            console.error("Error fetching feedbacks:", error);
            setFeedbacks([]);
        }
        finally {
            setTimeout(() => {
                setLoading(false);
            }, 1000);
        }
    };

    const handleEdit = (feedback) => {
        setEditingFeedback(feedback);
        setFormData({ content: feedback.content, rating: feedback.rating });
        setShowModal(true);
    };

    const handleDelete = async (feedbackId) => {
        if (window.confirm("Are you sure you want to delete this feedback?")) {
            try {
                await axiosInstance.delete(`/feedback/delete-feedback/${feedbackId}`);
                fetchFeedbacks();
            } catch (error) {
                console.error("Error deleting feedback:", error);
            }
        }
    };

    const handleSave = async () => {
        if (!editingFeedback) return;
        try {
            const response = await axiosInstance.patch(`/feedback/update-feedback/${editingFeedback._id}`, formData);
            if(response.data && response.status === 200) {
                fetchFeedbacks();
                setShowModal(false);
                CustomSuccessToast("Update feedback success")
            }
        } catch (error) {
            console.error("Error updating feedback:", error);
            CustomFailedToast(error.response.data.message);
        }
    };

    // Hàm tạo rating stars
    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                i <= rating ? 
                    <FaStar key={i} className="star-icon filled" /> : 
                    <FaRegStar key={i} className="star-icon empty" />
            );
        }
        return stars;
    };

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    return (
        <>
            <CustomNavbar />
            <br></br>
            <br></br>
            <br></br>
            <CustomToast/>
            <Container className="mt-5 mb-5">
                <Card className="feedback-card">
                    <Card.Header className="feedback-header">
                        <h2>
                            <span className="feedback-title">User Feedbacks</span>
                            <Badge bg="info" className="ms-2">{feedbacks.length}</Badge>
                        </h2>
                    </Card.Header>
                    <Card.Body>
                        {loading ? (
                            <div className="d-flex flex-column justify-content-center align-items-center">
                                <Spinner size="30" style={{color: '#003b95'}}/>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <Table hover className="feedback-table">
                                    <thead>
                                        <tr>
                                            <th className="hotel-column">Hotel</th>
                                            <th className="content-column">Content</th>
                                            <th className="rating-column">Rating</th>
                                            <th className="actions-column">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentFeedbacks.length > 0 ? (
                                            currentFeedbacks.map((feedback) => (
                                                <tr key={feedback._id}>
                                                    <td className="hotel-name">{feedback.hotel.hotelName}</td>
                                                    <td className="feedback-content">{feedback.content}</td>
                                                    <td className="rating-stars">
                                                        <div className="d-flex">
                                                            {renderStars(feedback.rating)}
                                                            <span className="rating-number ms-2">({feedback.rating})</span>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="action-buttons">
                                                            <Button 
                                                                variant="outline-warning" 
                                                                className="btn-action edit-btn"
                                                                onClick={() => handleEdit(feedback)}
                                                            >
                                                                <FaEdit /> Edit
                                                            </Button>
                                                            <Button 
                                                                variant="outline-danger" 
                                                                className="btn-action delete-btn"
                                                                onClick={() => handleDelete(feedback._id)}
                                                            >
                                                                <FaTrash /> Delete
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="text-center py-4">
                                                    <div className="no-feedback-message">
                                                        <p>No feedback available</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </div>
                        )}

                        {/* Phân trang */}
                        {pageCount > 1 && (
                            <Row className="mt-4">
                                <Col className="d-flex justify-content-center">
                                    <ReactPaginate
                                        previousLabel={"«"}
                                        nextLabel={"»"}
                                        breakLabel={"..."}
                                        pageCount={pageCount}
                                        marginPagesDisplayed={2}
                                        pageRangeDisplayed={3}
                                        onPageChange={({ selected }) => setCurrentPage(selected)}
                                        containerClassName={"pagination custom-pagination"}
                                        pageClassName={"page-item"}
                                        pageLinkClassName={"page-link"}
                                        previousClassName={"page-item"}
                                        previousLinkClassName={"page-link"}
                                        nextClassName={"page-item"}
                                        nextLinkClassName={"page-link"}
                                        breakClassName={"page-item"}
                                        breakLinkClassName={"page-link"}
                                        activeClassName={"active"}
                                    />
                                </Col>
                            </Row>
                        )}
                    </Card.Body>
                </Card>

                {/* Modal chỉnh sửa feedback */}
                <Modal 
                    show={showModal} 
                    onHide={() => setShowModal(false)}
                    centered
                    className="feedback-modal"
                >
                    <Modal.Header closeButton className="modal-header">
                        <Modal.Title>
                            <FaEdit className="me-2" />
                            Edit Feedback
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Hotel</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={editingFeedback?.hotel?.hotelName || ""}
                                    disabled
                                    className="hotel-input"
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Content</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={4}
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    className="content-input"
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Rating (1-5)</Form.Label>
                                <div className="rating-input-group">
                                    <Form.Control
                                        type="number"
                                        min="1"
                                        max="5"
                                        value={formData.rating}
                                        onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                                        className="rating-input"
                                    />
                                    <div className="d-flex ms-3">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <span 
                                                key={star}
                                                onClick={() => setFormData({ ...formData, rating: star })}
                                                className="star-selector"
                                            >
                                                {star <= formData.rating ? 
                                                    <FaStar className="star-icon filled" /> : 
                                                    <FaRegStar className="star-icon empty" />
                                                }
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="outline-secondary" onClick={() => setShowModal(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" className="save-btn" onClick={handleSave}>
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        </>
    );
};

export default FeedbackPage;