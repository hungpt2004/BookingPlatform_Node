import { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';

const DeleteHotelModal = ({ show, onHide, hotel = {}, onConfirm }) => {
    const [inputName, setInputName] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = () => {
        if (inputName !== hotel?.hotelName) {
            setError('Hotel name does not match');
            return;
        }
        onConfirm();
        onHide();
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Confirm Hotel Deletion</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Type the hotel name to confirm deletion ({hotel?.hotelName}):</p>
                <Form.Control
                    type="text"
                    value={inputName}
                    onChange={(e) => {
                        setInputName(e.target.value);
                        setError('');
                    }}
                    placeholder="Enter hotel name"
                />
                {error && <Alert variant="danger" className="mt-2">{error}</Alert>}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>Cancel</Button>
                <Button
                    variant="danger"
                    onClick={handleSubmit}
                    disabled={inputName !== hotel?.hotelName}
                >
                    Confirm Delete
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default DeleteHotelModal;