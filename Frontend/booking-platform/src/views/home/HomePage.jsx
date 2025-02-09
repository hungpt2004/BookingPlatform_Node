<<<<<<< HEAD:Frontend/src/views/home/HomePage.jsx
import React, { useState, useEffect } from "react";
import CustomNavbar from "../../components/navbar/CustomNavbar";
import CustomSlide from "../../components/slide/CustomSlide";
import { HashLoader } from "react-spinners";
import CustomInput from "../../components/input/CustomInput";
import LottieComponent from "../../components/lottie/LottieComponent";
import { Badge, Card } from "react-bootstrap";
import { motion } from "framer-motion"; // Import motion
import "./HomePage.css";
import ImageNotFound from "../../assets/svg/notfound.jpg";
=======
import React, { useState, useEffect } from 'react';
import CustomNavbar from '../../components/navbar/CustomNavbar';
import CustomSlide from '../../components/slide/CustomSlide';
import { HashLoader } from 'react-spinners';
import CustomInput from '../../components/input/CustomInput';
import LottieComponent from '../../components/lottie/LottieComponent';
import { Badge, Button, Card, Col, Container, Image, Form, InputGroup } from 'react-bootstrap';
import { motion } from 'framer-motion';  // Import motion
import './HomePage.css';
import { BASE_URL } from '../../utils/Constant';
import axios from 'axios';
import { CustomBanner } from '../../components/banner/CustomBanner';
import { Footer, FooterCopyright, FooterIcon, FooterLink, FooterLinkGroup, FooterTitle } from "flowbite-react";
import { BsDribbble, BsFacebook, BsGithub, BsInstagram, BsTwitter } from "react-icons/bs";
import { Swiper, SwiperSlide } from 'swiper/react';
import { IoIosArrowForward } from "react-icons/io";
import 'swiper/css';
import 'swiper/css/pagination';
import MapComponent from '../../components/map/MapComponent';


>>>>>>> main:Frontend/booking-platform/src/views/home/HomePage.jsx

export const HomePage = () => {
  const [hotels, setHotels] = useState([]);
  const [hotelName, setHotelName] = useState("");
  const [address, setAddress] = useState("");
  const [checkinDate, setCheckinDate] = useState("");
  const [checkoutDate, setCheckoutDate] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [numberOfPeople, setNumberOfPeople] = useState("");
  const [loading, setLoading] = useState(false);
  const [showHotels, setShowHotels] = useState(false);
  const [showNews, setShowNews] = useState(false);

  const fetchHotels = async () => {
    setLoading(true);
    setShowHotels(false);
    try {
      const response = await fetch(
        `http://localhost:8080/customer/search?hotelName=${hotelName}&address=${address}&checkinDate=${checkinDate}&checkoutDate=${checkoutDate}&priceRange=${minRating}-5&numberOfPeople=${numberOfPeople}`
      );
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setTimeout(() => {
        setHotels(data);
        setShowHotels(true);
      }, 1500);
    } catch (error) {
      console.error("Error fetching hotels:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, [
    hotelName,
    address,
    checkinDate,
    checkoutDate,
    minRating,
    numberOfPeople,
  ]);

  return (
    <>
      <CustomNavbar/>
      <CustomBanner />
      <CustomSlide />
      <LottieComponent />
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true, amount: 0.3 }}
      >
        <h1 className='text-center fw-bold m-5'>Search</h1>
      </motion.div>
      <div className="row d-flex justify-content-center align-items-center">
        <div className="col-md-2">
          <CustomInput
            type="text"
            placeHolder="Name"
            value={hotelName}
            onChange={(e) => setHotelName(e.target.value)}
          />
        </div>
        <div className="col-md-2">
          <CustomInput
            type="text"
            placeHolder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <div className="col-md-2">
          <CustomInput
            type="date"
            placeHolder="Check-in Date"
            value={checkinDate}
            onChange={(e) => setCheckinDate(e.target.value)}
          />
        </div>
        <div className="col-md-2">
          <CustomInput
            type="date"
            placeHolder="Check-out Date"
            value={checkoutDate}
            onChange={(e) => setCheckoutDate(e.target.value)}
          />
        </div>
        <div className="col-md-2">
          <CustomInput
            type="number"
            placeHolder="Number's People"
            value={numberOfPeople}
            onChange={(e) => setNumberOfPeople(e.target.value)}
          />
        </div>
      </div>
      <div className="container-fluid">
        <div className="row mx-5 mt-5">
          <div className="col-md-3">
<<<<<<< HEAD:Frontend/src/views/home/HomePage.jsx
            <motion.div
              className="rounded-4"
              style={{ height: "250px", backgroundColor: "#e0e0e0" }}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5 }}
            >
              <p className="text-center">Map (Google Map or Leaflet here)</p>
            </motion.div>
=======
            <MapComponent/>
>>>>>>> main:Frontend/booking-platform/src/views/home/HomePage.jsx
            <motion.div
              className="mt-3"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <StarRating
                value={minRating}
                onChange={(value) => setMinRating(value)}
              />
            </motion.div>
          </div>
          {/* Hotels Display Section */}
          <div className="col-md-9">
            {loading ? (
              <div className="d-flex justify-content-center p-5 align-items-center">
                <HashLoader size={40} color="#6499E9" />
              </div>
            ) : (
              showHotels && (
                <motion.div
                  className="row"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1 }}
                  viewport={{ once: true, amount: 0.3 }}
                >
<<<<<<< HEAD:Frontend/src/views/home/HomePage.jsx
                  {hotels.length > 0 ? (
                    hotels.map((hotelData) => {
                      const hotel = hotelData.hotel || hotelData;
                      return (
                        <motion.div
                          key={hotel._id.toString()}
                          className="col-md-4 mb-4"
                          initial={{ opacity: 0, y: 50 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5 }}
                        >
                          <Card
                            className="card-search-hotel"
                            style={{ width: "100%" }}
                          >
                            <Card.Img
                              variant="top"
                              src={hotel.imageUrl || "default_image_url"}
                            />
                            <Card.Body>
                              <Card.Title>{hotel.hotelName}</Card.Title>
                              <Card.Text>{hotel.description}</Card.Text>
                              <Card.Text>Rating: {hotel.rating}</Card.Text>
                              <Card.Text>Address: {hotel.address}</Card.Text>
                            </Card.Body>
                          </Card>
                        </motion.div>
                      );
                    })
                  ) : (
                    <div className="alert alert-danger">
                      <p className="text-center">
                        Not found any hotel with that information
                      </p>
                    </div>
=======
                  {hotels.length > 0 ? (hotels.map((hotelData) => {
                    const hotel = hotelData.hotel || hotelData;
                    return (
                      <motion.div
                        key={hotel._id.toString()}
                        className="col-md-4 mb-4"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                        viewport={{ once: true, amount: 0.3 }}
                      >
                        <Card className='card-search-hotel' style={{ width: '100%' }}>
                          <Card.Img variant="top" src={hotel.imageUrl || 'default_image_url'} />
                          <Card.Body>
                            <Card.Title>{hotel.hotelName}</Card.Title>
                            <Card.Text>{hotel.description}</Card.Text>
                            <Card.Text>Rating: {hotel.rating}</Card.Text>
                            <Card.Text>Address: {hotel.address}</Card.Text>
                          </Card.Body>
                        </Card>
                      </motion.div>
                    );
                  })) : (
                    <div className='alert alert-danger'><p className='text-center'>Not found any hotel with that information</p></div>
>>>>>>> main:Frontend/booking-platform/src/views/home/HomePage.jsx
                  )}
                </motion.div>
              )
            )}
          </div>
        </div>
      </div>

      {/* News */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5 }}
        viewport={{ once: true, amount: 0.3 }}
      >
        <h1 className='text-center fw-bold m-5'>News Latest</h1>
      </motion.div>
      <motion.div
        className='row w-100 h-100 mx-4'
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5 }}
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className='col-md-3'>
          <Card className='mb-2 shadow p-2 bg-body-tertiary rounded'>
            <Card.Body>
              <Card.Img variant="top" src='/hotel/travel.jpg' className='mb-2' fluid style={{ width: '100%', height: '25vh' }} />
              <Card.Title>First News Title</Card.Title>
              <Card.Text>First news</Card.Text>
              <Button style={{ backgroundColor: '#6499E9', borderColor: '#6499E9' }}>Read more</Button>
            </Card.Body>
          </Card >
          <Card className='mb-2 shadow p-2 bg-body-tertiary rounded'>
            <Card.Body>
              <Card.Img variant="top" src='/hotel/travel.jpg' className='mb-2' fluid style={{ width: '100%', height: '25vh' }} />
              <Card.Title>First News Title</Card.Title>
              <Card.Text>First news</Card.Text>
              <Button style={{ backgroundColor: '#6499E9', borderColor: '#6499E9' }}>Read more</Button>
            </Card.Body>
          </Card>
        </div>
        <div className='col-md-9'>
          <Card className='mb-2 shadow p-2 bg-body-tertiary rounded'>
            <Card.Body>
              <Card.Img variant="top" src='/hotel/travel.jpg' className='mb-2' fluid style={{ width: '100%', height: '60vh' }} />
              <Card.Title>First News Title</Card.Title>
              <Card.Text>First news</Card.Text>
              <Button style={{ backgroundColor: '#6499E9', borderColor: '#6499E9' }}>Read more</Button>
            </Card.Body>
          </Card>
          <div className='d-flex align-items-center justify-content-center mt-5'>
            <Button variant='outline-primary'>Prev</Button>
            <p className='mx-2 text-center'>Page 1 of 3</p>
            <Button variant='outline-primary'>Next</Button>
          </div>
        </div>
      </motion.div>

      {/* About */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 2 }}
        viewport={{ once: true, amount: 0.3 }}
      >
        <h1 className='text-center fw-bold m-5'>About Us</h1>
      </motion.div>
      <motion.div
        className='row w-100 mx-4'
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 2 }}
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className='col-md-6'>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Non impedit esse cupiditate nihil eum quidem enim minus nobis tempore aperiam ab, commodi dolor optio nostrum temporibus at similique facilis adipisci?</p>
          <p>✔️ Transparent pricing with no hidden fees</p>
          <p>✔️ Secure and safe booking process</p>
          <p>✔️ Honest reviews and real images</p>
        </div>
        <div className='col-md-6'>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus iste, blanditiis molestias rerum illo, saepe quaerat recusandae quasi, iure asperiores fugiat perferendis ipsum sed ducimus soluta alias nobis numquam ex?</p>
          <Button style={{ backgroundColor: '#6499E9', borderColor: '#6499E9' }}>Read more</Button>
        </div>
      </motion.div>

      {/* Comment */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 2.5 }}
        viewport={{ once: true, amount: 0.3 }}
      >
        <h1 className='text-center fw-bold m-5'>Comments</h1>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 2.5 }}
        viewport={{ once: true, amount: 0.3 }}
      >
        <Swiper
          // pagination={{}}
          // modules={[Pagination]}
          slidesPerView={1}
          onSlideChange={() => console.log('slide change')}
          onSwiper={(swiper) => console.log(swiper)}
          autoplay={true}
        >
          <SwiperSlide>
            <Card className='border-0 cursor-pointer mb-5'>
              <div className='d-flex justify-content-center align-items-center mb-4'>
                <div style={{ width: '100px', height: '100px', borderRadius: '50%' }}>
                  <Image
                    src='https://c8.alamy.com/comp/2PWERD5/student-avatar-illustration-simple-cartoon-user-portrait-user-profile-icon-youth-avatar-vector-illustration-2PWERD5.jpg'
                    fluid
                    style={{ objectFit: 'cover', borderRadius: '50%' }}
                  />
                </div>
              </div>
              <Card.Title className='text-center'>Sara Wilsson</Card.Title>
              <Card.Subtitle className='text-center text-muted'>Designer</Card.Subtitle>
              <Card.Text className='text-center'>⭐⭐⭐⭐⭐</Card.Text>
              <Card.Text className='text-center text-secondary'>LoreLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremm</Card.Text>
            </Card>
          </SwiperSlide>
          <SwiperSlide>
            <Card className='border-0 cursor-pointer'>
              <div className='d-flex justify-content-center align-items-center mb-4'>
                <div style={{ width: '100px', height: '100px', borderRadius: '50%' }}>
                  <Image
                    src='https://c8.alamy.com/comp/2PWERD5/student-avatar-illustration-simple-cartoon-user-portrait-user-profile-icon-youth-avatar-vector-illustration-2PWERD5.jpg'
                    fluid
                    style={{ objectFit: 'cover', borderRadius: '50%' }}
                  />
                </div>
              </div>
              <Card.Title className='text-center'>Sara Wilsson</Card.Title>
              <Card.Subtitle className='text-center text-muted'>Designer</Card.Subtitle>
              <Card.Text className='text-center'>⭐⭐⭐⭐⭐</Card.Text>
              <Card.Text className='text-center text-secondary'>LoreLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremm</Card.Text>
            </Card>
          </SwiperSlide>
          <SwiperSlide>
            <Card className='border-0 cursor-pointer'>
              <div className='d-flex justify-content-center align-items-center mb-4'>
                <div style={{ width: '100px', height: '100px', borderRadius: '50%' }}>
                  <Image
                    src='https://c8.alamy.com/comp/2PWERD5/student-avatar-illustration-simple-cartoon-user-portrait-user-profile-icon-youth-avatar-vector-illustration-2PWERD5.jpg'
                    fluid
                    style={{ objectFit: 'cover', borderRadius: '50%' }}
                  />
                </div>
              </div>
              <Card.Title className='text-center'>Sara Wilsson</Card.Title>
              <Card.Subtitle className='text-center text-muted'>Designer</Card.Subtitle>
              <Card.Text className='text-center'>⭐⭐⭐⭐⭐</Card.Text>
              <Card.Text className='text-center text-secondary'>LoreLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremm</Card.Text>
            </Card>
          </SwiperSlide>
        </Swiper>
      </motion.div>

      {/* Email subscribe */}
      <div className='align-content-center' style={{ backgroundColor: '#f5f6f8' }}>
        <h3 className='text-center fw-bold p-3'>Join our Travelofy</h3>
        <h6 className='text-center text-muted'>Subscribe to our newsletter and receive the latest news about our products and services !</h6>
        <div className='d-flex justify-content-center align-items-center p-3'>
          <InputGroup className="mt-3 mb-3 mx-5 w-50 rounded">
            <Form.Control
              placeholder="Enter your email"
              aria-label="Enter your email"
              type='email'
            />
            <Button style={{ backgroundColor: '#6499E9', borderColor: '#6499E9' }}>
              Send
            </Button>
          </InputGroup>
        </div>
      </div>

      {/* Footer */}
      <div className='mt-5 mb-5'>
        {/* Column 8- 4 */}
        <div className='d-flex flex-column '>
          <div className='row'>
            <div className='col-md-6'>
              <h2 className='mx-4 mt-2' style={{ color: '#6499E9' }}>Travelofy</h2>
              <p className='mx-4'>123 Abc Street, CDF City</p>
              <p className='mx-4'>Viet Nam, VN</p>
              <p className='mx-4'><span className='fw-bold'>Phone:</span>+1 5589 55488 55</p>
              <p className='mx-4'><span className='fw-bold'>Email:</span>info@gmail.com</p>
            </div>
            <div className='col-md-6 row'>
              <div className='mx-4 col-md-5'>
                <h6 className='fw-bold mt-4' style={{ color: '#6499E9' }}>Useful Links</h6>
                <ul className='text-start p-0 m-0' style={{ listStyle: 'none', color: 'black' }}>
                  <li><IoIosArrowForward />Home</li>
                  <li><IoIosArrowForward />About Us</li>
                  <li><IoIosArrowForward />Services</li>
                  <li><IoIosArrowForward />Terms of service</li>
                </ul>
              </div>
              <div className=' mx-4 col-md-5'>
                <h6 className='fw-bold mt-4' style={{ color: '#6499E9' }}>Our Services</h6>
                <ul className='text-start p-0 m-0' style={{ listStyle: 'none', color: 'black' }}>
                  <li><IoIosArrowForward />Booking</li>
                  <li><IoIosArrowForward />Become Owner</li>
                  <li><IoIosArrowForward />Marketing</li>
                  <li><IoIosArrowForward />Destination</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        {/* Row - 6 - 3/3 */}
      </div>
    </>
  );
};

const StarRating = ({ value, onChange }) => {
  const [hoverValue, setHoverValue] = useState(null);

  const handleClick = (index) => {
    onChange(index + 1);
  };

  const handleMouseEnter = (index) => {
    setHoverValue(index + 1);
  };

  const handleMouseLeave = () => {
    setHoverValue(null);
  };

  return (
<<<<<<< HEAD:Frontend/src/views/home/HomePage.jsx
    <div style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
      <Badge className="fw-4 fs-5" style={{ backgroundColor: "#6499E9" }}>
        Filter By Star
      </Badge>
=======
    <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
      <Badge className='fw-4 fs-5' style={{ backgroundColor: '#6499E9', borderColor: '#6499E9' }}>Filter By Star</Badge>
>>>>>>> main:Frontend/booking-platform/src/views/home/HomePage.jsx
      {[...Array(5)].map((_, index) => (
        <>
          <span
            key={index}
            style={{
              fontSize: "30px",
              color: (hoverValue || value) > index ? "#FFD700" : "#ccc",
              transition: "color 0.3s ease, transform 0.2s ease",
              margin: "0 5px",
              transform:
                (hoverValue || value) > index ? "scale(1.2)" : "scale(1)",
            }}
            onClick={() => handleClick(index)}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          >
            ★
          </span>
        </>
      ))}
    </div>
  );
};

