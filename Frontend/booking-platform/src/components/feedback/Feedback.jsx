import { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import PropTypes from "prop-types";
import axiosInstance from '../utils/AxiosInstance';
import { toast } from 'react-toastify';


export default function FeedbackModal({ show, onClose, reservationId,getHotel }) {
    const [content, setContent] = useState("");
    const [rating, setRating] = useState(5);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Sending Feedback for:", reservationId);
        if (!content.trim()) {
            toast.error("Please enter your feedback");
            return;
        }
        if (!reservationId) {
            toast.error("Reservation ID is missing!");
            return;
        }
        setIsSubmitting(true);
        try {
            const response = await axiosInstance.post(`/feedback/create/${reservationId}`, {
                content: content.trim(),
                rating: Number(rating),
                hotel: getHotel
            });
            console.log('Response:', response.data); // Debug response
            if (response.data) {
                toast.success("Feedback submitted successfully!");
                setContent("");
                setRating(5);
                onClose();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to submit feedback");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal show={show} onHide={onClose}>
            <Form onSubmit={handleSubmit}>
                <Modal.Header closeButton>
                    <Modal.Title>Hotel Feedback</Modal.Title>
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
                    <Button
                        variant="primary"
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Submitting..." : "Submit Feedback"}
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
    getHotel: PropTypes.string.isRequired,
};