import { useEffect, useState } from "react";
import axiosInstance from "../../utils/AxiosInstance";
import { Table, Button, Form, Modal } from "react-bootstrap";
import CustomNavbar from "../../components/navbar/CustomNavbar";

const FeedbackPage = () => {
    const [feedbacks, setFeedbacks] = useState([]); // Đảm bảo state luôn là mảng
    const [editingFeedback, setEditingFeedback] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ content: "", rating: "" });

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    const fetchFeedbacks = async () => {
        try {
            const response = await axiosInstance.get("/feedback/get-feedback"); // Cập nhật đúng 
            setFeedbacks(response.data?.feedback); // Đảm bảo dữ liệu luôn là mảng
        } catch (error) {
            console.error("Error fetching feedbacks:", error);
            setFeedbacks([]); // Nếu lỗi xảy ra, đặt feedbacks về mảng rỗng
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
                await axiosInstance.delete(`/feedback/delete/${feedbackId}`);
                fetchFeedbacks();
            } catch (error) {
                console.error("Error deleting feedback:", error);
            }
        }
    };

    const handleSave = async () => {
        if (!editingFeedback) return; // Kiểm tra nếu không có feedback để chỉnh sửa

        try {
            await axiosInstance.patch(`/feedback/update/${editingFeedback._id}`, formData);
            fetchFeedbacks();
            setShowModal(false);
        } catch (error) {
            console.error("Error updating feedback:", error);
        }
    };

    return (
        <>
            <CustomNavbar />
            <div className="container mt-4">
                <h2>User Feedbacks</h2>
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
                        {feedbacks.length > 0 ? (
                            feedbacks.map((feedback, index) => (
                                <tr key={feedback._id}>
                                    <td>{index + 1}</td>
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
                                <td colSpan="4" className="text-center"><p className="alert alert-warning">No feedback available</p></td>
                            </tr>
                        )}
                    </tbody>
                </Table>

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
