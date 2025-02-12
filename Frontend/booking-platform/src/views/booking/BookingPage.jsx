import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import useFetch from "../../../hooks/useFetch";
import { Modal, Button, Form, Spinner, ListGroup, Alert } from "react-bootstrap";

const Booking = ({ setOpen, hotelId, checkInDate, checkOutDate, userId }) => {
    const [selectedRooms, setSelectedRooms] = useState([]);
    const { data, loading, error } = useFetch(`http://localhost:8080/room/get-room-by-hotel/${hotelId}`);
    const navigate = useNavigate();

    const toggleRoomSelection = (roomId) => {
        setSelectedRooms((prev) =>
            prev.includes(roomId)
                ? prev.filter((id) => id !== roomId)
                : [...prev, roomId]
        );
    };

    const handleConfirmBooking = async () => {
        try {
            const response = await fetch("http://localhost:8080/user/booking", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId,
                    hotelId,
                    roomId: selectedRooms,
                    checkInDate,
                    checkOutDate,
                }),
            });

            const result = await response.json();
            if (!result.error) {
                alert("Booking successful!");
                setOpen(false);
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error("Error during booking:", error);
            alert("An error occurred while booking.");
        }
    };

    // Increment the quantity for a specific room, not exceeding the max available
    const incrementRoomQuantity = (roomId, maxQuantity) => {
        setSelectedRooms((prev) => {
            const currentQuantity = prev[roomId] || 0;
            if (currentQuantity < maxQuantity) {
                return { ...prev, [roomId]: currentQuantity + 1 };
            }
            return prev;
        });
    };

    // Decrement the quantity for a specific room and remove the key when it reaches zero
    const decrementRoomQuantity = (roomId) => {
        setSelectedRooms((prev) => {
            const currentQuantity = prev[roomId] || 0;
            if (currentQuantity > 0) {
                const newQuantity = currentQuantity - 1;
                if (newQuantity === 0) {
                    // Remove the room from selectedRooms when quantity is 0
                    const { [roomId]: removed, ...rest } = prev;
                    return rest;
                }
                return { ...prev, [roomId]: newQuantity };
            }
            return prev;
        });
    };

    // Prepare booking data and navigate to the next step
    const handleContinueBooking = () => {
        if (Object.keys(selectedRooms).length === 0) return; // No room selected


        const bookingData = {
            userId,
            hotelId,
            roomQuantities: selectedRooms, // Object with roomId as key and quantity as value
            checkInDate,
            checkOutDate,
        };
        console.log("bookingData", bookingData);

        navigate('/booking-step2', { state: bookingData });
    };

    return (
        <Modal show={true} onHide={() => setOpen(false)} centered>
            <Modal.Header closeButton>
                <Modal.Title>Select Rooms</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {loading && (
                    <div className="text-center">
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    </div>
                )}

                {error && (
                    <Alert variant="danger" className="text-center">
                        {error}
                    </Alert>
                )}

                {!loading && !error && (
                    <ListGroup>
                        {data?.rooms?.map((room) => (
                            <ListGroup.Item key={room._id} className="mb-2">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <h6 className="mb-1">{room.type}</h6>
                                        <small className="text-muted">
                                            ${room.price}/night · Sleeps {room.capacity} · Available Room: {room.quantity}
                                        </small>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            onClick={() => decrementRoomQuantity(room._id)}
                                            disabled={!(selectedRooms[room._id] > 0)}
                                        >
                                            –
                                        </Button>
                                        <span className="mx-2">{selectedRooms[room._id] || 0}</span>
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            onClick={() => incrementRoomQuantity(room._id, room.quantity)}
                                            disabled={(selectedRooms[room._id] || 0) >= room.quantity}
                                        >
                                            +
                                        </Button>
                                    </div>
                                </div>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setOpen(false)}>
                    Cancel
                </Button>
                <Button
                    variant="primary"
                    onClick={handleContinueBooking}
                    disabled={Object.keys(selectedRooms).length === 0}
                >
                    Continue
                </Button>
            </Modal.Footer>
        </Modal>
    );
};


export default Booking;