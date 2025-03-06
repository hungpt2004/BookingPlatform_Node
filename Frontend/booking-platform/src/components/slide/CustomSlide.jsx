import { Swiper, SwiperSlide } from 'swiper/react';
import { Button, Card, Container } from 'react-bootstrap';
import 'swiper/css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../utils/Constant';
import { RatingConsider } from '../../utils/RatingConsider';
import { formatCurrencyVND } from '../../utils/FormatPricePrint';
import { delay, disableInstantTransitions } from 'framer-motion';
import { useNavigate, useNavigation } from 'react-router-dom';

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
         console.log(response.data?.totalReservations)
         return response.data?.totalReservations || 0;
      } catch (err) {
         return err.response.data.message;
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
         console.log(bookingData[0])
         setBookingData(bookings);
      };

      if (hotels.length > 0) {
         getBookingData();
      }
   }, [hotels]);

   return (
      <Container fluid>
         <h1 className='text-center fw-bold mt-5'>Top Ranking Hotels In Travelofy</h1>
         {error && <p className="text-danger text-center">{error}</p>}
         {loading ? (
            <p className="text-center">Loading...</p>
         ) : (
            <Swiper
               className='p-5 mt-5'
               slidesPerView={5}
               spaceBetween={10}
               onAutoplay={{ delay: 3000, disableInstantTransitions: false }}
               autoplay={{ delay: 3000, disableOnInteraction: false }}
               navigation={true}
               allowSlideNext={true}
               pagination={true}
            >
               {hotels.map((item, index) => (
                  <SwiperSlide key={index}>
                     <Card className='shadow-lg mb-2 bg-body-tertiary rounded-0'>
                        <Card.Img
                           variant='top'
                           className="object-fit-cover rounded-0"
                           src={item.images?.[0] || '/hotel/default.jpg'} // ✅ Fix lỗi ảnh
                           alt="Hotel"
                        />
                        <Card.Body>
                           <Card.Title className='fs-4 title text-start fw-bold' style={{
                              display: '-webkit-box',
                              WebkitBoxOrient: 'vertical',
                              WebkitLineClamp: 1,
                              overflow: 'hidden',
                           }}>{item.hotelName}</Card.Title>
                           <Card.Subtitle className='text-start fs-6 mb-2' style={{
                              display: '-webkit-box',
                              WebkitBoxOrient: 'vertical',
                              WebkitLineClamp: 1,
                              overflow: 'hidden',
                           }}>{item.address}</Card.Subtitle>
                           <div className='d-flex justify-content-start align-items-center'>
                              <Card.Text className='mb-1 fs-6 text-danger text-decoration-line-through'>{formatCurrencyVND(item.pricePerNight + 100)} </Card.Text>
                              <Card.Text className='mb-1 fs-5 fw-bold'>  {formatCurrencyVND(item.pricePerNight)}</Card.Text>
                           </div>
                           <div className="d-flex align-items-center mt-0 mb-1">
                              <Card style={{ backgroundColor: '#003b95' }}>
                                 <Card.Text className="px-3 py-1 text-light text-center fs-6">{item.rating}</Card.Text>
                              </Card>
                              <span className="fw-bold px-3 fs-6">{RatingConsider(item.rating)}</span>
                           </div>
                           <Card.Text className='text-start fs-6'>Total Booking: {bookingData[index] ?? 0} reservations</Card.Text> {/* ✅ Fix lỗi undefined */}
                           <div className='d-flex justify-content-end align-items-center rounded-0'>
                              <Button style={{ backgroundColor: '#003b95', borderColor: '#003b95' }} onClick={() => goToDetail(item._id)} className='px-2 py-1'>Booking Now</Button>
                           </div>
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