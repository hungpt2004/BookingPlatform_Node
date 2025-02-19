import { Swiper, SwiperSlide } from 'swiper/react';
import { Button, Card, Container } from 'react-bootstrap';
import 'swiper/css';
import './Slide.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../utils/Constant';

const CustomSlide = () => {
   const [hotels, setHotels] = useState([]);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState('');
   const [bookingData, setBookingData] = useState([]); 

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
               slidesPerView={4}
               spaceBetween={100}
               autoplay={{ delay: 3000, disableOnInteraction: false }}
            >
               {hotels.map((item, index) => (
                  <SwiperSlide key={index}>
                     <Card className='shadow-lg p-2 mb-2 bg-body-tertiary rounded-4'>
                        <Card.Img
                           variant='top'
                           className="rounded-top-4"
                           src={item.images?.[0] || '/hotel/default.jpg'} // ✅ Fix lỗi ảnh
                           alt="Hotel"
                        />
                        <Card.Body>
                           <Card.Title className='fs-4 title'>{item.hotelName}</Card.Title>
                           <Card.Text>💰 Price: {item.pricePerNight} $</Card.Text>
                           <Card.Text>⭐ Rating: {item.rating}</Card.Text>
                           <Card.Text>📅 Bookings: {bookingData[index] ?? 0}</Card.Text> {/* ✅ Fix lỗi undefined */}
                           <div className='d-flex justify-content-center align-items-center'>
                              <Button variant='outline-primary'>Booking Now</Button>
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