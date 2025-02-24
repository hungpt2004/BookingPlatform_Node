import React, { useState, useEffect } from 'react';
import CustomNavbar from '../../components/navbar/CustomNavbar';
import CustomSlide from '../../components/slide/CustomSlide';
import { HashLoader } from 'react-spinners';
import CustomInput from '../../components/input/CustomInput';
import LottieComponent from '../../components/lottie/LottieComponent';
import { Badge, Button, Card, Image, Form, InputGroup, ButtonGroup, Row, Col, Spinner } from 'react-bootstrap';
import { motion } from 'framer-motion';  // Import motion
import './HomePage.css';
import { BASE_URL } from '../../utils/Constant';
import axios from 'axios';
import { CustomBanner } from '../../components/banner/CustomBanner';
import { Swiper, SwiperSlide } from 'swiper/react';
import { IoIosArrowForward } from "react-icons/io";
import 'swiper/css';
import 'swiper/css/pagination';
import MapComponent from '../../components/map/MapComponent';
import { IoIosArrowDropright, IoIosArrowDropleft } from "react-icons/io";
import HotelCard from '../../components/card/HotelCard';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';


export const HomePage = () => {
  const [hotels, setHotels] = useState([]);
  const [hotelName, setHotelName] = useState('');
  const [address, setAddress] = useState('');
  const [checkinDate, setCheckinDate] = useState('');
  const [checkoutDate, setCheckoutDate] = useState('');
  const [minRating, setMinRating] = useState(0);
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showHotels, setShowHotels] = useState(false);
  const [checkInError, setCheckInError] = useState('');
  const [checkOutError, setCheckOutError] = useState('');
  const [addressError, setAddressError] = useState('');
  const [nameError, setNameError] = useState('');
  const [numberGuestError, setNumberGuestError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [vietCities, setVietCities] = useState([]);
  const navigate = useNavigate();

  // CHECK VALIDATE
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get(
          `http://api.geonames.org/searchJSON?country=VN&featureClass=P&maxRows=100&username=hahohi`
        );
        if (response.data.geonames) {
          const vietnameseNameMapping = {
            "Ho Chi Minh City": "Hồ Chí Minh",
            "Hanoi": "Hà Nội",
            "Da Nang": "Đà Nẵng",
            "Haiphong": "Hải Phòng",
            "Can Tho": "Cần Thơ",
            "Nha Trang": "Nha Trang",
            "Hue": "Huế",
            "Vung Tau": "Vũng Tàu",
            "Da Lat": "Đà Lạt",
            "Phu Quoc": "Phú Quốc",
            "Hoi An": "Hội An",
            "Qui Nhon": "Quy Nhơn"
          };

          const transformedCities = response.data.geonames.map(city => ({
            ...city,
            toponymName: vietnameseNameMapping[city.toponymName] || city.toponymName,
          }));

          setVietCities(transformedCities);
        }
      } catch (error) {
        console.error('Error fetching Vietnamese cities:', error);
      }
    };

    fetchCities();
  }, []);

  const validateDates = () => {
    const today = new Date().toISOString().split('T')[0];
    let isValid = true;

    setCheckInError('');
    setCheckOutError('');

    if (checkinDate) {
      if (checkinDate < today) {
        setCheckInError('Check-in date cannot be in the past');
        isValid = false;
      }

      if (checkoutDate && checkinDate > checkoutDate) {
        setCheckInError('Check-in cannot be after check-out');
        isValid = false;
      }
    }

    if (checkoutDate) {
      if (checkoutDate < today) {
        setCheckOutError('Check-out date cannot be in the past');
        isValid = false;
      }

      if (checkinDate && checkoutDate < checkinDate) {
        setCheckOutError('Check-out cannot be before check-in');
        isValid = false;
      }
    }

    return isValid;
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
      <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
        <Badge className='fw-4 fs-5' style={{ backgroundColor: '#6499E9' }}>Filter By Star</Badge>
        {[...Array(5)].map((_, index) => (
          <>
            <span
              key={index}
              style={{
                fontSize: '30px',
                color: (hoverValue || value) > index ? '#FFD700' : '#ccc',
                transition: 'color 0.3s ease, transform 0.2s ease',
                margin: '0 5px',
                transform: (hoverValue || value) > index ? 'scale(1.2)' : 'scale(1)',
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

  const fetchHotels = async (newPage = 1) => {
    if (!validateDates()) return;
    setLoading(true);
    setShowHotels(false);

    try {
      const response = await axios.get(`${BASE_URL}/customer/search`, {
        params: {
          hotelName,
          address,
          checkinDate,
          checkoutDate,
          hotelRating: `${minRating}-5`,
          numberOfPeople,
          page: newPage
        }
      });

      setHotels(response.data.hotels);
      setTotalPages(response.data.totalPages);
      setPage(newPage);
      setShowHotels(true);
    } catch (error) {
      console.error('Error fetching hotels:', error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000)
    }
  };

  const goToDetail = (hotelId) => {
    navigate(`/hotel-detail/${hotelId}`);
  }

  const handleSearch = () => {
    if (!address.trim()) {
      setAddressError('Please enter your destination.');
      return;
    }
    setAddressError('');
    setPage(1);
    fetchHotels(1);
  };
  

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    fetchHotels(newPage);
  };


  // useEffect(() => {
  //   fetchHotels();
  // }, [hotelName, address, checkinDate, checkoutDate, minRating, numberOfPeople]);

  return (
    <>
      <CustomNavbar />
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
            label="HOTEL NAME"
            placeHolder="Name"
            value={hotelName}
            onChange={(e) => setHotelName(e.target.value)}
          />
        </div>
        <div className="col-md-2">
          <div className="">
            <label className="form-label">CITY</label>
            <select
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="form-select"
            >
              <option value="">Select a city</option>
              {vietCities.map((city) => (
                <option key={city.geonameId} value={city.toponymName}>
                {city.toponymName}
              </option>              
              ))}
            </select>
            {addressError && (
              <div className="invalid-feedback d-block">
                {addressError}
              </div>
            )}
          </div>
        </div>
        <div className='col-md-2'>
          <CustomDateValidator
            type="date"
            placeholder="Check-in Date"
            value={checkinDate}
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => {
              setCheckinDate(e.target.value);
              if (checkoutDate && e.target.value > checkoutDate) {
                setCheckoutDate('');
              }
            }}
            label="CHECK IN DATE"
            error={checkInError}
          />
        </div>
        <div className='col-md-2'>
          <CustomDateValidator
            type="date"
            placeholder="Check-out Date"
            value={checkoutDate}
            min={checkinDate || new Date().toISOString().split('T')[0]}
            onChange={(e) => setCheckoutDate(e.target.value)}
            label="CHECK OUT DATE"
            error={checkOutError}
          />
        </div>
        <div className="col-md-2">
          <CustomInput
            type="number"
            label="NUMBER OF PEOPLES"
            placeHolder="Number's People"
            value={numberOfPeople}
            onChange={(e) => setNumberOfPeople(e.target.value)}
          />
        </div>
      </div>
      <div className="d-flex justify-content-center mt-4">
          <Button
            va="primary"
            onClick={handleSearch}
            disabled={loading}
          >
            {loading ? <Spinner animation="border" style={{ width: 20, height: 20 }} role="status" /> : 'Search'}
          </Button>
        </div>
      <div className="container-fluid">
        <div className="row mx-5 mt-5">
          <div className="col-md-3">
            <MapComponent />
            <motion.div
              className="mt-3"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <StarRating value={minRating} onChange={(value) => setMinRating(value)} />
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
                  {hotels.length > 0 ? (hotels.map((hotelData) => {
                    const hotel = hotelData.hotel || hotelData;
                    return (
                      <motion.div
                        key={hotel._id.toString()}
                        className="col-md-12 mb-4"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true, amount: 0.8 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <HotelCard hotel={hotel} goToDetail={() => goToDetail(hotel._id)} />
                      </motion.div>
                    );
                  })) : (
                    <div className='alert alert-danger'><p className='text-center'>Not found any hotel with that information</p></div>
                  )}
                </motion.div>
              )
            )}
            {showHotels && totalPages > 1 && (
              <div className="d-flex justify-content-center mt-4">
                <Button
                  variant="outline-primary"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                >
                  <IoIosArrowDropleft size={35} />
                </Button>
                <span className="mx-3 fs-6 fw-bold align-content-center">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline-primary"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                >
                  <IoIosArrowDropright size={35} />
                </Button>
              </div>
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
