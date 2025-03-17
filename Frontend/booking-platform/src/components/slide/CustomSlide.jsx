import { Swiper, SwiperSlide } from 'swiper/react';
import { Button, Card, Container, Spinner, Badge } from 'react-bootstrap';
import 'swiper/css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../utils/Constant';
import { RatingConsider } from '../../utils/RatingConsider';
import { formatCurrencyVND } from '../../utils/FormatPricePrint';
import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaHeart, FaRegCalendarAlt } from "react-icons/fa";
import './CustomSlide.css';

const CustomSlide = () => {
   const [hotels, setHotels] = useState([]);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState('');
   const [bookingData, setBookingData] = useState([]);
   const navigate = useNavigate();

   const goToDetail = (hotelId) => {
      navigate(`/hotel-detail/${hotelId}`);
   }

   const getTopHotelDetail = async () => {
      setLoading(true);
      try {
         const response = await axios.get(`${BASE_URL}/hotel/top-hotel`);
         if (response.data?.hotels) {
            setHotels(response.data.hotels);
            setError('');
         }
      } catch (err) {
         setError(err.response?.data?.message || 'Error fetching data');
      } finally {
         setTimeout(() => {
            setLoading(false);
         }, 800);
      }
   };

   const getTotalReservationOfHotel = async (hotelId) => {
      try {
         const response = await axios.get(`${BASE_URL}/hotel/total/${hotelId}`);
         return response.data?.totalReservations || 0;
      } catch (err) {
         return 0;
      }
   };

   useEffect(() => {
      getTopHotelDetail();
   }, []);

   useEffect(() => {
      const getBookingData = async () => {
         const bookings = await Promise.all(
            hotels.map(async (hotel) => await getTotalReservationOfHotel(hotel._id))
         );
         setBookingData(bookings);
      };

      if (hotels.length > 0) {
         getBookingData();
      }
   }, [hotels]);

   return (
      <Container fluid className="top-hotels-container">
         <h1 className='text-center fw-bold mt-5 mb-4'>Top Ranking Hotels In Travelofy</h1>
         
         {error && <p className="text-danger text-center">{error}</p>}
         
         {loading ? (
            <div className="d-flex justify-content-center align-items-center py-5">
               <Spinner animation="border" style={{ color: '#003b95' }} />
            </div>
         ) : (
            <Swiper
               className='hotel-swiper py-4 px-3'
               slidesPerView={1}
               spaceBetween={20}
               autoplay={{ delay: 3000, disableOnInteraction: false }}
               navigation={true}
               pagination={{ clickable: true }}
               breakpoints={{
                  640: { slidesPerView: 2 },
                  768: { slidesPerView: 3 },
                  1024: { slidesPerView: 4 },
                  1280: { slidesPerView: 5 }
               }}
            >
               {hotels.map((item, index) => (
                  <SwiperSlide key={index}>
                     <Card className='hotel-card shadow'>
                        <div className="hotel-image-container">
                           <Card.Img
                              src={item.images[0] || "/placeholder.svg?height=240&width=320"}
                              className="hotel-image"
                              alt={item.hotelName}
                           />
                           <div className="favorite-icon-wrapper">
                              <FaHeart className="favorite-icon" />
                           </div>
                           <Badge bg="danger" className="position-absolute top-0 start-0 m-3">Top Rated</Badge>
                        </div>
                        
                        <Card.Body className="d-flex flex-column">
                           <div className="hotel-title-container">
                              <Card.Title className="hotel-title">{item.hotelName}</Card.Title>
                              <div className="d-flex align-items-center mb-2">
                                 <FaMapMarkerAlt className="location-icon" />
                                 <Card.Subtitle className="hotel-location">{item.address}</Card.Subtitle>
                              </div>
                           </div>
                           
                           <div className="d-flex justify-content-between align-items-center mb-2">
                              <div className="price-container">
                                 <Card.Text className="old-price">{formatCurrencyVND(item.pricePerNight + 100)}</Card.Text>
                                 <Card.Text className="current-price">{formatCurrencyVND(item.pricePerNight)}</Card.Text>
                              </div>
                              <div className="rating-badge" style={{ backgroundColor: '#003b95' }}>
                                 <span>{item.rating}</span>
                              </div>
                           </div>
                           
                           <Card.Text className="rating-text">{RatingConsider(item.rating)}</Card.Text>
                           
                           <div className="d-flex align-items-center mt-auto mb-2">
                              <FaRegCalendarAlt className="booking-icon" />
                              <Card.Text className="booking-text">
                                 {bookingData[index] ?? 0} reservations
                              </Card.Text>
                           </div>
                           
                           <Button 
                              className="booking-button w-100"
                              onClick={() => goToDetail(item._id)}
                           >
                              Book Now
                           </Button>
                        </Card.Body>
                     </Card>
                  </SwiperSlide>
               ))}
            </Swiper>
         )}
      </Container>
   );
};

export default CustomSlide;
