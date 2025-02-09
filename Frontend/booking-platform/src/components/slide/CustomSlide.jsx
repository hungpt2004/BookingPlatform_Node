import { Swiper, SwiperSlide } from 'swiper/react';
import { Button, Card, Container, Image } from 'react-bootstrap';
import 'swiper/css';
import './Slide.css';

const dataImage = [
   "/hotel/hotel1.jpg",
   "/hotel/hotel2.jpg",
   "/hotel/hotel3.jpg",
   "/hotel/hotel3.jpg",
   "/hotel/hotel2.jpg"
];

// Random hotel data for demo purposes
const hotelData = [
   { name: "Hotel Paradise", price: "$120/night", rating: 4.5, bookings: 350 },
   { name: "Grand Palace Hotel", price: "$250/night", rating: 4.7, bookings: 500 },
   { name: "Ocean View Resort", price: "$180/night", rating: 4.2, bookings: 220 },
   { name: "Mountain Retreat", price: "$95/night", rating: 4.8, bookings: 650 },
   { name: "City Center Inn", price: "$85/night", rating: 4.1, bookings: 150 }
];

const CustomSlide = () => {
   return (
      <Container fluid>
         <h1 className='text-center fw-bold mt-5'>Top Ranking Hotels In Travelofy</h1>
         <Swiper
            className='p-5 mt-5'
            slidesPerView={4}
            spaceBetween={50}
            onSlideChange={() => console.log('slide change')}
            onSwiper={(swiper) => console.log(swiper)}
            autoplay={true}
         >
            {dataImage.map((item, index) => {
               const { name, price, rating, bookings } = hotelData[index];
               return (
                  <SwiperSlide key={index}>
                     <Card className='shadow-lg p-2 mb-2 bg-body-tertiary rounded'>
                        <Card.Img variant='top' className="" src={item} />
                        <Card.Body>
                           <Card.Title className='fs-4 title'>{name}</Card.Title>
                           <Card.Text >💰 Price: {price}</Card.Text>
                           <Card.Text >⭐ Rating: {rating}</Card.Text>
                           <Card.Text >📅 Bookings: {bookings}</Card.Text>
                           <div className='d-flex justify-content-center align-items-center'><Button className='text-center justify-content-center' variant='outline-primary'>Booking Now</Button></div>
                        </Card.Body>
                     </Card>
                  </SwiperSlide>
               );
            })}
         </Swiper>
      </Container>
   );
};

export default CustomSlide;