import { Swiper, SwiperSlide } from 'swiper/react';
import { Card, Container, Image } from 'react-bootstrap';
import 'swiper/css';
import './Slide.css';

const dataImage = [
   "/hotel/hotel1.jpg",
   "/hotel/hotel2.jpg",
   "/hotel/hotel3.jpg",
   "/hotel/hotel6.jpg",
   "/hotel/hotel7.jpg"
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
      <Container fluid className='mx-5'>
         <Swiper
            slidesPerView={4}
            onSlideChange={() => console.log('slide change')}
            onSwiper={(swiper) => console.log(swiper)}
            autoplay={true}
         >
            {dataImage.map((item, index) => {
               const { name, price, rating, bookings } = hotelData[index];
               return (
                  <SwiperSlide key={index}>
                     <Card className='w-75 rounded-5 mt-4 card-hotel'>
                        <Image className="img-fluid swiper-image rounded-top-4" src={item} />
                        <Card.Body>
                           <Card.Title className='text-center fs-4 title'>{name}</Card.Title>
                           <Card.Text className='text-center'>💰 Price: {price}</Card.Text>
                           <Card.Text className='text-center'>⭐ Rating: {rating}</Card.Text>
                           <Card.Text className='text-center'>📅 Bookings: {bookings}</Card.Text>
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
