import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Spinner, Alert, Table, Badge } from "react-bootstrap";
import axiosInstance from "../../utils/AxiosInstance";

const Booking = ({
    setOpen,
    hotelId,
    checkInDate,
    checkOutDate,
    numberOfPeople,
    userId,
}) => {
    const [selectedRooms, setSelectedRooms] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [rooms, setRooms] = useState([]);
    const navigate = useNavigate();

    const fetchRooms = async () => {
        try {
            const response = await axiosInstance.get(`/room/get-room-by-hotel/${hotelId}`, {
                params: {
                    checkInDate,
                    checkOutDate,
                    numberOfPeople
                }
            });
            setRooms(response.data.rooms);
            setSelectedRooms({}); // Reset selections when new results load
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch available rooms");
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        if (hotelId && checkInDate && checkOutDate && numberOfPeople) {
            setLoading(true); // Reset loading state when parameters change
            fetchRooms();
        }
    }, [hotelId, checkInDate, checkOutDate, numberOfPeople]);

    const incrementRoomQuantity = (roomId, maxQuantity) => {
        setSelectedRooms(prev => {
            const current = prev[roomId] || 0;
            const available = rooms.find(r => r._id === roomId)?.quantity || 0;
            return {
                ...prev,
                [roomId]: Math.min(current + 1, available, maxQuantity)
            };
        });
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

    const calculateTotalPrice = () => {
        return rooms.reduce((total, room) => {
            const quantity = selectedRooms[room._id] || 0;
            return total + (room.price * quantity);
        }, 0);
    };

    const handleContinueBooking = async () => {
        if (Object.keys(selectedRooms).length === 0) return;

        // Prepare room details with quantities and prices
        const roomDetails = rooms
            .filter(room => selectedRooms[room._id] > 0) // Only include selected rooms
            .map(room => ({
                roomId: room._id,
                roomType: room.type,
                quantity: selectedRooms[room._id],
                pricePerRoom: room.price,
                totalPrice: room.price * selectedRooms[room._id],
            }));



        const bookingData = {
            userId,
            hotelId,
            roomQuantities: selectedRooms,
            checkInDate,
            checkOutDate,
            totalPrice: calculateTotalPrice(),
            roomDetails,
        };
        console.log("Booking Data", bookingData);


        navigate('/booking-step2', { state: bookingData });
    };

    const validDate = checkInDate === checkOutDate

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Select Rooms</h2>
                {/* <Button variant="secondary" onClick={() => setOpen(false)}>
                    Close
                </Button> */}
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
                                <th>Capacity</th>
                                <th>Available Rooms</th>
                                <th>Quantity</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rooms.map(room => (
                                <tr key={room._id}>
                                    <td>{room.type}</td>
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
                                                disabled={(selectedRooms[room._id] || 0) >= room.quantity || validDate}
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

            {/* Total Price Display */}
            {Object.keys(selectedRooms).length > 0 && (
                <div className="d-flex justify-content-end mt-3">
                    <Badge bg="primary" className="p-3 fs-5 shadow">
                        Total: ${calculateTotalPrice().toLocaleString()}
                    </Badge>
                </div>
            )}

            <div className="d-flex justify-content-end mt-4">
                <Button
                    variant="primary"
                    onClick={handleContinueBooking}
                    disabled={Object.keys(selectedRooms).length === 0 || validDate}
                    size="lg"
                >
                    Continue to Payment
                </Button>
            </div>
        </div>
    );
};

export default Booking;