import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Card, Button, ListGroup } from "react-bootstrap";

const BookingStepTwo = () => {
    const { state: bookingData } = useLocation();
    const navigate = useNavigate();

    // If no booking data is provided, render a message and a back button.
    if (!bookingData) {
        return (
            <Container className="mt-5 text-center">
                <h3>No booking data found.</h3>
                <Button variant="primary" onClick={() => navigate(-1)}>
                    Go Back
                </Button>
            </Container>
        );
    }

    const { userId, hotelId, roomQuantities, checkInDate, checkOutDate } = bookingData;

    return (
        <Container className="mt-5">
            <Card>
                <Card.Header as="h5">Booking Summary</Card.Header>
                <Card.Body>
                    <ListGroup variant="flush">
                        <ListGroup.Item>
                            <strong>User ID:</strong> {userId}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <strong>Hotel ID:</strong> {hotelId}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <strong>Room Quantities:</strong>
                            <ul className="list-unstyled mb-0">

                                {roomQuantities &&
                                    Object.entries(roomQuantities).map(([roomId, quantity]) => (
                                        <li key={roomId}>
                                            <strong>Room ID:</strong> {roomId} - <strong>Quantity:</strong> {quantity}
                                        </li>
                                    ))}

                            </ul>                        </ListGroup.Item>
                        <ListGroup.Item>
                            <strong>Check-in Date:</strong>{" "}
                            {new Date(checkInDate).toLocaleDateString()}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <strong>Check-out Date:</strong>{" "}
                            {new Date(checkOutDate).toLocaleDateString()}
                        </ListGroup.Item>
                    </ListGroup>
                    <div className="mt-3 d-flex justify-content-between">
                        <Button variant="secondary" onClick={() => navigate(-1)}>
                            Back
                        </Button>
                        <Button variant="success" onClick={() => navigate("/payment", { state: bookingData })}>
                            Proceed to Payment
                        </Button>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default BookingStepTwo;