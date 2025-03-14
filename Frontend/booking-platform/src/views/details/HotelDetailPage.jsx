import React, { useEffect, useState } from "react";
import { data, useParams, useSearchParams } from "react-router-dom";
import CustomNavbar from "../../components/navbar/CustomNavbar";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import axios from "axios";
import { BASE_URL } from "../../utils/Constant";
import { Card, Col, Container, Image, ListGroup, ListGroupItem, Row, Spinner, Carousel, Modal, Placeholder, ProgressBar } from "react-bootstrap";
import { MdLocationPin } from "react-icons/md";
import "swiper/css/navigation";
import Rating from "../../components/animation/HotelRating";
import { animate, motion } from "framer-motion"; // Thêm framer-motion cho hiệu ứng chuyển động
import './HotelDetailPage.css'
import { RatingConsider } from "../../utils/RatingConsider";
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

const amenities = [
   { icon: "🚭", text: "Phòng không hút thuốc" },
   { icon: "📶", text: "WiFi nhanh miễn phí (414 Mbps)" },
   { icon: "🅿️", text: "Chỗ đỗ xe miễn phí" },
   { icon: "🔥", text: "Hệ thống sưởi" },
   { icon: "❄️", text: "Điều hòa nhiệt độ" },
];


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
   const [capacityError, setCapacityError] = useState('');
   const [availabilityError, setAvailabilityError] = useState('');
   const [userId, setUserId] = useState(null); // State to store userId

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
            className={`form-control ${error ? 'is-invalid' : ''} rounded-0 p-3`}
         />
         {error && <div className="error-message">{error}</div>}
      </div>
   );

   //Get Current Hotel
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
         }, 100);
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
         initialCheckOut = initialCheckOut.toString().split('T')[0];
      }

      setCheckInDate(initialCheckIn);
      setCheckOutDate(initialCheckOut);
      setNumberOfPeople(parseInt(searchParams.get('guests')) || 1);

   }, [searchParams]);

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
         {loading ? (
            <div className="text-center mt-5">
               <Spinner animation="border" variant="primary" />
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
                     <Col xs={10}>
                        {currentHotel?.images?.length > 0 ? (
                           <>
                              {/* Ảnh chính lớn */}
                              <motion.div
                                 className="d-flex justify-content-center"
                                 style={{ marginBottom: '20px' }}
                                 initial={{ scale: 0 }}
                                 animate={{ scale: 1 }}
                                 transition={{ duration: 0.8 }}
                              >
                                 <Card className="w-100 p-2 shadow-lg">
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
                                             height: '400px',
                                             borderRadius: '10px',
                                             transition: 'transform 0.3s',
                                          }}
                                          onError={(e) => (e.target.src = '/fallback-image.jpg')}
                                          onClick={() => handleShowModalImage(currentHotel.images[0])}
                                       />
                                    )}
                                 </Card>
                              </motion.div>

                              {/* Grid ảnh phụ */}
                              <Row className="g-2">
                                 {currentHotel.images.slice(1, 5).map((item, index) => (
                                    <Col key={index} xs={6} md={3}>
                                       <motion.div whileHover={{ scale: 1.05 }}>
                                          {loading ? (
                                             <Placeholder as="div" animation="glow">
                                                <Placeholder xs={12} style={{ height: '120px', backgroundColor: '#ddd' }} />
                                             </Placeholder>
                                          ) : (
                                             <Image
                                                src={item}
                                                className="img-fluid rounded shadow-sm"
                                                style={{
                                                   objectFit: 'cover',
                                                   width: '100%',
                                                   height: '120px',
                                                   borderRadius: '8px',
                                                }}
                                                onError={(e) => (e.target.src = '/fallback-image.jpg')}
                                                onClick={() => handleShowModalImage(item)}
                                             />
                                          )}
                                       </motion.div>
                                    </Col>
                                 ))}
                              </Row>

                              {/* Carousel ảnh mở rộng */}
                              {currentHotel.images.length > 5 && (
                                 <Card className="p-2 border-0 mt-4">
                                    <Swiper slidesPerView={4} spaceBetween={10} loop={true}>
                                       {currentHotel.images.slice(5).map((item, index) => (
                                          <SwiperSlide key={index}>
                                             <motion.div whileHover={{ scale: 1.02 }}>
                                                {loading ? (
                                                   <Placeholder as="div" animation="glow">
                                                      <Placeholder xs={12} style={{ height: '100px', backgroundColor: '#ddd' }} />
                                                   </Placeholder>
                                                ) : (
                                                   <Image
                                                      src={item}
                                                      className="img-fluid rounded"
                                                      style={{
                                                         objectFit: 'cover',
                                                         width: '100%',
                                                         height: '100px',
                                                         borderRadius: '5px',
                                                      }}
                                                      onError={(e) => (e.target.src = '/fallback-image.jpg')}
                                                      onClick={() => handleShowModalImage(item)}
                                                   />
                                                )}
                                             </motion.div>
                                          </SwiperSlide>
                                       ))}
                                    </Swiper>
                                 </Card>
                              )}
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
                                 <Card
                                    style={{ backgroundColor: '#003b95' }}
                                    className="mx-2">
                                    <Card.Text className="px-3 py-2 text-center text-light">{currentHotel.rating}</Card.Text>
                                 </Card>
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
                                 <Col className="mb-5" xs={2} key={index}>
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

                        ${currentHotel.description}. Khăn tắm và ga trải giường có sẵn ở căn hộ.

                        Các điểm tham quan nổi tiếng gần căn hộ bao gồm Vườn Turia Gardens, Vườn Jardines de Monforte và Bảo tàng Gốm sứ và Nghệ thuật Trang trí Quốc gia González Martí. Sân bay Valencia cách 9 km.

                        Các cặp đôi đặc biệt thích địa điểm này — họ cho điểm ${currentHotel.rating} khi đánh giá chuyến đi hai người.`}
                     </p>
                     <p className="text-muted">Các khoảng cách nêu trong mô tả chỗ nghỉ được tính toán bằng © OpenStreetMap</p>
                     <p className="fw-bolder">Các tiện nghi được ưu chuộng nhất</p>
                  </Row>

                  <Row className="m-0 p-0 mt-4">
                     {amenities.map((item, index) => {
                        return (
                           <Col className="mb-5" xs={2} key={index}>
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
                           value={checkInDate}
                           min={new Date().toISOString().split('T')[0]}
                           onChange={(e) => handleDateChange('checkin', e.target.value)}
                           error={dateErrors.checkIn}
                        />
                     </div>
                     <div className="col-md-3">
                        <CustomDateValidator
                           type="date"
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
                              const value = Math.max(1, Math.min(currentHotel?.capacity || 16, e.target.value));
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
                  currentHotel={currentHotel}
                  listFeedback={listFeedback}
               />


               <h2 className="px-5 fw-bolder">Đánh giá của khách hàng</h2>
               <h4 className="px-5 fw-bold mt-3">Hạng mục</h4>

               <p className="fw-bold px-5 mb-1">Đánh giá 5 {"(⭐)"} {listFeedback.length}<span className="text-muted"> total feedback</span></p>
               <ProgressBar className="mx-5" variant="primary" now={60} />

               <p className="fw-bold px-5 mb-1">Đánh giá 4 {"(⭐)"} </p>
               <ProgressBar className="mx-5" variant="primary" now={50} />

               <p className="fw-bold px-5 mb-1">Đánh giá 3 {"(⭐)"} </p>
               <ProgressBar className="mx-5" variant="primary" now={40} />

               <p className="fw-bold px-5 mb-1">Đánh giá 2 {"(⭐)"} </p>
               <ProgressBar className="mx-5" variant="primary" now={30} />

               <p className="fw-bold px-5 mb-1">Đánh giá 1 {"(⭐)"} </p>
               <ProgressBar className="mx-5" variant="primary" now={10} />

               <br></br>

               <h4 className="px-5 fw-bold mt-3">Khách lưu trú ở đây thích nhất điều gì ?</h4>
               <div className="d-flex align-items-center px-5">
                  <Card style={{ backgroundColor: '#003b95' }}>
                     <Card.Text className="px-3 py-2 text-light text-center">{currentHotel.rating}</Card.Text>
                  </Card>
                  <span className="fw-bold px-3 fs-6"> ▪️ {RatingConsider(currentHotel.rating)} ▪️ {listFeedback.length} real reviews</span>
                  <a className="align-content-center text-primary text-decoration-underline cursor-pointer"><span>Read all reviews</span></a>
               </div>
               <Swiper
                  navigation={true}
                  allowSlideNext={true}
                  pagination={true}
                  slidesPerView={3}
                  spaceBetween={10}
                  className="mt-4"
               >
                  {listFeedback.length > 0
                     ? (listFeedback.map((item, index) => {
                        return (
                           <SwiperSlide>
                              <Card className="w-75 mb-5" key={index}>
                                 <Card.Header className="border">
                                    <div className="d-flex flex-row align-items-center">
                                       <Image
                                          variant="top"
                                          className="img-fluid rounded-circle"
                                          style={{ width: '50px', height: '50px' }}
                                          src={item.user.avatar}
                                          alt={item.user.name}
                                       />
                                       <div className="mx-3">
                                          <Card.Title className="mb-2 fw-bold">{item.user.name}</Card.Title>
                                          <Card.Subtitle><Rating rating={item.rating} /></Card.Subtitle>
                                       </div>
                                    </div>
                                 </Card.Header>
                                 <Card.Body>
                                    <Card.Text>"{item.content}"</Card.Text>
                                 </Card.Body>
                              </Card>

                           </SwiperSlide>
                        )
                     }))
                     : <p className="px-5 alert text-center alert-warning">No have any feedback about {currentHotel.hotelName}</p>
                  }
               </Swiper>
            </>
         )}
      </>
   );
};
