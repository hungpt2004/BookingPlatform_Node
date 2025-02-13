import { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import PropTypes from "prop-types";
import axiosInstance from '../utils/AxiosInstance';
import { toast } from 'react-toastify';

export default function FeedbackModal({ show, onClose, reservationId, onFeedbackSubmitted }) {
    const [content, setContent] = useState("");
    const [rating, setRating] = useState(5);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim()) {
            toast.error("Please enter your feedback");
            return;
        }
        setIsSubmitting(true);

        try {
            await axiosInstance.post(`/feedback/create/${reservationId}`, {
                content: content.trim(),
                rating: Number(rating),
            });
            toast.success("Feedback submitted successfully!");
            // Reset form values
            setContent("");
            setRating(5);
            onFeedbackSubmitted();
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to submit feedback");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Reset form when modal is opened
    const handleShow = () => {
        setContent("");
        setRating(5);
    };

    return (
        <Modal show={show} onHide={onClose} onShow={handleShow}>
            <Form onSubmit={handleSubmit}>
                <Modal.Header closeButton>
                    <Modal.Title>Leave Feedback</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Rating</Form.Label>
                        <div className="d-flex gap-3 mb-3">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Button
                                    key={star}
                                    variant={rating >= star ? "warning" : "light"}
                                    onClick={() => setRating(star)}
                                    className="px-3"
                                >
                                    ★
                                </Button>
                            ))}
                        </div>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Your Feedback</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Tell us about your experience..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button variant="primary" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Processing..." : "Submit Feedback"}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}

FeedbackModal.propTypes = {
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    reservationId: PropTypes.string.isRequired,
    onFeedbackSubmitted: PropTypes.func.isRequired,
};