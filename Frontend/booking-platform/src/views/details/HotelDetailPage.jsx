import React, { useEffect, useState } from "react";
import { data, useParams, useSearchParams } from "react-router-dom";
import CustomNavbar from "../../components/navbar/CustomNavbar";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import axios from "axios";
import { BASE_URL } from "../../utils/Constant";
import { Container, Image, Spinner, Button } from "react-bootstrap"; // Thêm Spinner từ Bootstrap
import Booking from "../../views/booking/BookingPage";
import CustomInput from "../../components/input/CustomInput";

const dataFacility = [
   "Wi-Fi miễn phí",
   "Hồ bơi",
   "Bãi đỗ xe",
   "Dịch vụ phòng 24/7",
   "Nhà hàng",
   "Trung tâm thể hình"
]

export const HotelDetailPage = () => {
   const [currentHotel, setCurrentHotel] = useState(null);
   const [error, setError] = useState("");
   const [loading, setLoading] = useState(true);
   const [listFeedback, setListFeedback] = useState([]);
   const [showModal, setShowModal] = useState(false);
   const [selectedImage, setSelectedImage] = useState('')

   const { id } = useParams();
   const [open, setOpen] = useState(false);
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
      setLoading(true)
      try {
         const response = await axios.get(`${BASE_URL}/hotel/get-hotel-detail/${id}`);
         if (response.data && response.data.hotel) {
            setCurrentHotel(response.data.hotel);
            setError("");
         }
      } catch (err) {
         if (err.response && err.response.message) {
            setError(err.response.message);
            setLoading(false)
         }
      } finally {
         setTimeout(() => {
            setLoading(false);
         }, 1000);
      }
   };

   const getFeedbackByHotelId = async () => {
      try {
         const response = await axios.get(`${BASE_URL}/feedback/get-feedback-hotel/${id}`);
         if (response.data && response.data.listFeedback) {
            setListFeedback(response.data.listFeedback);
            setError("");
         }
      } catch (err) {
         if (err.response && err.response.message) {
            setError(err.response.message);
         }
      }
   };

   const handleShowModalImage = (image) => {
      setSelectedImage(image);
      setShowModal(true);
   }

   const handleCloseModal = () => {
      setShowModal(false);
   }

   useEffect(() => {
      getCurrentHotelDetail();
      getFeedbackByHotelId();
   }, []);

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
               <Container fluid className="p-5">
                  <motion.h2
                     className="mt-5 fw-bolder"
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     transition={{ duration: 1 }}
                  >
                     {currentHotel?.hotelName}
                  </motion.h2>
                  <p className="">
                     <MdLocationPin style={{ color: '#6499E9' }} /> {currentHotel.address} -
                     <span className="fw-bold" style={{ color: '#6499E9' }}>Best Position</span> -
                     <span className="fw-bold" style={{ color: '#6499E9' }}>Show on Map</span>
                  </p>

                  <Row>
                     <Col xs={10} className="">
                        {currentHotel?.images?.length > 0 ? (
                           <>
                              <motion.div
                                 className="d-flex justify-content-center"
                                 style={{ marginBottom: '20px' }}
                                 initial={{ scale: 0 }}
                                 animate={{ scale: 1 }}
                                 transition={{ duration: 0.8 }}
                              >
                                 <Card className="w-100 p-2">
                                    {loading ? (
                                       <Placeholder as="div" animation="glow">
                                          <Placeholder xs={12} style={{ height: '400px', backgroundColor: '#ddd' }} />
                                       </Placeholder>
                                    ) : (
                                       <Image
                                          src={currentHotel.images[0]}
                                          className="img-fluid rounded"
                                          style={{
                                             objectFit: 'cover',
                                             width: '100%',
                                             maxHeight: '400px',
                                             borderRadius: '10px',
                                             transition: 'transform 0.3s',
                                          }}
                                          onError={(e) => (e.target.src = '/fallback-image.jpg')}
                                          onClick={() => handleShowModalImage(currentHotel.images[0])}
                                       />
                                    )}
                                 </Card>
                              </motion.div>

                              <Row>
                                 <Card className="p-2 border-none">
                                    <Swiper
                                       slidesPerView={4}
                                       spaceBetween={5}
                                    >
                                       {currentHotel.images.map((item, index) => (
                                          <SwiperSlide key={index}>
                                             <div className="d-flex justify-content-center">
                                                <motion.div
                                                   whileHover={{ scale: 1.02 }}
                                                   className="img-container"
                                                >
                                                   {loading
                                                      ? (
                                                         <Placeholder as="div" animation="glow">
                                                            <Placeholder xs={12} style={{ height: '400px', backgroundColor: '#ddd' }} />
                                                         </Placeholder>
                                                      )
                                                      : (
                                                         <Image
                                                            src={item}
                                                            className="img-fluid"
                                                            style={{
                                                               objectFit: 'cover',
                                                               width: '100%',
                                                               marginBottom: '10px',
                                                               borderRadius: '5px',
                                                            }}
                                                            onError={(e) => (e.target.src = '/fallback-image.jpg')}
                                                            onClick={() => handleShowModalImage(item)}
                                                         />
                                                      )
                                                   }
                                                </motion.div>
                                             </div>
                                          </SwiperSlide>
                                       ))}
                                    </Swiper>
                                 </Card>
                              </Row>
                           </>
                        ) : (
                           <p>No images available</p>
                        )}
                     </Col>

                     <Col>
                        <Card>
                           <ListGroup>
                              <ListGroupItem className="d-flex justify-content-end align-items-center">
                                 {RatingConsider(currentHotel.rating)}
                                 <div className="d-flex justify-content-center align-items-center mx-1 rounded" style={{ width: '40px', height: '30px', backgroundColor: '#003b95' }}>
                                    <p className="m-0 p-0 text-center text-light">{currentHotel.rating}</p>
                                 </div>
                              </ListGroupItem>
                           </ListGroup>
                           <Card.Body>
                              <Card.Text className="fw-bold">Visitors like what?</Card.Text>
                              <Carousel indicators={false} interval={5000}>
                                 {listFeedback.map((feedback) => (
                                    <Carousel.Item key={feedback.id}>
                                       <div className="row justify-content-center text-center mb-3">
                                          <h6 className="mb-1">"{feedback.content}"</h6>
                                          <Rating rating={feedback.rating} />
                                       </div>
                                       <div className="d-flex justify-content-center align-items-center">
                                          <img
                                             src={feedback.user.avatar}
                                             alt={feedback.user.name}
                                             className="rounded-circle me-2"
                                             style={{ width: "40px", height: "40px" }}
                                          />
                                          <p className="align-content-center" style={{ fontSize: '12px' }}>{feedback.user.name}</p>
                                       </div>
                                    </Carousel.Item>
                                 ))}
                              </Carousel>
                           </Card.Body>
                        </Card>
                     </Col>
                  </Row>

                  <Row className="m-0 p-0 mt-4">
                     <Col xs={10}>
                        <Row>
                           {dataFacility.map((item, index) => {
                              return (
                                 <Col className="mb-5" xs={2}>
                                    <Card className="card-facility">
                                       <Card.Text style={{ fontSize: 14 }} className="text-center p-2 fw-bold">{item}</Card.Text>
                                    </Card>
                                 </Col>
                              )
                           })}
                        </Row>
                     </Col>
                  </Row>

                  <Row>
                     <p><span className="text-decoration-underline text-primary fw-bold">Legit Information: </span> Khách nói rằng mô tả và hình ảnh chỗ nghỉ này rất đúng với sự thật.</p>
                     <p>
                        {`Với ${dataFacility[0]} và ${dataFacility[1]}, ${currentHotel.hotelName} tọa lạc ở 

                        Căn hộ điều hòa này có 1 phòng ngủ, phòng khách, bếp đầy đủ tiện nghi với tủ lạnh và máy pha cà phê, 2 phòng tắm với vòi sen và máy sấy tóc. Khăn tắm và ga trải giường có sẵn ở căn hộ.

                        Các điểm tham quan nổi tiếng gần căn hộ bao gồm Vườn Turia Gardens, Vườn Jardines de Monforte và Bảo tàng Gốm sứ và Nghệ thuật Trang trí Quốc gia González Martí. Sân bay Valencia cách 9 km.

                        Các cặp đôi đặc biệt thích địa điểm này — họ cho điểm ${currentHotel.rating} khi đánh giá chuyến đi hai người.`}
                     </p>
                     <p className="text-muted">Các khoảng cách nêu trong mô tả chỗ nghỉ được tính toán bằng © OpenStreetMap</p>
                     <p className="fw-bolder">Các tiện nghi được ưu chuộng nhất</p>
                  </Row>

                  <Row className="m-0 p-0 mt-4">
                     {amenities.map((item, index) => {
                        return (
                           <Col className="mb-5" xs={2}>
                              <Card className="card-facility">
                                 <Card.Text style={{ fontSize: 14 }} className="text-center p-2 fw-bold">{item.icon} {item.text}</Card.Text>
                              </Card>
                           </Col>
                        )
                     })}

                     <Modal show={showModal} onHide={handleCloseModal} centered size="lg">
                        <Modal.Body>
                           <Image
                              src={selectedImage}
                              alt="Selected Image"
                              className="img-fluid"
                              style={{ objectFit: 'cover', width: '100%', borderRadius: '10px' }}
                           />
                        </Modal.Body>
                     </Modal>

                  </Row>

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
               />
            </>
         )}
      </>
   );
};
