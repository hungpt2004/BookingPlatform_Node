import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Card, Button, ListGroup, Badge } from "react-bootstrap";
import axiosInstance from "../../utils/AxiosInstance";
import { formatCurrencyVND } from "../../utils/FormatPricePrint";
import { formatDate } from "../../utils/FormatDatePrint";

const BookingStepTwo = () => {
    const { state: bookingData } = useLocation();
    const navigate = useNavigate();
    const [currentHotel, setCurrentHotel] = useState({})
    const [item, setItem] = useState([]);


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
        userId,
        hotelId,
        totalRooms, //Tổng số phòng
        checkInDate,
        checkOutDate,
        totalPrice,
        roomDetails,
        roomIds
    } = bookingData;

    console.log(`Debug Selected Room: ${totalRooms}`)

    const payment = async () => {
        try {
            const response = await axiosInstance.post('/payment/create-payment-link', {
                amount: totalPrice,
                rooms: roomDetails,
                hotelId: hotelId,
                roomIds: roomIds
            });
    
            // Redirect in frontend
            window.location.href = response.data.checkoutUrl;
        } catch (error) {
            console.error("Payment error:", error);
        }
    };
    
    return (
        <Container className="mt-5">
            <Card className="shadow">
                <Card.Header as="h5" className="bg-primary text-white">
                    Booking Summary
                </Card.Header>
                <Card.Body>
                    <ListGroup variant="flush">
                        {/* User and Hotel Details */}
                        <ListGroup.Item>
                            <strong>User ID: </strong> {userId}
                        </ListGroup.Item>
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
                                                <strong>{room.roomId} - {room.roomType}</strong>
                                                <br />
                                                <small className="text-muted">
                                                    Quantity: {room.quantity} | Price per room: {formatCurrencyVND(room.pricePerRoom)}
                                                </small>
                                            </div>
                                            <Badge bg="" className="fs-6 text-dark">
                                                {formatCurrencyVND(room.totalPrice)}
                                            </Badge>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </ListGroup.Item>

                        {/* Dates */}
                        <ListGroup.Item>
                            <strong>Check-in Date:</strong>{" "}
                            {formatDate(new Date(checkInDate))}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <strong>Check-out Date:</strong>{" "}
                            {formatDate(new Date(checkOutDate))}
                        </ListGroup.Item>

                        {/* Total Price */}
                        <ListGroup.Item className="d-flex justify-content-between align-items-center">
                            <strong>Total Price:</strong>
                            <Badge bg="success" className="fs-5 p-2">
                                {formatCurrencyVND(totalPrice)}
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
                            onClick={() => payment()}
                        >
                            Payment
                        </Button>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default BookingStepTwo;