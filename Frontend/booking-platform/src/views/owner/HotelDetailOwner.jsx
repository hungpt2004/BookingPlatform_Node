import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Spinner, Alert, Button, Badge, Form } from 'react-bootstrap';
import axios from 'axios';
import { BASE_URL } from '../../utils/Constant';
import { AdminCustomNavbar } from '../../components/navbar/AdminCustomNavbar';
import AdminSidebar from '../../components/navbar/OwnerSidebar';

const HotelDetailOwnerPage = () => {
    const { hotelId } = useParams();
    const navigate = useNavigate();
    const [hotel, setHotel] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [checkInDate, setCheckInDate] = useState('');
    const [checkOutDate, setCheckOutDate] = useState('');
    const [filteredRooms, setFilteredRooms] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('Authentication required. Please log in.');
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
                `${BASE_URL}/room/get-room-availability/${hotelId}`,
                {
                    params: { checkInDate, checkOutDate },
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            console.log("Backend Response:", response.data); 
            if (response.data.error === false) {
                setFilteredRooms(response.data.rooms);
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch room availability');
        }
    };

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
                <AdminSidebar />
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
                            <Card className="h-100 shadow-sm">
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
                                    <Badge bg="info" className="mb-3">
                                        {room.quantity} rooms available
                                    </Badge>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
            </div>
            </div>
        </>
    );
};

export default HotelDetailOwnerPage;