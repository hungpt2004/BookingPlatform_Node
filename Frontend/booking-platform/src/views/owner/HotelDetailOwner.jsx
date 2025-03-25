import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Container, Row, Col, Card, Spinner, Alert, Button, Badge, Form, Pagination } from 'react-bootstrap';
import axios from 'axios';
import { BASE_URL } from '../../utils/Constant';
import { AdminCustomNavbar } from '../../components/navbar/AdminCustomNavbar';
import AdminSidebar from '../../components/navbar/OwnerSidebar';

const HotelDetailOwnerPage = () => {
    const { user, isAuthenticated } = useAuthStore();
    const { hotelId } = useParams();
    const navigate = useNavigate();
    const [hotel, setHotel] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [checkInDate, setCheckInDate] = useState('');
    const [checkOutDate, setCheckOutDate] = useState('');
    const [filteredRooms, setFilteredRooms] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(6);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!isAuthenticated) {
                    setError('You are not authenticated. Please log in.');
                    setLoading(false);
                    return;
                }

                const token =
                    sessionStorage.getItem('token') ||
                    localStorage.getItem('token') ||
                    user?.token;

                if (!token) {
                    setError('No valid authentication token found.');
                    setLoading(false);
                    return;
                }
                const hotelResponse = await axios.get(`${BASE_URL}/hotel/get-hotel-detail/${hotelId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setHotel(hotelResponse.data.hotel);
                const roomsResponse = await axios.get(`${BASE_URL}/room/get-room-owner/${hotelId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setRooms(roomsResponse.data.rooms);
                setFilteredRooms(roomsResponse.data.rooms);

                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch data');
                setLoading(false);
            }
        };

        fetchData();
    }, [hotelId]);

    const handleFilter = async () => {
        if (!checkInDate || !checkOutDate) {
            alert('Please select both check-in and check-out dates.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `${BASE_URL}/room/filter-room-availability/${hotelId}`,
                {
                    params: { checkInDate, checkOutDate },
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (response.data.error === false) {
                // Map the response to include availability information
                const availabilityRooms = response.data.rooms.map(room => ({
                    ...room,
                    availableQuantity: room.availableQuantity,
                    bookedQuantity: room.bookedQuantity,
                    isFullyBooked: room.isFullyBooked
                }));

                setFilteredRooms(availabilityRooms);
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch room availability');
        }
    };


    useEffect(() => {
        if (checkInDate && checkOutDate) {
            handleFilter();
        }
    }, [currentPage]);

    const resetFilter = () => {
        setFilteredRooms(rooms);
        setCheckInDate('');
        setCheckOutDate('');
    };

    if (loading) {
        return (
            <Container className="mt-5 text-center">
                <Spinner animation="border" />
                <p className="mt-2">Loading hotel details...</p>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="mt-5">
                <Alert variant="danger">{error}</Alert>
                <Button variant="outline-secondary" onClick={() => navigate('/room-management')}>
                    Back to Rooms Overview
                </Button>
            </Container>
        );
    }

    return (
        <>
            <div className="d-flex">
                <div className="booking-app flex-grow-1" style={{ paddingLeft: "20px" }}>
                    <Container className="py-4">
                        <Button
                            variant="outline-secondary"
                            onClick={() => navigate('/room-management')}
                            className="mb-4"
                        >
                            &larr;  Back to Rooms Overview
                        </Button>

                        {hotel && (
                            <Card className="mb-4 shadow-sm">
                                <Row className="g-0">
                                    <Col md={4}>
                                        {hotel.images?.length > 0 ? (
                                            <Card.Img
                                                variant="top"
                                                src={hotel.images[0]}
                                                style={{ height: '250px', objectFit: 'cover' }}
                                            />
                                        ) : (
                                            <div className="d-flex align-items-center justify-content-center bg-light"
                                                style={{ height: '250px' }}>
                                                <span className="text-muted">No image available</span>
                                            </div>
                                        )}
                                    </Col>
                                    <Col md={8}>
                                        <Card.Body>
                                            <Card.Title className="fs-2">{hotel.hotelName}</Card.Title>
                                            <Card.Text className="text-muted mb-2">{hotel.address}</Card.Text>
                                            <div className="d-flex gap-2 mb-3">
                                                <Badge bg="warning" className="fs-6">{hotel.star} ★</Badge>
                                                <Badge bg="success" className="fs-6">
                                                    Rating: {hotel.rating?.toFixed(1)}
                                                </Badge>
                                            </div>
                                            <Card.Text>{hotel.description}</Card.Text>
                                        </Card.Body>
                                    </Col>
                                </Row>
                            </Card>
                        )}

                        <h4 className="mb-4 border-bottom pb-2">Room Availability</h4>

                        {/* Date Filter Section */}
                        <Row className="mb-4">
                            <Col md={3}>
                                <Form.Control
                                    type="date"
                                    value={checkInDate}
                                    onChange={(e) => setCheckInDate(e.target.value)}
                                    placeholder="Check-in Date"
                                />
                            </Col>
                            <Col md={3}>
                                <Form.Control
                                    type="date"
                                    value={checkOutDate}
                                    onChange={(e) => setCheckOutDate(e.target.value)}
                                    placeholder="Check-out Date"
                                />
                            </Col>
                            <Col md={3}>
                                <Button variant="primary" onClick={handleFilter}>
                                    Filter Rooms
                                </Button>
                            </Col>
                            <Col md={3}>
                                <Button variant="outline-secondary" onClick={resetFilter}>
                                    Reset Filter
                                </Button>
                            </Col>
                        </Row>

                        {/* Room Cards */}
                        <Row>
                            {filteredRooms.map((room) => (
                                <Col md={6} lg={4} key={room._id} className="mb-4">
                                    <Card className={`h-100 shadow-sm ${room.isFullyBooked ? 'border-danger' : ''}`}>
                                        {room.images?.length > 0 ? (
                                            <Card.Img
                                                variant="top"
                                                src={room.images[0]}
                                                style={{ height: '180px', objectFit: 'cover' }}
                                            />
                                        ) : (
                                            <div className="d-flex align-items-center justify-content-center bg-light"
                                                style={{ height: '180px' }}>
                                                <span className="text-muted">No image available</span>
                                            </div>
                                        )}
                                        <Card.Body>
                                            <h5 className="mb-2">{room.type}</h5>
                                            <p className="text-muted">{room.price.toLocaleString()}₫/night</p>
                                            <Badge
                                                bg={room.isFullyBooked ? 'danger' : 'info'}
                                                className="mb-3"
                                            >
                                                {room.isFullyBooked
                                                    ? 'Fully Booked'
                                                    : `${room.availableQuantity} rooms available`
                                                }
                                            </Badge>
                                            {room.bookedQuantity > 0 && (
                                                <Badge bg="warning" className="ms-2">
                                                    {room.bookedQuantity} rooms booked
                                                </Badge>
                                            )}
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                        <Pagination className="justify-content-center mt-4">
                            <Pagination.Prev
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                            />
                            <span className="mx-3 align-self-center">
                                Page {currentPage} of {totalPages}
                            </span>
                            <Pagination.Next
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
                            />
                        </Pagination>
                    </Container>
                </div>
            </div>
        </>
    );
};

export default HotelDetailOwnerPage;