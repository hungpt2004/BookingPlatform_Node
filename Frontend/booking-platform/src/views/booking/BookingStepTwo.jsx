import React, { useState } from "react";
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

const BookingStepTwo = () => {
    const { state: bookingData } = useLocation();
    const navigate = useNavigate();
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
        hotelId,
        totalRooms,
        checkInDate,
        checkOutDate,
        totalPrice,
        roomDetails,
        roomIds,
        currentHotel,
        distanceNight,
        listFeedback

    } = bookingData;

    console.log(`Detail Room Selected: ${JSON.stringify(roomDetails, null, 2)}`)

    // console.log(`Debug Selected Room: ${JSON.stringify(totalRooms, null, 2)}`)

    const payment = async () => {
        try {

            try {
                const responseBooking = await axiosInstance.post('/payment/create-booking', {
                    hotelId,
                    roomIds,
                    checkInDate,
                    checkOutDate,
                    roomDetails,
                    totalPrice
                });
                if (responseBooking.data && responseBooking.data.message) {
                    // console.log(JSON.stringify(responseBooking.data.reservation))
                }
            } catch (err) {
                console.log(err)
            }

            console.log(roomIds)


            // const responsePayment = await axiosInstance.post('/payment/create-payment-link', {
            //     amount: totalPrice,
            //     rooms: roomDetails,
            //     hotelId: hotelId,
            //     roomIds: roomIds
            // });

            // // Redirect in frontend
            // window.location.href = responsePayment.data.checkoutUrl;
        } catch (error) {
            console.error("Payment error:", error);
        }
    };

    return (
        <>
            <CustomNavbar />
            <div className="container-fluid mt-3">
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
                                    <label style={{ fontSize: '14px' }}>First name</label>
                                    <div class="input-group mb-3">
                                        <input type="text" class="form-control" placeholder="" aria-label="Username" aria-describedby="basic-addon1" />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <label style={{ fontSize: '14px' }}>Last name</label>
                                    <div class="input-group mb-3">
                                        <input type="text" class="form-control" placeholder="" aria-label="Username" aria-describedby="basic-addon1" />
                                    </div>
                                </div>
                            </div>
                            <div className="row px-2">
                                <div className="col-md-6">
                                    <label style={{ fontSize: '14px' }}>Email address</label>
                                    <div class="input-group mb-3">
                                        <input type="text" class="form-control" placeholder="" aria-label="Username" aria-describedby="basic-addon1" />
                                    </div>
                                    <p className="mt-0" style={{ fontSize: '12px' }}>Confirmation email goes to this address</p>
                                </div>
                            </div>
                            <div className="row px-2">
                                <div className="col-md-6">
                                    <label style={{ fontSize: '14px' }}>Country/region</label>
                                    <div className="input-group mb-3">
                                        <select className="form-control">
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
                                    <label style={{ fontSize: '14px' }}>Phone number</label>
                                    <div className="row">
                                        <div className="col-md-4">
                                            <div class="input-group mb-3">
                                                <input type="text" class="form-control" value={"VN+84"} aria-describedby="basic-addon1" />
                                            </div>
                                        </div>
                                        <div className="col-md-8">
                                            <div class="input-group mb-3">
                                                <input type="text" class="form-control" placeholder="" aria-label="Username" aria-describedby="basic-addon1" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                    <div className="col-md-4">
                        <Card className="rounded">
                            <Card.Title className="px-2 mt-2 fs-6">Hotel {renderStarIcon(currentHotel.rating)}</Card.Title>
                            <Card.Title className="fw-bold px-2" style={{ fontSize: '16px' }}>{currentHotel.hotelName}</Card.Title>
                            <Card.Text className="px-2" style={{
                                display: '-webkit-box',
                                WebkitBoxOrient: 'vertical',
                                WebkitLineClamp: 2,
                                overflow: 'hidden',
                            }}>{currentHotel.address}</Card.Text>
                            <Card.Text className="px-2 text-success">Excellent location - {currentHotel.rating}</Card.Text>
                            <div className="d-flex align-items-center px-2 mb-2">
                                <Card style={{ backgroundColor: '#003b95' }}>
                                    <Card.Text className="px-2 py-1 text-light text-center">{currentHotel.rating}</Card.Text>
                                </Card>
                                <span className="fw-bold px-3 fs-6">{RatingConsider(currentHotel.rating)}</span>
                            </div>
                        </Card>
                        <Card className="mt-2">

                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BookingStepTwo;