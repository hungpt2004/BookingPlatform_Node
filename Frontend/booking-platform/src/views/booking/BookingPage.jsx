import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Spinner, Alert, Badge, DropdownButton, Dropdown } from "react-bootstrap";
import axiosInstance from "../../utils/AxiosInstance";
import axios from "axios";
import { BASE_URL } from "../../utils/Constant";
import { formatCurrencyVND } from "../../utils/FormatPricePrint";
import { renderPersonIcon } from "../../utils/RenderPersonIcon";
import dayjs from "dayjs";
import { Table, Select, Spin } from 'antd';
const { Option } = Select;

const Booking = ({
    setOpen,
    hotelId,
    checkInDate,
    checkOutDate,
    numberOfPeople,
    userId,
    currentHotel,
    listFeedback,
    checkInTime,
    checkOutTime,
}) => {
    const [selectedRooms, setSelectedRooms] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [beds, setBeds] = useState([])
    const [bed, setBed] = useState([])
    const [quantity, setQuantity] = useState({});
    const [loadingBeds, setLoadingBeds] = useState(false);
    const [capacityError, setCapacityError] = useState(null);
    const [distanceDay, setDistanceDay] = useState(0)

    const navigate = useNavigate();

    console.log(`Check In Time: ${checkInTime}`)
    console.log(`Check Out Time: ${checkOutTime}`)

    // console.log("Data bed 2:", JSON.stringify(beds, null, 2));
    // console.log("Data bed detail 3:", JSON.stringify(bed, null, 2));

    // console.log("Data rooms 1:", rooms);
    // console.log("Data bed 2:", beds);
    // console.log("Data bed detail 3:", bed);

    //Get Data Room
    const fetchRooms = async () => {
        try {
            const response = await axiosInstance.get(`/room/get-room-by-hotel/${hotelId}`, {
                params: {
                    checkInDate,
                    checkOutDate,
                    numberOfPeople,
                    checkInTime,
                    checkOutTime
                }
            });
            // console.log("numberOfPeople:", numberOfPeople);
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
        setLoading(true);
        console.log(`Fetching bed with ID: ${id}`);
        try {
            const response = await axios.get(`${BASE_URL}/bed/bed-detail/${id}`);
            if (response.data && response.data.bed.length > 0) {
                console.log("Data bed:", JSON.stringify(response.data.bed, null, 2));
                const bedData = response.data.bed[0];

                // Cập nhật số lượng giường theo từng roomId
                setQuantity(prev => ({
                    ...prev,
                    [id]: bedData.quantity
                }));

                return bedData.bed;
            }
        } catch (err) {
            console.error("Error fetching bed:", err.response?.data?.message || err.message);
            setError(err.response?.data?.message || "Failed to fetch bed details");
        } finally {
            setTimeout(() => {
                setLoading(false);
            }, 500);
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

        //Calculate total night stay
        const dateOut = dayjs(checkOutDate);
        const dateIn = dayjs(checkInDate);
        var nightTotal = dateOut.diff(dateIn, "day")

        const roomTotalPrice = rooms.reduce((total, room) => {
            const quantity = selectedRooms[room._id] || 0;
            return total + (room.price * quantity);
        }, 0);

        const hotelTotalPrice = currentHotel.pricePerNight * nightTotal;

        if (roomTotalPrice > 0) {
            return roomTotalPrice + hotelTotalPrice
        }
        return roomTotalPrice;
    };

    //Confirm Booking And Go to Payment
    const handleContinueBooking = async () => {
        if (Object.keys(selectedRooms).length === 0) return;

        const totalCapacity = calculateTotalCapacity();

        if (totalCapacity < numberOfPeople) {
            setCapacityError(`You still need  to  fit ${numberOfPeople - totalCapacity} more people`);
            return;
        }

        // Prepare room details with quantities and prices
        const roomDetails = rooms
            .filter(room => selectedRooms[room._id] > 0) // Only include selected rooms
            .map(room => ({
                roomName: room.name,
                roomId: room._id,
                roomType: room.type,
                quantity: selectedRooms[room._id],
                pricePerRoom: room.price,
                totalPrice: room.price * selectedRooms[room._id],
            }));


        console.log("Data rooms:", JSON.stringify(roomDetails, null, 2));

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
            roomIds,
            currentHotel,
            distanceNight: distanceDay,
            listFeedback,
            checkInTime,
            checkOutTime,
            numberOfPeople: numberOfPeople,
        };

        console.log("Booking Data", bookingData);

        try {
            //LANH CHANH T GÕ M
            navigate('/booking-step2', { state: bookingData });
        } catch (error) {
            console.error("Error creating booking:", error);
        }
    };


    const validDate = checkInDate === checkOutDate

    useEffect(() => {
        if (checkInDate && checkOutDate) {
            const dateOut = dayjs(checkOutDate);
            const dateInt = dayjs(checkInDate);
            const distanceDay = dateOut.diff(dateInt, "day");
            setDistanceDay(distanceDay)
        }
    }, [checkInDate, checkOutDate])

    return (
        <div className="p-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h5>Select Rooms - <span className="alert alert-warning">You want to have {distanceDay} nights</span></h5>
                <p>Price per night: {formatCurrencyVND(currentHotel.pricePerNight)}</p>
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
                    <Table
                        bordered
                        dataSource={rooms}
                        rowKey="_id"
                        pagination={false}
                        columns={[
                            {
                                title: 'Accommodation Type',
                                dataIndex: 'type',
                                key: 'type',
                                render: (text, record, index) => (
                                    <div>
                                        <p className="text-decoration-underline text-primary fw-bold fs-6 cursor-pointer">{text}</p>
                                        <p className="text-danger fw-bold">
                                            Each room has {quantity?.[record._id] ?? "N/A"} beds on our site
                                        </p>
                                        <p>
                                            {quantity?.[record._id] ?? "N/A"} {loadingBeds ? <Spin size="small" /> : bed[index]?.name || "N/A"}
                                        </p>
                                    </div>
                                ),
                            },
                            {
                                title: 'Capacity',
                                dataIndex: 'capacity',
                                key: 'capacity',
                                align: 'center',
                                render: (capacity) => renderPersonIcon(capacity),
                            },
                            {
                                title: 'Price',
                                dataIndex: 'price',
                                key: 'price',
                                align: 'center',
                                render: (price) => formatCurrencyVND(price),
                            },
                            {
                                title: 'Quantity',
                                key: 'quantity',
                                align: 'center',
                                render: (_, record) => (
                                    <Select
                                        value={selectedRooms[record._id] ?? 0}
                                        onChange={(value) =>
                                            setSelectedRooms((prev) => ({
                                                ...prev,
                                                [record._id]: parseInt(value),
                                            }))
                                        }
                                        style={{ width: 80 }}
                                    >
                                        {Array.from({ length: record.quantity + 1 }, (_, i) => (
                                            <Option key={i} value={i}>
                                                {i}
                                            </Option>
                                        ))}
                                    </Select>
                                ),
                            },
                        ]}
                    />
                </div>
            )}

            {/* Total Price Display */}
            {(Object.keys(selectedRooms).length > 0 && calculateTotalPrice() > 0) && (
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
                    disabled={(Object.keys(selectedRooms).length === 0 || calculateTotalPrice() <= 0) || validDate}
                    size="lg"
                >
                    Continue
                </Button>
            </div>
        </div>
    );
};

export default Booking;