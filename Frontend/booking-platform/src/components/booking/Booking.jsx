import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Spinner, Alert, Table } from "react-bootstrap";
import axiosInstance from "../../utils/AxiosInstance";

const Booking = ({ setOpen, hotelId, checkInDate, checkOutDate, userId }) => {
    const [selectedRooms, setSelectedRooms] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [rooms, setRooms] = useState([]);
    const navigate = useNavigate();

    // Fetch rooms using axiosInstance
    const fetchRooms = async () => {
        try {
            const response = await axiosInstance.get(`/room/get-room-by-hotel/${hotelId}`);
            setRooms(response.data.rooms);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch rooms");
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchRooms();
    }, [hotelId]);

    const incrementRoomQuantity = (roomId, maxQuantity) => {
        setSelectedRooms(prev => ({
            ...prev,
            [roomId]: Math.min((prev[roomId] || 0) + 1, maxQuantity)
        }));
    };

    const decrementRoomQuantity = (roomId) => {
        setSelectedRooms(prev => {
            const current = prev[roomId] || 0;
            if (current <= 0) return prev;
            const newCount = current - 1;
            if (newCount === 0) {
                const { [roomId]: _, ...rest } = prev;
                return rest;
            }
            return { ...prev, [roomId]: newCount };
        });
    };

    const handleContinueBooking = async () => {
        if (Object.keys(selectedRooms).length === 0) return;

        const bookingData = {
            userId,
            hotelId,
            roomQuantities: selectedRooms,
            checkInDate,
            checkOutDate,
        };

        navigate('/booking-step2', { state: bookingData });
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Select Rooms</h2>
                <Button variant="secondary" onClick={() => setOpen(false)}>
                    Close
                </Button>
            </div>

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
                <div className="table-responsive">
                    <Table striped bordered hover className="align-middle">
                        <thead>
                            <tr>
                                <th>Room Type</th>
                                <th>Price/Night</th>
                                <th>Capacity</th>
                                <th>Available Rooms</th>
                                <th>Quantity</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rooms.map(room => (
                                <tr key={room._id}>
                                    <td>{room.type}</td>
                                    <td>${room.price}</td>
                                    <td>{room.capacity}</td>
                                    <td>{room.quantity}</td>
                                    <td>
                                        <div className="d-flex align-items-center justify-content-center">
                                            <Button
                                                variant="outline-secondary"
                                                size="sm"
                                                onClick={() => decrementRoomQuantity(room._id)}
                                                disabled={!(selectedRooms[room._id] > 0)}
                                            >
                                                -
                                            </Button>
                                            <span className="mx-2">{selectedRooms[room._id] || 0}</span>
                                            <Button
                                                variant="outline-secondary"
                                                size="sm"
                                                onClick={() => incrementRoomQuantity(room._id, room.quantity)}
                                                disabled={(selectedRooms[room._id] || 0) >= room.quantity}
                                            >
                                                +
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            )}

            <div className="d-flex justify-content-end mt-4">
                <Button
                    variant="primary"
                    onClick={handleContinueBooking}
                    disabled={Object.keys(selectedRooms).length === 0}
                    size="lg"
                >
                    Continue to Payment
                </Button>
            </div>
        </div>
    );
};

export default Booking;