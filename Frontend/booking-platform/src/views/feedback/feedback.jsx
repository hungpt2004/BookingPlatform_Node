import { useEffect, useState } from "react";
import axiosInstance from "../../utils/AxiosInstance";
import { Table, Button, Form, Modal } from "react-bootstrap";
import CustomNavbar from "../../components/navbar/CustomNavbar";
import ReactPaginate from "react-paginate";
import { HashLoader } from "react-spinners";
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
            await axiosInstance.patch(`/feedback/update-feedback/${editingFeedback._id}`, formData);
            fetchFeedbacks();
            setShowModal(false);
        } catch (error) {
            console.error("Error updating feedback:", error);
        }
    };

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    return (
        <>
            <CustomNavbar />
            <div className="container mt-4">
                <h2>User Feedbacks</h2>
                {/* Phân trang */}
                {pageCount > 1 && (
                    <div className="d-flex justify-content-center mt-3">
                        <ReactPaginate
                            previousLabel={"«"}
                            nextLabel={"»"}
                            breakLabel={"..."}
                            pageCount={pageCount}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={3}
                            onPageChange={({ selected }) => setCurrentPage(selected)}
                            containerClassName={"pagination"}
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
                    </div>
                )}

                <div className="justify-content-center align-items-center d-flex">
                    {loading ? (
                        <HashLoader className="mt-5" size={50} color="#6499E9" />
                    ) : (
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Hotel</th>
                                    <th>Content</th>
                                    <th>Rating</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentFeedbacks.length > 0 ? (
                                    currentFeedbacks.map((feedback) => (
                                        <tr key={feedback._id}>
                                            <td>{feedback.hotel.hotelName}</td>
                                            <td>{feedback.content}</td>
                                            <td>{feedback.rating}</td>
                                            <td>
                                                <Button variant="warning" className="me-2" onClick={() => handleEdit(feedback)}>
                                                    Edit
                                                </Button>
                                                <Button variant="danger" onClick={() => handleDelete(feedback._id)}>
                                                    Delete
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="text-center">
                                            <p className="alert alert-warning">No feedback available</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    )}
                </div>

                {/* Modal chỉnh sửa feedback */}
                <Modal show={showModal} onHide={() => setShowModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Feedback</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Content</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Rating</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={formData.rating}
                                    onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={handleSave}>
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </>
    );
};

export default FeedbackPage;
