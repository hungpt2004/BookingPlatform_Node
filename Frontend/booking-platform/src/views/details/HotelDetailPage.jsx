import { useEffect, useState } from "react";
import { data, useParams, useSearchParams } from "react-router-dom";
import CustomNavbar from "../../components/navbar/CustomNavbar";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import axios from "axios";
import { BASE_URL } from "../../utils/Constant";
import { Button, Card, Col, Container, Image, ListGroup, ListGroupItem, Row, Spinner, Carousel, Modal, Placeholder, ProgressBar, Alert, Form } from "react-bootstrap";
import { MdLocationPin } from "react-icons/md";
import "swiper/css/navigation";
import Rating from "../../components/animation/HotelRating";
import { animate, motion } from "framer-motion"; // Thêm framer-motion cho hiệu ứng chuyển động
import './HotelDetailPage.css'
import { RatingConsider } from "../../utils/RatingConsider";
import Booking from "../../views/booking/BookingPage";
import CustomInput from "../../components/input/CustomInput";
import './HotelDetailPage.css'
import { FaConciergeBell } from "react-icons/fa";
import { FaImages } from "react-icons/fa";
import { FaMapMarkerAlt, FaCommentAlt, FaStar, FaInfoCircle, FaCalendarCheck, FaImage } from "react-icons/fa";
import axiosInstance from "../../utils/AxiosInstance";
import FavoriteToggle from "./FavoriteToggle";

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
   const [capacityError, setCapacityError] = useState('');
   const [availabilityError, setAvailabilityError] = useState('');
   const [userId, setUserId] = useState(null); // State to store userId
   const [showGalleryModal, setShowGalleryModal] = useState(false);
   const [listFacility, setListFacility] = useState([]);
   const [listService, setListService] = useState([]);
   const [validDate, setValidDate] = useState(true); // State to store date validity
   const [checkInTime, setCheckInTime] = useState('12:00');
   const [checkOutTime, setCheckOutTime] = useState('13:00');
   const [timeErrors, setTimeErrors] = useState({
      checkIn: '',
      checkOut: ''
   });


   const validateTimes = (checkInTime, checkOutTime) => {
      const errors = { checkIn: '', checkOut: '' };

      const [checkInHours, checkInMinutes] = checkInTime.split(':').map(Number);
      const [checkOutHours, checkOutMinutes] = checkOutTime.split(':').map(Number);

      const checkInTotal = checkInHours * 60 + checkInMinutes;
      const checkOutTotal = checkOutHours * 60 + checkOutMinutes;

      if (checkOutTotal <= checkInTotal) {
         errors.checkOut = 'Check-out time must be after check-in time when dates are the same';
      }

      return errors;
   };

   // Add this useEffect for time validation
   useEffect(() => {
      const errors = validateTimes(checkInTime, checkOutTime);
      setTimeErrors(errors);
   }, [checkInTime, checkOutTime]);

   //Show all image in modal
   const handleShowGalleryModal = () => setShowGalleryModal(true);
   const handleCloseGalleryModal = () => setShowGalleryModal(false);


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

   // Toggle favorite function
   const toggleFavorite = async (hotelId) => {
      try {
         if (favorites.includes(hotelId)) {
            // Remove from favorites
            await axiosInstance.delete('/favorite/remove-favorite', {
               data: { hotelId }
            });
            setFavorites(favorites.filter(id => id !== hotelId));
         } else {
            // Add to favorites
            await axiosInstance.post('/favorite/add-favorite', { hotelId });
            setFavorites([...favorites, hotelId]);
         }
      } catch (error) {
         console.error('Error toggling favorite:', error);
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

      const getCurrentHotelDetail = async () => {
         setLoading(true)
         try {
            const response = await axios.get(`${BASE_URL}/hotel/get-hotel-detail/${id}`);
            if (response.data && response.data.hotel) {
               setCurrentHotel(response.data?.hotel);
               setListFacility(response.data.hotel?.facilities);
               setListService(response.data.hotel?.services);
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

      //Close modal 1 image
      const handleCloseModal = () => {
         setShowModal(false);
      }

      //Effect load Hotel and Feedback
      useEffect(() => {
         getCurrentHotelDetail();
         getFeedbackByHotelId();
      }, []);

      //Render hotel check in , check out
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

      //Render hotel detail
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
               null
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

                     <Row className="mt-4">
                        {/* Phần hình ảnh - chiếm 60% */}
                        <Col lg={6} md={12}>
                           {currentHotel?.images?.length > 0 ? (
                              <div className="hotel-gallery">
                                 {/* Ảnh chính lớn */}
                                 <motion.div
                                    className="main-image-container mb-3"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.5 }}
                                 >
                                    {loading ? (
                                       <Placeholder as="div" animation="glow">
                                          <Placeholder xs={12} style={{ height: '350px', backgroundColor: '#eee', borderRadius: '12px' }} />
                                       </Placeholder>
                                    ) : (
                                       <Image
                                          src={currentHotel.images[0]}
                                          className="main-hotel-image"
                                          style={{
                                             objectFit: 'cover',
                                             width: '100%',
                                             height: '350px',
                                             borderRadius: '12px',
                                             boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                                             transition: 'transform 0.3s',
                                             cursor: 'pointer'
                                          }}
                                          onError={(e) => (e.target.src = '/fallback-image.jpg')}
                                          onClick={() => handleShowModalImage(currentHotel.images[0])}
                                       />
                                    )}
                                 </motion.div>

                                 {/* Grid ảnh phụ */}
                                 <Row className="g-2 thumbnail-container">
                                    {currentHotel.images.slice(1, 5).map((item, index) => (
                                       <Col key={index} xs={3}>
                                          <motion.div
                                             className="thumbnail-wrapper"
                                             whileHover={{ scale: 1.05 }}
                                             transition={{ duration: 0.2 }}
                                          >
                                             {loading ? (
                                                <Placeholder as="div" animation="glow">
                                                   <Placeholder xs={12} style={{ height: '80px', backgroundColor: '#eee', borderRadius: '8px' }} />
                                                </Placeholder>
                                             ) : (
                                                <Image
                                                   src={item}
                                                   className="thumbnail-image"
                                                   style={{
                                                      objectFit: 'cover',
                                                      width: '100%',
                                                      height: '80px',
                                                      borderRadius: '8px',
                                                      boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                                                      cursor: 'pointer'
                                                   }}
                                                   onError={(e) => (e.target.src = '/fallback-image.jpg')}
                                                   onClick={() => handleShowModalImage(item)}
                                                />
                                             )}
                                          </motion.div>
                                       </Col>
                                    ))}
                                 </Row>

                                 {/* Xem thêm ảnh */}
                                 {currentHotel.images.length > 5 && (
                                    <div className="more-images mt-3">
                                       <Button
                                          variant="outline-primary"
                                          size="sm"
                                          className="view-more-images" onClick={handleShowGalleryModal}
                                       >
                                          <FaImages className="me-1" />
                                          View all {currentHotel.images.length} photos
                                       </Button>
                                    </div>
                                 )}

                                 <Modal show={showGalleryModal} onHide={handleCloseGalleryModal} size="lg" centered>
                                    <Modal.Header closeButton>
                                       <Modal.Title>All Photos</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                       <Row className="g-2">
                                          {currentHotel.images.map((img, index) => (
                                             <Col key={index} xs={6} md={4} lg={3}>
                                                <Image
                                                   src={img}
                                                   style={{
                                                      width: "100%",
                                                      height: "150px",
                                                      objectFit: "cover",
                                                      borderRadius: "8px",
                                                      cursor: "pointer",
                                                   }}
                                                   onClick={() => window.open(img, "_blank")}
                                                />
                                             </Col>
                                          ))}
                                       </Row>
                                    </Modal.Body>
                                 </Modal>;

                              </div>
                           ) : (
                              <div className="no-images-container p-5 text-center bg-light rounded">
                                 <FaImage size={40} className="text-secondary mb-3" />
                                 <p className="text-secondary">No images available</p>
                              </div>
                           )}

                        </Col>

                        {/* Phần thông tin chi tiết - chiếm 40% */}
                        <Col lg={6} md={12}>
                           <Card className="hotel-details-card h-100 border-0 shadow-sm">
                              <Card.Header className="bg-white border-bottom-0 pt-3">
                                 <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h3 className="hotel-name mb-0">{currentHotel?.hotelName}</h3>
                                    <div className="d-flex align-items-center">
                                       <div className="rating-label me-2">
                                          {RatingConsider(currentHotel?.rating)}
                                       </div>
                                       <div className="rating-badge" style={{ backgroundColor: '#003b95' }}>
                                          <span className="rating-score">{currentHotel?.rating}</span>
                                       </div>
                                    </div>
                                 </div>
                                 <p className="hotel-location text-secondary mb-0">
                                    <FaMapMarkerAlt className="me-1" />
                                    {currentHotel?.address}
                                 </p>
                              </Card.Header>

                              <Card.Body>
                                 <div className="mb-4">
                                    <h5 className="section-title">
                                       <FaCommentAlt className="me-2" />
                                       Đánh giá của Khách
                                    </h5>
                                    {listFeedback.length <= 0 ? (
                                       <Alert className="alert-warning text-center">No have any feedback</Alert>
                                    ) : (
                                       <div className="reviews-carousel p-2">
                                          <Carousel indicators={false} controls={true} interval={2000}>
                                             {listFeedback.map((feedback) => (
                                                <Carousel.Item key={feedback.id}>
                                                   <div className="review-item p-3">
                                                      <div className="review-content">
                                                         <p className="review-text mb-2">"{feedback.content}"</p>
                                                         <Rating rating={feedback.rating} />
                                                      </div>
                                                      <div className="reviewer d-flex align-items-center mt-3">
                                                         <img
                                                            src={feedback.user.avatar}
                                                            alt={feedback.user.name}
                                                            className="reviewer-avatar rounded-circle me-2"
                                                            style={{ width: "40px", height: "40px", objectFit: "cover" }}
                                                         />
                                                         <p className="reviewer-name mb-0">{feedback.user.name}</p>
                                                      </div>
                                                   </div>
                                                </Carousel.Item>
                                             ))}
                                          </Carousel>
                                       </div>
                                    )}
                                 </div>

                                 <div className="mb-4">
                                    <h5 className="section-title">
                                       <FaStar className="me-2" />
                                       Các tiện ích của khách sạn
                                    </h5>
                                    <Row className="g-2 amenities-container">
                                       {listFacility.slice(0, 6).map((item, index) => (
                                          <Col key={index} xs={6} md={4}>
                                             <div className="amenity-badge p-2 mb-2">
                                                <span className="amenity-text">{item.name}</span>
                                             </div>
                                          </Col>
                                       ))}
                                    </Row>
                                 </div>

                                 <div className="hotel-description">
                                    <h5 className="section-title">
                                       <FaInfoCircle className="me-2" />
                                       Mô tả về khách sạn
                                    </h5>
                                    <p className="description-text">
                                       {`Với ${dataFacility[0]} và ${dataFacility[1]}, ${currentHotel.hotelName} tọa lạc ở 
                     ${currentHotel.description.substring(0, 150)}...`}
                                    </p>
                                    <FavoriteToggle hotelId={currentHotel._id} />
                                 </div>
                              </Card.Body>
                           </Card>
                        </Col>
                     </Row>

                     {/* Row thứ hai chứa các tiện nghi nổi bật */}
                     <Row className="mt-4">
                        <Col>
                           <Card className="border-0 shadow-sm p-3">
                              <Card.Title className="mb-3">
                                 <FaConciergeBell className="me-2" />
                                 Dịch vụ khách sạn cung cấp
                              </Card.Title>
                              <Row className="g-3">
                                 {listService.map((item, index) => (
                                    <Col xs={6} md={3} lg={2} key={index}>
                                       <div className="featured-amenity p-2 text-center">
                                          <div className="amenity-name">
                                             {item.name}
                                          </div>
                                       </div>
                                    </Col>
                                 ))}
                              </Row>
                           </Card>
                        </Col>
                     </Row>
                     <Row className="m-0 p-0 mt-4">
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
                        {/* Check-in Date & Time */}
                        <div className="col-md-3">
                           <CustomDateValidator
                              type="date"
                              label="CHECK-IN DATE"
                              value={checkInDate}
                              min={new Date().toISOString().split('T')[0]}
                              onChange={(e) => handleDateChange('checkin', e.target.value)}
                              error={dateErrors.checkIn}
                           />
                           <input
                              type="time"
                              value={checkInTime}
                              onChange={(e) => setCheckInTime(e.target.value)}
                              className={`form-control mt-2 ${timeErrors.checkIn ? 'is-invalid' : ''}`}
                           />
                           {timeErrors.checkIn && <div className="invalid-feedback">{timeErrors.checkIn}</div>}
                        </div>

                        {/* Check-out Date & Time */}
                        <div className="col-md-3">
                           <CustomDateValidator
                              type="date"
                              label="CHECK-OUT DATE"
                              value={checkOutDate}
                              min={checkInDate || new Date().toISOString().split('T')[0]}
                              onChange={(e) => handleDateChange('checkout', e.target.value)}
                              error={dateErrors.checkOut}
                           />
                           <input
                              type="time"
                              value={checkOutTime}
                              onChange={(e) => setCheckOutTime(e.target.value)}
                              className={`form-control mt-2 ${timeErrors.checkOut ? 'is-invalid' : ''}`}
                           />
                           {timeErrors.checkOut && <div className="invalid-feedback">{timeErrors.checkOut}</div>}
                        </div>

                        {/* Guests Input (existing) */}
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

                     {/* Error messages (existing) */}
                     <div className="row justify-content-center mt-2">
                        <div className="col-md-8">
                           {capacityError && <div className="alert alert-danger">{capacityError}</div>}
                           {availabilityError && <div className="alert alert-danger">{availabilityError}</div>}
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
                     checkInTime={checkInTime}
                     checkOutTime={checkOutTime}
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
   }