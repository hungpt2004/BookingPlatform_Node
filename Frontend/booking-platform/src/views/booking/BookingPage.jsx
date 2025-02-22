import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Spinner, Alert, Table, Badge, DropdownButton, Dropdown } from "react-bootstrap";
import axiosInstance from "../../utils/AxiosInstance";
import axios from "axios";
import { BASE_URL } from "../../utils/Constant";
import { formatCurrencyVND } from "../../utils/FormatPricePrint";

const Booking = ({
    setOpen,
    hotelId,
    checkInDate,
    checkOutDate,
    numberOfPeople,
    userId
}) => {
    const [selectedRooms, setSelectedRooms] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [beds, setBeds] = useState([])
    const [bed, setBed] = useState([])
    const [quantity, setQuantity] = useState([])
    const [loadingBeds, setLoadingBeds] = useState(false);
    const [capacityError, setCapacityError] = useState(null);

    const navigate = useNavigate();


    // console.log("Data rooms 1:", JSON.stringify(rooms, null, 2));
    // console.log("Data bed 2:", JSON.stringify(beds, null, 2));
    // console.log("Data bed detail 3:", JSON.stringify(bed, null, 2));

    console.log("Data rooms 1:", rooms);
    console.log("Data bed 2:", beds);
    console.log("Data bed detail 3:", bed);

    //Get Data Room
    const fetchRooms = async () => {
        try {
            const response = await axiosInstance.get(`/room/get-room-by-hotel/${hotelId}`, {
                params: {
                    checkInDate,
                    checkOutDate,
                    numberOfPeople
                }
            });
            console.log(response.data.rooms)
            setRooms(response.data.rooms);
            setSelectedRooms({}); // Reset selections when new results load
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch available rooms");
        } finally {
            setLoading(false);
        }
    };

    const fetchBed = async (id) => {
        setLoading(true); // Bắt đầu loading
        console.log(`Fetching bed with ID: ${id}`);
        try {
            const response = await axios.get(`${BASE_URL}/bed/bed-detail/${id}`);
            if (response.data && response.data.bed[0].bed) {
                console.log("Data bed:", JSON.stringify(response.data.bed, null, 2));
                console.log("Bed quantity:", response.data.bed[0].quantity);
                setQuantity(response.data.bed[0].quantity);
                return response.data.bed[0].bed;
            }
        } catch (err) {
            console.error("Error fetching bed:", err.response?.data?.message || err.message);
            setError(err.response?.data?.message || "Failed to fetch bed details");
        } finally {
            setTimeout(() => {
                setLoading(false);
            }, 500)
        }
    };



    //Get Bed Detail
    const fetchBedDetail = async (id) => {
        setLoadingBeds(true);
        try {
            const response = await axios.get(`${BASE_URL}/bed/${id}`);
            console.log("Bed Detail:", JSON.stringify(response.data.bed, null, 2));
            if (response.data && response.data.bed) {
                return response.data.bed;
            }
        } catch (err) {
            console.error("Error fetching bed detail:", err.response?.data?.message || err.message);
            setError(err.response?.data?.message || "Failed to fetch bed detail");
        } finally {
            setTimeout(() => {
                setLoadingBeds(false);
            }, 500)
        }
    };


    useEffect(() => {
        setQuantity()
        if (rooms.length > 0) {
            const getBed = async () => {
                const bedsData = await Promise.all(rooms.map(room => fetchBed(room._id)));
                setBeds(bedsData);
            };
            getBed();
        }
    }, [rooms]);

    useEffect(() => {
        if (beds.length > 0) {
            const getBedDetail = async () => {
                const bedDetails = await Promise.all(beds.map(bed => fetchBedDetail(bed)));
                setBed(bedDetails);
            };
            getBedDetail();
        }
    }, [beds]);


    useEffect(() => {
        if (hotelId && checkInDate && checkOutDate && numberOfPeople) {
            setLoading(true); // Reset loading state when parameters change
            fetchRooms();
        }
    }, [hotelId, checkInDate, checkOutDate, numberOfPeople]);

    const calculateTotalCapacity = () => {
        return rooms.reduce((total, room) => {
            const quantity = selectedRooms[room._id] || 0;
            return total + (room.capacity * quantity);
        }, 0);
    }


    //Calculate total price
    const calculateTotalPrice = () => {
        return rooms.reduce((total, room) => {
            const quantity = selectedRooms[room._id] || 0;
            return total + (room.price * quantity);
        }, 0);
    };

    //Confirm Booking And Go to Payment
    const handleContinueBooking = async () => {
        if (Object.keys(selectedRooms).length === 0) return;

        const totalCapacity = calculateTotalCapacity();
        // const totalRooms = Object.values(selectedRooms).reduce((acc, curr) => acc + curr, 0);

        if (totalCapacity < numberOfPeople) {
            setCapacityError(`You still need  to  fit ${numberOfPeople - totalCapacity} more people`);
            return;
        }

        // if (totalRooms > 1 && totalCapacity > numberOfPeople) {
        //     setCapacityError(`You have exceeded the required number of people`);
        //     return;
        // }

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

        const roomIds = rooms
            .filter(room => selectedRooms[room._id] > 0)
            .map(room => ({
                roomId: room._id,
            }));

        const bookingData = {
            userId,
            hotelId,
            totalRooms: rooms,
            roomQuantities: selectedRooms,
            checkInDate,
            checkOutDate,
            totalPrice: calculateTotalPrice(),
            roomDetails,
            roomIds
        };
        console.log("Booking Data", bookingData);

        navigate('/booking-step2', { state: bookingData });
    };

    const validDate = checkInDate === checkOutDate

    return (
        <div className="p-5">
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

            {capacityError && (
                <Alert variant="danger" className="mt-3">
                    {capacityError}
                </Alert>
            )}

            {!loading && !error && (
                <div className="table-responsive">

                    <Table striped bordered className="align-middle">
                        <thead>
                            <tr className="text-center fs-4 bg-primary">
                                <th>Accomodation Type</th>
                                <th>Capacity</th>
                                <th>Price</th>
                                <th>Quantity</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rooms.map((room, index) => (
                                <tr key={index}>
                                    <td>
                                        <div>
                                            <p className="text-decoration-underline text-primary fw-bold fs-5 cursor-pointer">{room.type}</p>
                                            <p className="text-danger fw-bold">Only {quantity} rooms left on our site </p>
                                            <p>1 {loadingBeds ? <Spinner animation="border" size="sm" /> : bed[index]?.name || "N/A"}</p>
                                        </div>
                                    </td>
                                    <td className="text-center">{room.capacity}</td>
                                    <td className="text-center">{formatCurrencyVND(room.price)}</td>
                                    <td>
                                        <div className="d-flex align-items-center justify-content-center">
                                            <DropdownButton
                                                id={`dropdown-room-${index}`}
                                                title={selectedRooms[room._id] || 1}
                                                onSelect={(eventKey) => setSelectedRooms(prev => ({
                                                    ...prev,
                                                    [room._id]: parseInt(eventKey)
                                                }))}
                                            >
                                                {[...Array(room.quantity + 1).keys()].slice(1).map(num => (
                                                    <Dropdown.Item key={num} eventKey={num}>{num}</Dropdown.Item>
                                                ))}
                                            </DropdownButton>

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
                    <Badge bg="dark" className="p-3 fs-6 shadow text-light">
                        Total: {formatCurrencyVND(calculateTotalPrice())}
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
                    Continue
                </Button>
            </div>
        </div>
    );
};

export default Booking;