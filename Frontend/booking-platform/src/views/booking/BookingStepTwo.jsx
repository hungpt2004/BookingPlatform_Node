import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Card, Button, ListGroup, Badge } from "react-bootstrap";

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

    const {
        hotelId,
        checkInDate,
        checkOutDate,
        totalPrice,
        roomDetails,
    } = bookingData;

    return (
        <Container className="mt-5">
            <Card className="shadow">
                <Card.Header as="h5" className="bg-primary text-white">
                    Booking Summary
                </Card.Header>
                <Card.Body>
                    <ListGroup variant="flush">
                        {/* Hotel Details */}
                        <ListGroup.Item>
                            <strong>Hotel ID:</strong> {hotelId}
                        </ListGroup.Item>

                        {/* Room Details */}
                        <ListGroup.Item>
                            <strong>Selected Rooms:</strong>
                            <ul className="list-unstyled mb-0 mt-2">
                                {roomDetails.map((room, index) => (
                                    <li key={index} className="mb-2">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <strong>{room.roomType}</strong>
                                                <br />
                                                <small className="text-muted">
                                                    Quantity: {room.quantity} | Price per room: ${room.pricePerRoom}
                                                </small>
                                            </div>
                                            <Badge bg="info" className="fs-6">
                                                ${room.totalPrice}
                                            </Badge>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </ListGroup.Item>

                        {/* Dates */}
                        <ListGroup.Item>
                            <strong>Check-in Date:</strong>{" "}
                            {new Date(checkInDate).toLocaleDateString()}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <strong>Check-out Date:</strong>{" "}
                            {new Date(checkOutDate).toLocaleDateString()}
                        </ListGroup.Item>

                        {/* Total Price */}
                        <ListGroup.Item className="d-flex justify-content-between align-items-center">
                            <strong>Total Price:</strong>
                            <Badge bg="success" className="fs-5 p-2">
                                ${totalPrice.toLocaleString()}
                            </Badge>
                        </ListGroup.Item>
                    </ListGroup>

                    {/* Action Buttons */}
                    <div className="mt-4 d-flex justify-content-between">
                        <Button variant="secondary" onClick={() => navigate(-1)}>
                            Back
                        </Button>
                        <Button
                            variant="success"
                            onClick={() => navigate("/payment", { state: bookingData })}
                        >
                            Proceed to Payment
                        </Button>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default BookingStepTwo;