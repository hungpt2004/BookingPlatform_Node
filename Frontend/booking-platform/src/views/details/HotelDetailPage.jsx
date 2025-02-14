import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import CustomNavbar from "../../components/navbar/CustomNavbar";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import axios from "axios";
import { BASE_URL } from "../../utils/Constant";
import { Container, Image, Spinner, Button } from "react-bootstrap"; // Thêm Spinner từ Bootstrap
import Booking from "../../views/booking/BookingPage";
import CustomInput from "../../components/input/CustomInput";

export const HotelDetailPage = () => {
    const [currentHotel, setCurrentHotel] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true); // Thêm state loading
    const [open, setOpen] = useState(false);

    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const [checkInDate, setCheckInDate] = useState('');
    const [checkOutDate, setCheckOutDate] = useState('');
    const [numberOfPeople, setNumberOfPeople] = useState(1);
    const [dateErrors, setDateErrors] = useState({ checkIn: '', checkOut: '' });
    // Add these new states at the top of HotelDetailPage
    const [capacityError, setCapacityError] = useState('');
    const [availabilityError, setAvailabilityError] = useState('');
    const [userId, setUserId] = useState(null); // State to store userId
    const [validDate, setValidDate] = useState(true); // State to store date validity

    // Add this function to handle the search validation
    const handleSearch = async () => {
        setCapacityError('');
        setAvailabilityError('');
        if (!checkInDate || !checkOutDate) {
            setAvailabilityError('Please select both check-in and check-out dates');
            return;
        }
        // Validate capacity
        if (numberOfPeople > currentHotel?.capacity) {
            setCapacityError(`This hotel only accommodates up to ${currentHotel?.capacity} guests`);
            return;
        }

        // Validate dates are logical
        if (new Date(checkOutDate) <= new Date(checkInDate)) {
            setAvailabilityError('Check-out date must be after check-in date');
            return;
        }
    };


    // Add this useEffect to handle date parameters
    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowString = tomorrow.toISOString().split('T')[0];

        const initialCheckIn = searchParams.get('checkin') || today;
        let initialCheckOut = searchParams.get('checkout') || tomorrowString;

        // Handle date dependencies
        if (!searchParams.get('checkin') && searchParams.get('checkout')) {
            initialCheckOut = searchParams.get('checkout');
            if (new Date(initialCheckOut) < new Date(today)) {
                initialCheckOut = tomorrowString;
            }
        }

        if (new Date(initialCheckOut) <= new Date(initialCheckIn)) {
            initialCheckOut = new Date(initialCheckIn);
            initialCheckOut.setDate(initialCheckOut.getDate() + 1);
            initialCheckOut = initialCheckOut.toISOString().split('T')[0];
        }

        setCheckInDate(initialCheckIn);
        setCheckOutDate(initialCheckOut);
        setNumberOfPeople(parseInt(searchParams.get('guests')) || 1);

    }, [searchParams]);

    // Add the search bar components
    const handleDateChange = (type, value) => {
        const today = new Date().toISOString().split('T')[0];
        const newErrors = { ...dateErrors };

        if (type === 'checkin') {
            if (value < today) {
                newErrors.checkIn = 'Check-in date cannot be in the past';
            } else {
                newErrors.checkIn = '';
            }
            setCheckInDate(value);
            if (checkOutDate && value > checkOutDate) {
                setCheckOutDate('');
            }
        }

        if (type === 'checkout') {
            if (value < today) {
                newErrors.checkOut = 'Check-out date cannot be in the past';
            } else if (checkInDate && value < checkInDate) {
                newErrors.checkOut = 'Check-out cannot be before check-in';
            } else if (checkOutDate && value === checkInDate) {
                newErrors.checkOut = 'Check-out cannot be same date as check-in';
            } else {
                newErrors.checkOut = '';
            }
            setCheckOutDate(value);
        }

        setDateErrors(newErrors);
    };

    const CustomDateValidator = ({ label, error, ...props }) => (
        <div className="mb-0">
            {label && <label className="form-label">{label}</label>}
            <input
                {...props}
                className={`form-control ${error ? 'is-invalid' : ''}`}
            />
            {error && <div className="error-message">{error}</div>}
        </div>
    );


    const getCurrentHotelDetail = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/hotel/get-hotel-detail/${id}`);
            console.log(response.data);
            if (response.data && response.data.hotel) {
                setCurrentHotel(response.data.hotel);
                setUserId(response.data.userId);
                setError("");
            }
        } catch (err) {
            if (err.response && err.response.message) {
                setError(err.response.message);
            }
        } finally {
            setLoading(false); // Khi dữ liệu load xong, tắt loading
        }
    };

    useEffect(() => {
        getCurrentHotelDetail();
    }, []);


    // console.log(`Dữ liệu hotel : ${currentHotel}`);
    // console.log(`ID khách sạn : ${id}`);
    console.log(`Dữ liệu currentHotel?.capacity : ${currentHotel?.capacity}`);
    // Log every property of currentHotel once it's set
    useEffect(() => {
        if (currentHotel) {
            console.log("Current Hotel object details:");
            for (const key in currentHotel) {
                if (Object.hasOwnProperty.call(currentHotel, key)) {
                    console.log(`${key}:`, currentHotel[key]);
                }
            }
        }
    }, [currentHotel]);

    return (
        <>
            <CustomNavbar />

            {/* Hiển thị loading khi đang tải dữ liệu */}
            {loading ? (
                <div className="text-center mt-5">
                    <Spinner animation="border" variant="primary" />
                    <p>Loading hotel details...</p>
                </div>
            ) : error ? (
                <p className="text-danger">{error}</p>
            ) : (
                <>
                    <Container fluid>
                        <h2 className="px-5 mt-5 fw-bolder ">{currentHotel?.hotelName}</h2>
                        <p className="px-5 ">{currentHotel.address} - <span className="text-de">Best Postition</span> - <span>Show on Map</span></p>
                        {/* Swiper chỉ hiển thị khi currentHotel có dữ liệu */}
                        {currentHotel?.images?.length > 0 ? (
                            <Swiper
                                className="px-5"
                                slidesPerView={1}
                                autoplay={true}
                                onSlideChange={() => console.log('slide change')}
                                onSwiper={(swiper) => console.log(swiper)}
                            >
                                {currentHotel.images.map((item, index) => (
                                    <div key={index} className="d-flex justify-content-center">
                                        <Image
                                            src={item}
                                            className="img-fluid rounded"
                                            style={{
                                                objectFit: 'cover',
                                                width: '100%',
                                                maxHeight: '400px',
                                                borderRadius: '10px',
                                            }}
                                            onError={(e) => (e.target.src = '/fallback-image.jpg')}
                                        />
                                    </div>
                                ))}
                            </Swiper>
                        ) : (
                            <p>No images available</p>
                        )}
                    </Container>
                    <div className="container mt-4">
                        <div className="row g-3 justify-content-center">
                            <div className="col-md-3">
                                <CustomDateValidator
                                    type="date"
                                    label="CHECK IN DATE"
                                    value={checkInDate}
                                    min={new Date().toISOString().split('T')[0]}
                                    onChange={(e) => handleDateChange('checkin', e.target.value)}
                                    error={dateErrors.checkIn}
                                />
                            </div>
                            <div className="col-md-3">
                                <CustomDateValidator
                                    type="date"
                                    label="CHECK OUT DATE"
                                    value={checkOutDate}
                                    min={checkInDate || new Date().toISOString().split('T')[0]}
                                    onChange={(e) => handleDateChange('checkout', e.target.value)}
                                    error={dateErrors.checkOut}
                                />
                            </div>
                            <div className="col-md-2">
                                <CustomInput
                                    type="number"
                                    label="GUESTS"
                                    placeHolder="Number of guests"
                                    value={numberOfPeople}
                                    min={1}
                                    onChange={(e) => {
                                        const value = Math.max(1, Math.min(100, e.target.value));
                                        setNumberOfPeople(value);
                                    }}
                                />
                            </div>
                            <div className="row justify-content-center mt-2">
                                <div className="col-md-8">
                                    {capacityError && <div className="alert alert-danger">{capacityError}</div>}
                                    {availabilityError && <div className="alert alert-danger">{availabilityError}</div>}
                                </div>
                            </div>

                        </div>

                    </div>
                    <Booking
                        setOpen={setOpen}
                        hotelId={id}
                        checkInDate={checkInDate}
                        checkOutDate={checkOutDate}
                        numberOfPeople={numberOfPeople}
                        userId={userId}
                        key={`${checkInDate}-${checkOutDate}-${numberOfPeople}`} // Add key to force re-render
                        isValidDate={validDate}
                    />
                </>
            )}
        </>
    );
};
