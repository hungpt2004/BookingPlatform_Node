import { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import PropTypes from "prop-types";
import { toast } from 'react-toastify';
import { CustomFailedToast, CustomSuccessToast, CustomToast } from '../toast/CustomToast';
import { FaStar } from 'react-icons/fa';
import axiosInstance from '../../utils/AxiosInstance';
import './FeedbackModal.css'

export default function FeedbackModal({ show, onClose, reservationId }) {
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

            // Tạo feedback mới
            await axiosInstance.post(`/feedback/create-feedback/${reservationId}`, {
                content: content.trim(),
                rating: Number(rating),
            });
            CustomSuccessToast("Gửi đánh giá thành công!");

            // Đóng modal và reload trang
            onClose();
            setTimeout(() => window.location.reload(), 500); // Reload sau 0.5 giây để hiển thị toast
        } catch (error) {
            CustomFailedToast(error.response.data.message || "Có lỗi xảy ra!");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <CustomToast />
            <Modal show={show} onHide={onClose} centered className="feedback-modal">
                <Form onSubmit={handleSubmit}>
                    <Modal.Header closeButton className="border-0 pb-0">
                        <Modal.Title className="fw-bold text-primary">Đánh giá trải nghiệm</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="pt-2">
                        <Form.Group className="mb-4">
                            <Form.Label className="fw-medium text-secondary mb-3">Xếp hạng của bạn</Form.Label>
                            <div className="d-flex justify-content-center gap-3 mb-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Button
                                        key={star}
                                        variant="link"
                                        onClick={() => setRating(star)}
                                        className="p-0 m-0 star-button"
                                        aria-label={`${star} sao`}
                                    >
                                        <FaStar
                                            size={28}
                                            color={rating >= star ? "#FFD700" : "#e4e5e9"}
                                            className="star-icon"
                                        />
                                    </Button>
                                ))}
                            </div>
                            <div className="text-center text-muted small">
                                {["Chọn xếp hạng", "Rất không hài lòng", "Không hài lòng", "Bình thường", "Hài lòng", "Rất hài lòng"][rating]}
                            </div>
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label className="fw-medium text-secondary mb-2">Nội dung đánh giá</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={4}
                                placeholder="Chia sẻ cảm nhận của bạn về trải nghiệm..."
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                required
                                className="border-light shadow-sm rounded-3"
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer className="border-0 pt-0">
                        <div className="d-flex justify-content-between w-100">
                            <Button variant="light" onClick={onClose} disabled={isSubmitting} className="px-4 py-2 rounded-pill">
                                Huỷ
                            </Button>
                            <Button variant="primary" type="submit" disabled={isSubmitting || rating === 0} className="px-4 py-2 rounded-pill shadow-sm">
                                {isSubmitting ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Đang xử lý...
                                    </>
                                ) : "Gửi đánh giá"}
                            </Button>
                        </div>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    );
}

FeedbackModal.propTypes = {
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    reservationId: PropTypes.string.isRequired,
};
