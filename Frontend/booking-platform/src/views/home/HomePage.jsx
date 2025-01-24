import React, { useState, useEffect, Suspense } from 'react';
import CustomNavbar from '../../components/navbar/CustomNavbar';
import CustomSlide from '../../components/slide/CustomSlide';

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
      <div style={{ display: 'flex', cursor: 'pointer' }}>
        {[...Array(5)].map((_, index) => (
          <span
            key={index}
            style={{
              fontSize: '24px',
              color: (hoverValue || value) > index ? '#FFD700' : '#ccc',
            }}
            onClick={() => handleClick(index)}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const fetchHotels = async () => {
    setLoading(true);
    setShowHotels(false);
    try {
      const response = await fetch(
        `http://localhost:8080/user/search?hotelName=${hotelName}&address=${address}&checkinDate=${checkinDate}&checkoutDate=${checkoutDate}&priceRange=${minRating}-5&numberOfPeople=${numberOfPeople}`
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
      console.error('Error fetching hotels:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, [hotelName, address, checkinDate, checkoutDate, minRating, numberOfPeople]);

  const styles = {
    card: {
      border: '1px solid #ccc',
      borderRadius: '8px',
      padding: '16px',
      margin: '16px 0',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    spinnerContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100px',
    },
    spinner: {
      width: '50px',
      height: '50px',
      border: '5px solid #ccc',
      borderTop: '5px solid #000',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    },
    '@keyframes spin': {
      '0%': { transform: 'rotate(0deg)' },
      '100%': { transform: 'rotate(360deg)' },
    },
  };

  return (
    <>
      <div>
        <h2>Search Hotels</h2>
        <input
          type="text"
          placeholder="Hotel Name"
          value={hotelName}
          onChange={(e) => setHotelName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <input
          type="date"
          placeholder="Check-in Date"
          value={checkinDate}
          onChange={(e) => setCheckinDate(e.target.value)}
        />
        <input
          type="date"
          placeholder="Check-out Date"
          value={checkoutDate}
          onChange={(e) => setCheckoutDate(e.target.value)}
        />
        <div>
          <h3>Select Rating:</h3>
          <StarRating value={minRating} onChange={(value) => setMinRating(value)} />
        </div>
        <input
          type="number"
          placeholder="Number of People"
          value={numberOfPeople}
          onChange={(e) => setNumberOfPeople(e.target.value)}
        />
      </div>
      <div>
        {loading ? (
          <div>Loading...</div>
        ) : (
          showHotels && (
            <div>
              {hotels.map((hotelData) => {
                const hotel = hotelData.hotel || hotelData;
                return (
                  <div key={hotel._id.toString()}>
                    <h2>{hotel.hotelName}</h2>
                    <p>{hotel.description}</p>
                    <p>Rating: {hotel.rating}</p>
                    <p>Address: {hotel.address}</p>
                  </div>
                );
              })}
            </div>
          )
        )}
      </div>
    </>
  );
};
