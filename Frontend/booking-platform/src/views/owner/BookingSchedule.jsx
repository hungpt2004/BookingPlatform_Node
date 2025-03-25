import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Spinner, Alert, Container, Badge, Button, Card, Row, Col, Modal, Pagination } from 'react-bootstrap';
import axios from 'axios';
import { BASE_URL } from '../../utils/Constant';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import '../owner/BookingSchedule.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import AdminSidebar from '../../components/navbar/OwnerSidebar'
import { useAuthStore } from '../../store/authStore';

const localizer = momentLocalizer(moment);

const BookingSchedule = () => {
    const { user, isAuthenticated } = useAuthStore();
    const [reservations, setReservations] = useState([]);
    const [calendarEvents, setCalendarEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hotelDetails, setHotelDetails] = useState(null);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedReservation, setSelectedReservation] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showCalendarModal, setShowCalendarModal] = useState(false);
    const [selectedCardData, setSelectedCardData] = useState(null);
    const { hotelId } = useParams();
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [reservationsPerPage] = useState(6);

    const indexOfLastReservation = currentPage * reservationsPerPage;
    const indexOfFirstReservation = indexOfLastReservation - reservationsPerPage;
    const currentReservations = reservations.slice(indexOfFirstReservation, indexOfLastReservation);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);


    useEffect(() => {
        const fetchReservations = async () => {
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

                if (!hotelId) {
                    setError('Hotel ID is missing. Please go back and select a hotel.');
                    setLoading(false);
                    return;
                }
                const hotelResponse = await axios.get(
                    `${BASE_URL}/hotel/get-hotel-detail/${hotelId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (hotelResponse.data.error === false) {
                    setHotelDetails(hotelResponse.data.hotel);
                } else {
                    setError(hotelResponse.data.message || "Failed to fetch hotel details");
                    setLoading(false);
                    return;
                }
                const reservationsResponse = await axios.get(
                    `${BASE_URL}/reservation/hotel-reservations/${hotelId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (reservationsResponse.data.error === false) {
                    const reservationData = reservationsResponse.data.reservations || [];
                    setReservations(reservationData);
                    const events = reservationData.map(reservation => {
                        const startDate = new Date(reservation.checkInDate);
                        const endDate = new Date(reservation.checkOutDate);
                        endDate.setDate(endDate.getDate() + 1);

                        return {
                            id: reservation._id,
                            title: `${reservation.guest?.name || 'Guest'} - ${getStatusBadge(reservation.status)}`,
                            start: startDate,
                            end: endDate,
                            resource: reservation,
                            allDay: true,
                            status: reservation.status,
                            roomCount: reservation.rooms?.length || 0,
                        };
                    });

                    setCalendarEvents(events);
                    if (reservationData.length > 0) {
                        const firstReservationDate = new Date(reservationData[0].checkInDate);
                        setCurrentDate(firstReservationDate);
                    }
                } else {
                    setError(reservationsResponse.data.message || "Failed to fetch reservations");
                }

                setLoading(false);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError(err.response?.data?.message || 'Failed to fetch data: ' + err.message);
                setLoading(false);
            }
        };

        fetchReservations();
    }, [hotelId, isAuthenticated]);

    const getStatusBadge = (status) => {
        return status || 'UNKNOWN';
    };

    const CustomToolbar = (toolbar) => {
        const goToBack = () => {
            toolbar.onNavigate('PREV');
        };

        const goToNext = () => {
            toolbar.onNavigate('NEXT');
        };

        return (
            <div className="rbc-toolbar mb-3">

                <div className="d-flex align-items-center">
                    <button className="btn btn-link text-dark" onClick={goToBack}>
                        <FontAwesomeIcon icon={faChevronLeft} />
                    </button>

                    <span className="mx-3 fw-bold">
                        {moment(toolbar.date).format('MMMM YYYY')}
                    </span>

                    <button className="btn btn-link text-dark" onClick={goToNext}>
                        <FontAwesomeIcon icon={faChevronRight} />
                    </button>
                </div>
                <div className="d-flex align-items-center">
                    <button
                        className="btn btn-primary btn-sm"
                        onClick={() => toolbar.onNavigate('TODAY')}
                    >
                        Today
                    </button>
                </div>
            </div>
        );
    };

    const getStatusBadgeVariant = (status) => {
        switch (status) {
            case 'BOOKED':
                return 'primary';
            case 'CHECKED IN':
                return 'success';
            case 'CHECKED OUT':
                return 'secondary';
            case 'CANCELLED':
                return 'danger';
            case 'PENDING':
                return 'warning';
            default:
                return 'info';
        }
    };

    const handleBackClick = () => {
        navigate('/booking-management');
    };
    const EventComponent = ({ event }) => {
        const reservation = event.resource;
        const bgColor = getEventBackgroundColor(event.status);

        return (
            <div style={{ backgroundColor: bgColor, padding: '2px 5px', borderRadius: '3px', color: 'white', overflow: 'hidden' }}>
                <strong>{reservation.guest?.name || 'Guest'}</strong>
                <div style={{ fontSize: '0.8em' }}>
                    {reservation.rooms?.length || 0} room(s)
                </div>
            </div>
        );
    };

    const getEventBackgroundColor = (status) => {
        switch (status) {
            case 'BOOKED':
                return '#0d6efd'; 
            case 'CHECKED IN':
                return '#198754'; 
            case 'CHECKED OUT':
                return '#6c757d'; 
            case 'CANCELLED':
                return '#dc3545';
            case 'PENDING':
                return '#ffc107'; 
            default:
                return '#0dcaf0'; 
        }
    };

    const calculateNights = (checkIn, checkOut) => {
        const startDate = new Date(checkIn);
        const endDate = new Date(checkOut);
        const diffTime = Math.abs(endDate - startDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };
    const handleEventClick = (event) => {
        setSelectedReservation(event.resource);
        setShowDetailsModal(true);
    };
    const handleCardClick = (reservation) => {
        setSelectedCardData(reservation);
        setShowCalendarModal(true);
    };
    const handleCloseDetailsModal = () => {
        setShowDetailsModal(false);
        setSelectedReservation(null);
    };
    const handleCloseCalendarModal = () => {
        setShowCalendarModal(false);
        setSelectedCardData(null);
    };
    const handleViewDetailsFromCalendar = () => {
        setSelectedReservation(selectedCardData);
        setShowCalendarModal(false);
        setShowDetailsModal(true);
    };
    const renderReservationCard = (reservation) => {
        const checkInDate = new Date(reservation.checkInDate);
        const checkOutDate = new Date(reservation.checkOutDate);
        const nights = calculateNights(reservation.checkInDate, reservation.checkOutDate);
        const statusVariant = getStatusBadgeVariant(reservation.status);

        return (
            <Col md={6} lg={4} className="mb-4" key={reservation._id}>
                <Card className="h-100 shadow-sm reservation-card" onClick={() => handleCardClick(reservation)}>
                    <Card.Header className="d-flex justify-content-between align-items-center">
                        <span>
                            <strong>{reservation.guest?.name || 'Guest'}</strong>
                        </span>
                        <Badge bg={statusVariant}>{reservation.status}</Badge>
                    </Card.Header>
                    <Card.Body>
                        <Card.Text>
                            <strong>Check-in:</strong> {checkInDate.toLocaleDateString()}
                            {reservation.checkInTime && ` at ${reservation.checkInTime}`}
                        </Card.Text>
                        <Card.Text>
                            <strong>Check-out:</strong> {checkOutDate.toLocaleDateString()}
                            {reservation.checkOutTime && ` at ${reservation.checkOutTime}`}
                        </Card.Text>
                        <Card.Text>
                            <strong>Duration:</strong> {nights} night(s)
                        </Card.Text>
                        <Card.Text>
                            <strong>Room(s):</strong> {reservation.rooms?.length || 0}
                        </Card.Text>
                        <Card.Text>
                            <strong>Total:</strong> ₫{(reservation.totalPrice || 0).toLocaleString()}
                        </Card.Text>
                    </Card.Body>
                    <Card.Footer className="text-muted text-center">
                        <small>Click to view calendar</small>
                    </Card.Footer>
                </Card>
            </Col>
        );
    };

    if (loading) {
        return (
            <div>
                <AdminSidebar />
                <Container className="mt-5 text-center">
                    <Spinner animation="border" role="status" />
                    <p className="mt-2">Loading reservations...</p>
                </Container>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <Container className="mt-5">
                    <Alert variant="danger">{error}</Alert>
                    <Button variant="outline-secondary" onClick={handleBackClick} className="mt-3">
                        Back to Hotels
                    </Button>
                </Container>
            </div>
        );
    }

    return (
        <div className="d-flex">
                <div className="booking-app flex-grow-1" style={{ paddingLeft: "20px" }}>
            <Container className="py-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h3 className="mb-0">Booking Schedule</h3>
                    <Button variant="outline-secondary" onClick={handleBackClick}>
                        Back to Hotels
                    </Button>
                </div>

                {hotelDetails && (
                    <div className="mb-4">
                        <h4>{hotelDetails.hotelName}</h4>
                        <p className="text-muted">{hotelDetails.address}</p>
                    </div>
                )}

                <Card className="shadow-sm mb-4">
                    <Card.Body>
                        <h5>Reservations</h5>
                        <p className="text-muted">Click on a reservation card to view it on the calendar.</p>

                        <div className="legend d-flex mb-3">
                            <div className="me-3"><Badge bg="primary">BOOKED</Badge></div>
                            <div className="me-3"><Badge bg="success">CHECKED IN</Badge></div>
                            <div className="me-3"><Badge bg="secondary">CHECKED OUT</Badge></div>
                            <div className="me-3"><Badge bg="danger">CANCELLED</Badge></div>
                            <div className="me-3"><Badge bg="warning">PENDING</Badge></div>
                        </div>

                        {reservations.length === 0 ? (
                            <Alert variant="info">No reservations found for this hotel</Alert>
                        ) : (
                            <>
                                <Row>
                                    {currentReservations.map(reservation => renderReservationCard(reservation))}
                                </Row>

                                {/* Pagination */}
                                <div className="d-flex justify-content-center mt-4">
                                    <Pagination>
                                        <Pagination.First 
                                            onClick={() => setCurrentPage(1)} 
                                            disabled={currentPage === 1} 
                                        />
                                        <Pagination.Prev 
                                            onClick={() => setCurrentPage(currentPage - 1)} 
                                            disabled={currentPage === 1} 
                                        />
                                        {[...Array(Math.ceil(reservations.length / reservationsPerPage)).keys()].map(number => (
                                            <Pagination.Item 
                                                key={number + 1} 
                                                active={number + 1 === currentPage}
                                                onClick={() => paginate(number + 1)}
                                            >
                                                {number + 1}
                                            </Pagination.Item>
                                        ))}
                                        <Pagination.Next 
                                            onClick={() => setCurrentPage(currentPage + 1)} 
                                            disabled={currentPage === Math.ceil(reservations.length / reservationsPerPage)} 
                                        />
                                        <Pagination.Last 
                                            onClick={() => setCurrentPage(Math.ceil(reservations.length / reservationsPerPage))} 
                                            disabled={currentPage === Math.ceil(reservations.length / reservationsPerPage)} 
                                        />
                                    </Pagination>
                                </div>
                            </>
                        )}
                    </Card.Body>
                </Card>
            </Container>
            <Modal
                show={showDetailsModal}
                onHide={handleCloseDetailsModal}
                centered
                size="lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        Reservation Details
                        {selectedReservation?.status && (
                            <Badge bg={getStatusBadgeVariant(selectedReservation.status)} className="ms-2">
                                {selectedReservation.status}
                            </Badge>
                        )}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedReservation && (
                        <Row>
                            <Col md={6}>
                                <Card className="mb-3">
                                    <Card.Header>
                                        <h5 className="mb-0">Guest Information</h5>
                                    </Card.Header>
                                    <Card.Body>
                                        <p><strong>Name:</strong> {selectedReservation.guest?.name || 'N/A'}</p>
                                        <p><strong>Email:</strong> {selectedReservation.guest?.email || 'N/A'}</p>
                                        <p><strong>Phone:</strong> {selectedReservation.guest?.phone || 'N/A'}</p>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={6}>
                                <Card className="mb-3">
                                    <Card.Header>
                                        <h5 className="mb-0">Stay Details</h5>
                                    </Card.Header>
                                    <Card.Body>
                                        <p>
                                            <strong>Check-in:</strong> {new Date(selectedReservation.checkInDate).toLocaleDateString()}
                                            {selectedReservation.checkInTime && ` at ${selectedReservation.checkInTime}`}
                                        </p>
                                        <p>
                                            <strong>Check-out:</strong> {new Date(selectedReservation.checkOutDate).toLocaleDateString()}
                                            {selectedReservation.checkOutTime && ` at ${selectedReservation.checkOutTime}`}
                                        </p>
                                        <p>
                                            <strong>Duration:</strong> {calculateNights(selectedReservation.checkInDate, selectedReservation.checkOutDate)} night(s)
                                        </p>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={12}>
                                <Card className="mb-3">
                                    <Card.Header>
                                        <h5 className="mb-0">Room & Payment</h5>
                                    </Card.Header>
                                    <Card.Body>
                                        <Row>
                                            <Col md={6}>
                                                <p><strong>Room(s):</strong></p>
                                                <ul>
                                                    {selectedReservation.rooms && Array.isArray(selectedReservation.rooms) ?
                                                        selectedReservation.rooms.map((room, i) => (
                                                            <li key={i}>
                                                                {typeof room === 'object' ?
                                                                    (room.room?.roomNumber || room.roomNumber || `Room ${i + 1}`) :
                                                                    `Room ${i + 1}`}
                                                                {room.roomType && ` (${room.roomType})`}
                                                            </li>
                                                        )) :
                                                        <li>No rooms information available</li>
                                                    }
                                                </ul>
                                            </Col>
                                            <Col md={6}>
                                                <p><strong>Total Price:</strong> ₫{(selectedReservation.totalPrice || 0).toLocaleString()}</p>
                                                <p><strong>Payment Method:</strong> {selectedReservation.paymentMethod || 'N/A'}</p>
                                                <p><strong>Payment Status:</strong> {selectedReservation.paymentStatus || 'N/A'}</p>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </Col>
                            {selectedReservation.specialRequests && (
                                <Col md={12}>
                                    <Card>
                                        <Card.Header>
                                            <h5 className="mb-0">Special Requests</h5>
                                        </Card.Header>
                                        <Card.Body>
                                            <p>{selectedReservation.specialRequests || 'None'}</p>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            )}
                        </Row>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseDetailsModal}>
                        Close
                    </Button>
                    {selectedReservation && selectedReservation._id && (
                        <Button
                            variant="primary"
                            onClick={() => {
                                handleCloseDetailsModal();
                                navigate(`/reservation-details/${selectedReservation._id}`);
                            }}
                        >
                            View Customer Receit
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>

            <Modal
                show={showCalendarModal}
                onHide={handleCloseCalendarModal}
                centered
                size="lg"
                className="calendar-modal"
            >
                <Modal.Header
                    closeButton
                    className="bg-gradient-primary text-white border-0"
                >
                    <Modal.Title className="d-flex align-items-center">
                        <i className="fas fa-calendar-alt me-2"></i>
                        <span className="fw-bold">Reservation Timeline</span>
                        {selectedCardData && (
                            <Badge pill bg="light" className="text-dark ms-3">
                                {moment(selectedCardData.checkInDate).format('MMM Do')} -{' '}
                                {moment(selectedCardData.checkOutDate).format('MMM Do')}
                            </Badge>
                        )}
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body className="p-0">
                    <div className="calendar-container" style={{ height: '65vh' }}>
                        <Calendar
                            localizer={localizer}
                            events={calendarEvents}
                            startAccessor="start"
                            endAccessor="end"
                            defaultDate={new Date(selectedCardData?.checkInDate)}
                            defaultView="month"
                            views={['month', 'week', 'day']}
                            components={{
                                event: EventComponent,
                                toolbar: CustomToolbar
                            }}
                            onSelectEvent={handleEventClick}
                            eventPropGetter={(event) => ({
                                style: {
                                    backgroundColor: getEventBackgroundColor(event.status),
                                    border: event.id === selectedCardData?._id
                                        ? '3px solid #fff'
                                        : '2px solid rgba(255,255,255,0.3)',
                                    borderRadius: '8px',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                    transition: 'all 0.2s ease',
                                    cursor: 'pointer',
                                    overflow: 'hidden'
                                }
                            })}
                            dayPropGetter={(date) => ({
                                className: moment(date).isSame(new Date(), 'day')
                                    ? 'current-day'
                                    : ''
                            })}
                        />
                    </div>
                </Modal.Body>

                <Modal.Footer className="d-flex justify-content-between border-top-0">
                    <Button
                        variant="outline-secondary"
                        onClick={handleCloseCalendarModal}
                        className="rounded-pill px-4"
                    >
                        <i className="fas fa-times me-2"></i>
                        Close Timeline
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleViewDetailsFromCalendar}
                        className="rounded-pill px-4"
                    >
                        <i className="fas fa-file-invoice me-2"></i>
                        View Full Details
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
        </div>
    );
};

export default BookingSchedule;