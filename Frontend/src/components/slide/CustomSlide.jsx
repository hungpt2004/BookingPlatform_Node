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
      <Container fluid className='container-top'>
         <div className='content'>
            <h1 className="text-center typing-text">Welcome to Our Travelofy</h1>
         </div>
         <Swiper
            className='p-5 mt-5'
            slidesPerView={4}
            spaceBetween={100}
            onSlideChange={() => console.log('slide change')}
            onSwiper={(swiper) => console.log(swiper)}
            autoplay={true}
         >
            {dataImage.map((item, index) => {
               const { name, price, rating, bookings } = hotelData[index];
               return (
                  <SwiperSlide key={index}>
                     <Card className='w-75 rounded-4 mt-4 card-hotel'>
                        <Image className="img-fluid swiper-image rounded-top-4" src={item} />
                        <Card.Body>
                           <Card.Title className='text-center fs-4 title'>{name}</Card.Title>
                           <Card.Text className='text-center'>💰 Price: {price}</Card.Text>
                           <Card.Text className='text-center'>⭐ Rating: {rating}</Card.Text>
                           <Card.Text className='text-center'>📅 Bookings: {bookings}</Card.Text>
                           <Button className='text-center justify-content-center' variant='outline-primary'>Booking Now</Button>
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
