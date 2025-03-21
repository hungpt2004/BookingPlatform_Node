import { useState, useEffect } from 'react';
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
import axiosInstance from '../../utils/AxiosInstance';
import HotelCard from '../../components/card/HotelCard';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { newData, trendingRowFirst, trendingRowSecond } from './DataNews';
import { TopCommentSlide } from '../../components/slide/TopCommentSlide';
import Footer from '../../components/footer/FooterComponent';
import FeaturesSection from '../../components/card/FeatureCard';


export const HomePage = () => {
  const navigate = useNavigate();
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
  const [favorites, setFavorites] = useState([]);

  // Fetch user's favorites on component mount
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await axiosInstance.get('/favorite/get-all-favorite');
        setFavorites(response.data.favorites.map(hotel => hotel._id));
      } catch (error) {
        console.error('Error fetching favorites:', error);
      }
    };

    if (showHotels) {
      fetchFavorites();
    }
  }, [showHotels]);


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
        className={`form-control ${error ? 'is-invalid' : ''} rounded-0 p-3`}
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
        <div className='fw-4 fs-5 p-2' style={{ backgroundColor: '#003b95', color: 'white', borderRadius: '5px' }}>Filter By Star</div>
        {[...Array(5)].map((_, index) => (
          <>
            <span
              key={index}
              style={{
                fontSize: '30px',
                color: (hoverValue || value) > index ? '#003b95' : '#ccc',
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
      console.log('Search params:', {
        hotelName,
        address,
        checkinDate,
        checkoutDate,
        hotelRating: `${minRating}-5`,
        numberOfPeople,
        page: newPage
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
    navigate(`/hotel-detail/${hotelId}?checkin=${checkinDate}&checkout=${checkoutDate}&guests=${numberOfPeople}`);
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



  return (
    <>
      <CustomNavbar />
      <CustomBanner />
      <CustomSlide />
      <LottieComponent />
      <div className='position-relative'>
        <div className='position-fixed bottom-1 right-1 bg-secondary text-light' style={{ width: '80px', height: '80px', borderRadius: '50%' }}>
          <p className='text-center'>Text</p>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <h1 className='text-center fw-bold m-5 mt-5'>Your next adventure is just a search away</h1>
        </motion.div>
        <div className="row mx-5 d-flex justify-content-center align-items-center p-0 py-2 rounded-2" style={{ backgroundColor: '#ffb700' }}>
          <div className="col-md-2">
            <CustomInput
              type="text"
              placeHolder="Name"
              value={hotelName}
              onChange={(e) => setHotelName(e.target.value)}
            />
          </div>
          <div className="col-md-2">
            <div className="">
              <select
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="form-select rounded-0 p-3"
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
          <div className='col-md-3'>
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
              error={checkInError}
            />
          </div>
          <div className='col-md-3'>
            <CustomDateValidator
              type="date"
              placeholder="Check-out Date"
              value={checkoutDate}
              min={checkinDate || new Date().toISOString().split('T')[0]}
              onChange={(e) => setCheckoutDate(e.target.value)}
              error={checkOutError}
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
        <div className="d-flex justify-content-center mt-4">
          <Button
            style={{ backgroundColor: '#003b95' }}
            onClick={handleSearch}
            disabled={loading}
            className='py-2'
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
                  <Spinner size={40} color="#003b95" style={{ color: '#003b95' }} />
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

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className='d-flex justify-content-between align-items-center'>
            <h1 className='fw-bold m-5 mt-5'>Trending destinations</h1>
            <h3 className='text-decoration-underline mx-5' style={{ color: '#003b95' }}>See more</h3>
          </div>
        </motion.div>

        {/* HN / HCM */}
        <div className="row mx-5">
          {trendingRowFirst.map((item, index) => (
            <div key={index} className="col-md-6 mb-2 position-relative card-container">
              {/* Ảnh */}
              <Image src={item.url} fluid className="w-100 card-des" style={{ borderRadius: "10px", height: '50vh', objectFit: 'cover' }} />

              {/* Text hiển thị khi hover */}
              <h3 className='position-absolute top-50 start-50 translate-middle text-white fw-bold overlay-text'>
                {item.name}
              </h3>
            </div>
          ))}
        </div>


        {/* DN , VT , DL */}
        <div className='row mx-5 mt-3'>
          {trendingRowSecond.map((item, index) => (
            <div key={index} className="col-md-4 mb-2 position-relative card-container">
              {/* Ảnh */}
              <Image src={item.url} fluid className="w-100 card-des" style={{ borderRadius: "10px", height: '50vh', objectFit: 'cover' }} />

              {/* Text hiển thị khi hover */}
              <h3 className='position-absolute top-50 start-50 translate-middle text-white fw-bold overlay-text'>
                {item.name}
              </h3>
            </div>
          ))}
        </div>

        <FeaturesSection />


        {/* News */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <h1 className='fw-bold m-5 mt-5'>Get inspiration for your next trip</h1>
        </motion.div>
        <motion.div
          className='row w-100 h-100 mx-4'
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.3 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className='row'>
            {/* Cột Trái - 2 Thẻ Card */}
            <div className='col-md-6 d-flex flex-column justify-content-between'>
              <div className='row'>
                {newData.map((item, index) => {
                  return (
                    <div className='col-md-6 d-flex'>
                      <Card className='border-0 rounded flex-fill'>
                        <Card.Body>
                          <Card.Img
                            variant="top"
                            src={item.url}
                            className='mb-2'
                            fluid
                            style={{ width: '100%', height: '24vh', borderRadius: '10px' }}
                          />
                          <Card.Title className='mt-1 fw-bold fs-3' style={{
                            display: '-webkit-box',
                            WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: 2,
                            overflow: 'hidden',
                          }}>
                            {item.title}
                          </Card.Title>
                          <Card.Text className='fs-5 text-secondary'>
                            {item.content}
                          </Card.Text>
                          <Button style={{ backgroundColor: '#003b95', borderColor: '#003b95' }}>
                            Read more
                          </Button>
                        </Card.Body>
                      </Card>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Cột Phải - Ảnh phải bằng chiều cao của 2 card bên trái */}
            <div className='col-md-6 d-flex align-items-center'>
              <Card className='m-3 border-0 rounded w-100 position-relative overflow-hidden'>
                <Image
                  src='https://cdn.pixabay.com/photo/2019/02/11/09/42/pham-ngu-lao-3989110_1280.jpg'
                  fluid
                  style={{ width: '100%', height: 'calc(24vh * 2 + 16px)', borderRadius: '10px' }}
                />
                <div
                  className='position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center text-light'
                  style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
                >
                  <h2 className='fw-bold bottom-1'>Explore Da Nang</h2>
                  <p>Find the best spots for your next trip</p>
                  <Button style={{ backgroundColor: '#003b95', borderColor: '#003b95' }}>Discover Now</Button>
                </div>
              </Card>
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
          <h1 className='text-center fw-bold m-5 mt-5'>About Us</h1>
        </motion.div>
        <motion.div
          className='row w-100 mx-0 px-4'
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className='col-md-7 d-flex flex-column justify-content-center pe-md-4'>
            <p className='fs-4 mb-3'>Welcome to <span className='fw-bolder fs-2' style={{ color: '#003b95' }}>TRAVELOFY</span>, your go-to booking platform for hassle-free travel planning. Whether you're looking for a cozy stay, luxurious resorts, or budget-friendly accommodations, we bring you the best options at unbeatable prices.</p>
            <p className='fs-4 mb-3'>At Travelofy, we believe that booking your next adventure should be simple, secure, and transparent. Our platform is designed to provide:</p>
            <div className='ms-2'>
              <p className='fs-5 mb-2'>✔️ Transparent pricing with no hidden fees</p>
              <p className='fs-5 mb-2'>✔️ Secure and safe booking process</p>
              <p className='fs-5 mb-2'>✔️ Honest reviews and real images</p>
            </div>
          </div>
          <div className='col-md-5 mt-4 mt-md-0'>
            <Image
              src='/hotel/travelofy.jpg'
              fluid
              className='w-100 h-100 object-fit-cover rounded-4 shadow'
              alt="Travelofy accommodations"
            />
          </div>
        </motion.div>

        {/* Comment */}
        <TopCommentSlide />


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
              <Button style={{ backgroundColor: '#003b95', borderColor: '#003b95' }}>
                Send
              </Button>
            </InputGroup>
          </div>
        </div>
      </div>
      {/* Footer */}
      <Footer />
    </>
  );
};
