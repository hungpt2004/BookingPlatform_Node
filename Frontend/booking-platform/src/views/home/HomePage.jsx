import React, { useState, useEffect } from 'react';
import CustomNavbar from '../../components/navbar/CustomNavbar';
import CustomSlide from '../../components/slide/CustomSlide';
import { HashLoader } from 'react-spinners';
import CustomInput from '../../components/input/CustomInput';
import LottieComponent from '../../components/lottie/LottieComponent';
import { Badge, Card } from 'react-bootstrap';
import { motion } from 'framer-motion';  // Import motion
import './HomePage.css';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import Booking from '../../components/booking/Booking.jsx';
import ImageNotFound from '../../assets/svg/notfound.jpg'


export const HomePage = () => {
  const [hotels, setHotels] = useState([]);
  const [hotelName, setHotelName] = useState('');
  const [address, setAddress] = useState('');
  const [checkinDate, setCheckinDate] = useState('');
  const [checkoutDate, setCheckoutDate] = useState('');
  const [minRating, setMinRating] = useState(0);
  const [numberOfPeople, setNumberOfPeople] = useState('');
  const [loading, setLoading] = useState(false);
  const [showHotels, setShowHotels] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedHotelId, setSelectedHotelId] = useState(null);
  const [favorites, setFavorites] = useState([]);

  const userId = "67961bea7f3d8b7d458856fe"; // Replace with the actual user ID

  const fetchFavorites = async () => {
    try {
      const response = await fetch(`http://localhost:8080/user/get-favorite-hotels/${userId}`);
      const data = await response.json();
      if (!data.error) {
        setFavorites(data.favorites.map((fav) => fav._id));
      }
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [setFavorites]);

  const fetchHotels = async () => {
    setLoading(true);
    setShowHotels(false);
    try {
      const response = await fetch(
        `http://localhost:8080/user/search?hotelName=${hotelName}&address=${address}&checkinDate=${checkinDate}&checkoutDate=${checkoutDate}&priceRange=${minRating}-5&numberOfPeople=${numberOfPeople}`
      );
      const data = await response.json();
      setTimeout(() => {
        setHotels(data.hotelsWithCapacity);
        setShowHotels(true);
        setMinRating(0); // Reset the rating after the search
      }, 1500);
    } catch (error) {
      console.error('Error fetching hotels:', error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, [hotelName, address, checkinDate, checkoutDate, minRating, numberOfPeople]);

  const toggleFavorite = async (hotelId) => {
    const isFavorite = favorites.includes(hotelId);
    try {
      const response = await fetch(
        `http://localhost:8080/user/${isFavorite ? 'remove-favorite-hotel' : 'add-favorite-hotel'}`,
        {
          method: isFavorite ? 'DELETE' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId, hotelId }),
        }
      );
      const data = await response.json();
      console.log(data);
      if (!data.error) {
        if (isFavorite) {
          setFavorites((prev) => prev.filter((id) => id !== hotelId));
        } else {
          setFavorites((prev) => [...prev, hotelId]);
        }
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(`Error ${isFavorite ? 'removing' : 'adding'} favorite:`, error);
    }
  };

  const handleReserve = (hotelId) => {
    setSelectedHotelId(hotelId);
    setOpenModal(true);
  };

  return (
    <>
      <CustomNavbar />
      <CustomSlide />
      <LottieComponent />
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
      <div>
        {loading ? (
          <div>Loading...</div>
        ) : (
          showHotels && (
            <div>
              {hotels.map((hotelData) => {
                const hotel = hotelData.hotel || hotelData;
                const isFavorite = favorites.includes(hotel._id);
                return (
                  <div key={hotel._id.toString()} style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                      <h2>{hotel.hotelName}</h2>
                      <p>{hotel.description}</p>
                      <p>Rating: {hotel.rating}</p>
                      <p>Address: {hotel.address}</p>
                      <button onClick={() => handleReserve(hotel._id)}>
                        Reserve or Book Now!
                      </button>
                    </div>
                    <div>
                      {/* Favorite Icon */}
                      <button onClick={() => toggleFavorite(hotel._id)} style={{ fontSize: '24px' }}>
                        {isFavorite ? (
                          <AiFillHeart style={{ color: 'red' }} />
                        ) : (
                          <AiOutlineHeart />
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}
        <div className="container-fluid">
          <div className="row mx-5 mt-5">
            {/* Filter and Map Section */}
            <div className="col-md-3">
              <motion.div
                className='rounded-4'
                style={{ height: '250px', backgroundColor: '#e0e0e0' }}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5 }}
              >
                <p className='text-center'>Map (Google Map or Leaflet here)</p>
              </motion.div>
              <motion.div
                className="mt-3"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5 }}
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
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                  >
                    {hotels.length > 0 ? (hotels.map((hotelData) => {
                      const hotel = hotelData.hotel || hotelData;
                      return (
                        <motion.div
                          key={hotel._id.toString()}
                          className="col-md-4 mb-4"
                          initial={{ opacity: 0, y: 50 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5 }}
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
                    )}
                  </motion.div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
      {openModal && (
        <Booking
          setOpen={setOpenModal}
          hotelId={selectedHotelId}
          checkInDate={checkinDate}
          checkOutDate={checkoutDate}
          userId={userId}
        />
      )}
    </>
  );
}

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
