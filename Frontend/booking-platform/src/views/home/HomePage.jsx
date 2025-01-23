import React, { useState, useEffect } from 'react';
import CustomNavbar from '../../components/navbar/CustomNavbar';
import CustomSlide from '../../components/slide/CustomSlide';

export const HomePage = () => {
  const [hotels, setHotels] = useState([]);
  const [hotelName, setHotelName] = useState('');
  const [address, setAddress] = useState('');
  const [checkinDate, setCheckinDate] = useState('');
  const [checkoutDate, setCheckoutDate] = useState('');
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
  const [numberOfPeople, setNumberOfPeople] = useState('');
  const [loading, setLoading] = useState(false);
  const [showHotels, setShowHotels] = useState(false);

  const priceRanges = [
    { label: '$0 - $100', value: '0-100' },
    { label: '$101 - $200', value: '101-200' },
    { label: '$201 - $300', value: '201-300' },
    { label: '$301 - $400', value: '301-400' },
    { label: '$401 - $500', value: '401-500' },
    { label: 'Above $500', value: '501-1000' },
  ];

  const fetchHotels = async () => {
    setLoading(true);
    setShowHotels(false);
    try {
      const priceRangeQuery = selectedPriceRanges.length > 0
        ? selectedPriceRanges.map(range => {
          const [min, max] = range.split('-');
          return `priceRange=${min}-${max}`;
        }).join('&')
        : '';

      const response = await fetch(`http://localhost:8080/user/search?hotelName=${hotelName}&address=${address}&checkinDate=${checkinDate}&checkoutDate=${checkoutDate}&${priceRangeQuery}&numberOfPeople=${numberOfPeople}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setTimeout(() => {
        setHotels(data);
        setShowHotels(true);
      }, 2000);
    } catch (error) {
      console.error('Error fetching hotels:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, [hotelName, address, checkinDate, checkoutDate, selectedPriceRanges, numberOfPeople]);

  const handlePriceRangeChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelectedPriceRanges([...selectedPriceRanges, value]);
    } else {
      setSelectedPriceRanges(selectedPriceRanges.filter(range => range !== value));
    }
  };

  const styles = {
    card: {
      border: '1px solid #ccc',
      borderRadius: '8px',
      padding: '16px',
      margin: '16px 0',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
  };

  return (
    <>
      <CustomNavbar />
      <CustomSlide />
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
          <h3>Select Price Range:</h3>
          {priceRanges.map((range) => (
            <div key={range.value}>
              <input
                type="checkbox"
                value={range.value}
                checked={selectedPriceRanges.includes(range.value)}
                onChange={handlePriceRangeChange}
              />
              <label>{range.label}</label>
            </div>
          ))}
        </div>
        <input
          type="number"
          placeholder="Number of People"
          value={numberOfPeople}
          onChange={(e) => setNumberOfPeople(e.target.value)}
        />
      </div>
      {showHotels && (
        <div>
          {hotels.map((hotel) => (
            <div key={hotel._id} style={styles.card}>
              <h2>{hotel.hotelName}</h2>
              <p>{hotel.description}</p>
              <p>Price per Night: ${hotel.pricePerNight}</p>
              <p>Address: {hotel.address}</p>
              <p>Rating: {hotel.rating}</p>
            </div>
          ))}
        </div>
      )}
    </>
  );
};