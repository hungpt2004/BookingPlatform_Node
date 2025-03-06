import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Card, Button, ListGroup, Badge } from "react-bootstrap";
import axiosInstance from "../../utils/AxiosInstance";
import { formatCurrencyVND } from "../../utils/FormatPricePrint";
import { formatDate } from "../../utils/FormatDatePrint";
import CustomNavbar from "../../components/navbar/CustomNavbar";
import CustomSlide from "../../components/slide/CustomSlide";
import CustomInput from "../../components/input/CustomInput";
import { renderStarIcon } from "../../utils/RenderPersonIcon";
import { RatingConsider } from "../../utils/RatingConsider";
import RoomCards from "../../components/card/RoomCard";
import { FaConciergeBell, FaCheckCircle, FaChevronRight, FaChevronDown } from "react-icons/fa";

const BookingStepTwo = () => {
    const { state: bookingData } = useLocation();
    const navigate = useNavigate();
    const [item, setItem] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [expandedRooms, setExpandedRooms] = useState([]);


    const {
        userId,
        hotelId,
        totalRooms,
        roomQuantities,
        checkInDate,
        checkOutDate,
        totalPrice,
        roomDetails,
        roomIds,
        currentHotel,
        distanceNight,
        listFeedback,
        numberOfPeople

    } = bookingData;


    useEffect(() => {

        const fetchAndExpandRooms = async () => {

            try {
                // Fetch all rooms by their IDs
                const roomsData = await Promise.all(
                    roomIds.map(room =>
                        axiosInstance.get(`/room/get-room-by-id/${room.roomId}`)
                            .then(res => res.data.room)
                    )
                );

                // Expand rooms based on quantity
                const expanded = [];
                roomsData.forEach(room => {
                    const quantity = roomQuantities[room._id];
                    for (let i = 0; i < quantity; i++) {
                        expanded.push({
                            ...room,
                            instanceId: `${room._id}-${i}` // Unique ID per instance
                        });
                    }
                });

                setExpandedRooms(expanded);
            } catch (error) {
                console.error("Error fetching rooms:", error);
            }
        };

        fetchAndExpandRooms();
    }, [roomIds]);


    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

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
    console.log(`Detail Room Selected: ${JSON.stringify(roomIds, null, 2)}`)

    // console.log(`Debug Selected Room: ${JSON.stringify(totalRooms, null, 2)}`)
    // Calculate total rooms selected by summing up the quantities
    const totalRoomsSelected = Object.values(roomQuantities).reduce((sum, quantity) => sum + quantity, 0);

    // Only show rooms that have quantity > 0
    const selectedRooms = roomDetails.filter((room) => room.quantity > 0);

    
    // console.log(`Detail Room Selected: ${JSON.stringify(roomDetails, null, 2)}`)

    const generateTimeOptions = () => {
        const options = [];
        let hour = 0;
        let minute = 0;

        while (hour < 24) { // Goes up to 02:00 AM the next day (24 + 2)
            const formattedHour = hour < 10 ? `0${hour}` : hour;
            const formattedMinute = minute < 10 ? `0${minute}` : minute;
            const timeLabel = `${formattedHour}:${formattedMinute}`;

            options.push(
                <option key={timeLabel} value={timeLabel}>
                    {timeLabel} - {formattedHour === "25" ? "02" : (hour + 1 < 10 ? `0${hour + 1}` : hour + 1)}:{formattedMinute}
                </option>
            );

            hour++;
        }

        return options;
    };


    const payment = async () => {
        try {
            const responseBooking = await axiosInstance.post('/payment/create-booking', {
                hotelId,
                roomIds,
                checkInDate,
                checkOutDate,
                roomDetails,
                totalPrice
            });

            if (responseBooking.data && responseBooking.data.message && responseBooking.data.reservation) {
                const reservationId = responseBooking.data.reservation._id;

                const responsePayment = await axiosInstance.post('/payment/create-payment-link', {
                    amount: totalPrice,
                    rooms: roomDetails,
                    hotelId: hotelId,
                    roomIds: roomIds,
                    reservationId: reservationId
                });

                sessionStorage.setItem('payment_link', responsePayment.data.checkoutUrl)

                window.location.href = responsePayment.data.checkoutUrl;
            }
        } catch (error) {
            console.error("Payment error:", error);
        }
    };


    return (
        <>
            <CustomNavbar />
            <div className="container-fluid mt-3" style={{ maxWidth: '85%' }}>
                <div className="row w-100">
                    <div className="col-md-8">
                        <Card className="rounded-1 px-2">
                            <Card.Text className="text-muted py-3" style={{ fontSize: '12px' }}>Save 10% or more on this option when you sign in with Genius, Booking.com's loyalty programme</Card.Text>
                        </Card>
                        <Card className="mt-2">
                            <Card.Title className="px-2 mt-2 fw-bold" style={{ fontSize: '16px' }}>Enter your details</Card.Title>
                            {/* Row1 */}
                            <div className="row mt-2 px-2">
                                <div className="col-md-6">
                                    <label style={{ fontSize: '14px' }}>First name <span className="text-danger">*</span></label>
                                    <div className="input-group mb-3">
                                        <input type="text" className="form-control" placeholder="" aria-label="Username" aria-describedby="basic-addon1" required />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <label style={{ fontSize: '14px' }}>Last name <span className="text-danger">*</span></label>
                                    <div className="input-group mb-3">
                                        <input type="text" className="form-control" placeholder="" aria-label="Username" aria-describedby="basic-addon1" required />
                                    </div>
                                </div>
                            </div>
                            <div className="row px-2">
                                <div className="col-md-6">
                                    <label style={{ fontSize: '14px' }}>Email address <span className="text-danger">*</span></label>
                                    <div className="input-group mb-3">
                                        <input type="text" className="form-control" placeholder="" aria-label="Username" aria-describedby="basic-addon1" required />
                                    </div>
                                    <p className="mt-0" style={{ fontSize: '12px' }}>Confirmation email goes to this address</p>
                                </div>
                            </div>
                            <div className="row px-2">
                                <div className="col-md-6">
                                    <label style={{ fontSize: '14px' }}>Country/region <span className="text-danger">*</span></label>
                                    <div className="input-group mb-3">
                                        <select className="form-control" >
                                            <option value="VN">Viet Nam</option>
                                            <option value="US">United States</option>
                                            <option value="UK">United Kingdom</option>
                                            <option value="FR">France</option>
                                            <option value="DE">Germany</option>
                                            {/* Thêm các quốc gia khác nếu cần */}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="row px-2">
                                <div className="col-md-6">
                                    <label style={{ fontSize: '14px' }}>Phone number <span className="text-danger">*</span></label>
                                    <div className="row">
                                        <div className="col-md-4">
                                            <div className="input-group mb-3">
                                                <input type="text" className="form-control" value={"VN+84"} aria-describedby="basic-addon1" />
                                            </div>
                                        </div>
                                        <div className="col-md-8">
                                            <div className="input-group mb-3">
                                                <input type="text" className="form-control" placeholder="" aria-label="Username" aria-describedby="basic-addon1" required />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                        <RoomCards roomQuantities={expandedRooms} />
                        <Card>
                            <Card.Body>
                                <Card.Title className="fw-bold fs-5 mb-3">Your arrival time</Card.Title>
                                <Card.Text className="d-flex align-items-center mb-3">
                                    <FaConciergeBell className="text-success fs-3 me-3" /> <span className="">Late check-in until 23:00.</span>
                                </Card.Text>

                                <Card.Text className="d-flex align-items-center  mb-3">
                                    <FaCheckCircle className="text-success fs-3 me-3" /> <span className="">24 Hour Reception - Help is always available whenever you need it!</span>
                                </Card.Text>

                                <div>
                                    <Card.Text className="fw-bold mb-0 pb-0">Add your estimated time of arrival <small className="fw-normal text-muted">(optional) </small></Card.Text>
                                    <select className="form-control">
                                        <option value="" disabled>
                                            Please select
                                        </option>
                                        <option value="">I Don't Know</option>
                                        {generateTimeOptions()}
                                    </select>
                                </div>
                            </Card.Body>
                        </Card>
                        <Button className="my-3 py-2 float-end" onClick={payment}>
                            <span>Continue: Final Details <FaChevronRight style={{ fontSize: '12px' }} /> </span>
                        </Button>

                    </div>
                    <div className="col-md-4">
                        <Card className="rounded">
                            <Card.Body>
                                <Card.Title className="fs-6">Hotel {renderStarIcon(currentHotel.rating)}</Card.Title>
                                <Card.Title className="fw-bold" style={{ fontSize: '16px' }}>{currentHotel.hotelName}</Card.Title>
                                <Card.Text className="" style={{
                                    display: '-webkit-box',
                                    WebkitBoxOrient: 'vertical',
                                    WebkitLineClamp: 2,
                                    overflow: 'hidden',
                                }}>{currentHotel.address}</Card.Text>
                                <Card.Text className=" text-success">Excellent location - {currentHotel.rating}</Card.Text>
                                <div className="d-flex align-items-center 2 mb-2">
                                    <Card style={{ backgroundColor: '#003b95' }}>
                                        <Card.Text className="px-2 py-1 text-light text-center">{currentHotel.rating}</Card.Text>
                                    </Card>
                                    <span className="fw-bold px-3 fs-6">{RatingConsider(currentHotel.rating)}</span>
                                </div>

                            </Card.Body>
                        </Card>
                        <Card className="mt-2">
                            <Card.Body>
                                <Card.Title className='fs-6 fw-bold'>Your Reservation Information:</Card.Title>
                                <div className="row py-1">
                                    <div className="col-sm-6 " style={{ borderRight: '1px solid #e0e0e0' }}>
                                        <Card.Text className="mb-1">Check In:</Card.Text>
                                        <Card.Text className="fw-bold mb-0">{checkInDate}</Card.Text>
                                        <Card.Text className="fw-lighter mb-0 text-muted" style={{ fontSize: '13px' }}>From 14:00 </Card.Text>
                                    </div>
                                    <div className="col-sm-6 ">
                                        <Card.Text className="mb-1">Check Out:</Card.Text>
                                        <Card.Text className="fw-bold mb-0">{checkOutDate}</Card.Text>
                                        <Card.Text className="fw-lighter mb-0 text-muted" style={{ fontSize: '14px' }}>To 12:00 </Card.Text>
                                    </div>
                                </div>
                                <div className="pb-2" style={{ borderBottom: '1px solid #e0e0e0' }}>
                                    <Card.Text className='mb-0'>Total Days:</Card.Text>
                                    <Card.Text className="mb-0 fw-bold" >{distanceNight} {distanceNight > 1 ? "nights" : "night"} </Card.Text>
                                </div>
                                <div className="mt-3">
                                    <Card.Text>You Have Choose:</Card.Text>

                                    <div
                                        className="d-flex justify-content-between align-items-center fw-bold"
                                        style={{ cursor: 'pointer' }}
                                        onClick={handleToggle}
                                    >
                                        <span>
                                            {totalRoomsSelected} room(s) for {numberOfPeople} person
                                        </span>

                                        <span
                                            style={{
                                                display: 'inline-block',
                                                transition: 'transform 0.45s ease-in-out',
                                                transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                                            }}
                                        >
                                            <FaChevronDown />
                                        </span>
                                    </div>

                                    <div
                                        style={{
                                            maxHeight: isOpen ? totalRoomsSelected > 15 ? '600px' : '300px' : '0px',
                                            overflowY: 'hidden',
                                            transition: 'max-height 0.45s ease-in-out',
                                        }}
                                        className="mt-2"
                                    >
                                        {selectedRooms.length === 0 ? (
                                            <p>No rooms selected.</p>
                                        ) : (
                                            selectedRooms.map((room, index) => (
                                                <p key={index} className="mb-1">
                                                    {room.quantity} x {room.roomType}
                                                </p>
                                            ))
                                        )}
                                    </div>
                                </div>
                                <Card.Text className="mt-3">Change My Reservation Choices</Card.Text>
                            </Card.Body>
                        </Card>
                        <Card className="mt-2">
                            <Card.Body >
                                <Card.Text className="fw-bold mb-3">Price Summary</Card.Text>
                                <div className="row">
                                    <div className="col-sm-8 ">
                                        <Card.Text>Original Price</Card.Text>
                                    </div >
                                    <div className="col-sm-4 text-end">
                                        <Card.Text>999.999 VND</Card.Text>
                                    </div >
                                    <div className="col-sm-8 ">
                                        <Card.Text className="mb-0">Early 2025 Offer</Card.Text>
                                        <Card.Text className="text-muted" style={{ fontSize: '13px' }}>This property is offering a promotion for stays from 1 January – 1 April 2025</Card.Text>
                                    </div >
                                    <div className="col-sm-4 text-end">
                                        <Card.Text>-100.000 VND</Card.Text>
                                    </div >
                                    <div className="col-sm-8 ">
                                        <Card.Text className="mb-0">Genius Discounts</Card.Text>
                                        <Card.Text className="text-muted" style={{ fontSize: '13px' }}>You get discounts because you are a Genius member</Card.Text>
                                    </div >
                                    <div className="col-sm-4 text-end">
                                        <Card.Text>-100.000 VND</Card.Text>
                                    </div >
                                </div>
                            </Card.Body>

                            <Card.Body style={{ backgroundColor: '#EBF3FF' }}>
                                <div className="text-end">
                                    <Card.Text className='text-danger fw-bold text-decoration-line-through mb-0'>{formatCurrencyVND(999999)}</Card.Text>
                                    <div className="d-flex justify-content-between mb-0 pb-0">
                                        <Card.Text className="fw-bold fs-3 mb-0">Total Price</Card.Text>
                                        <Card.Text className="fw-bold fs-3 mb-0">{formatCurrencyVND(totalPrice)}</Card.Text>
                                    </div>
                                    <Card.Text className="text-muted mb-0">Including taxes and services</Card.Text>
                                </div>
                            </Card.Body>
                        </Card>
                    </div>
                </div>
            </div >
        </>
    );
};

export default BookingStepTwo;