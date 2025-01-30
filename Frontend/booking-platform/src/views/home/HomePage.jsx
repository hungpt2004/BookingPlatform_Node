import React, { useState, useEffect } from 'react';
import CustomNavbar from '../../components/navbar/CustomNavbar';
import CustomSlide from '../../components/slide/CustomSlide';
import Booking from '../../components/booking/Booking';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'; // Import heart icons

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
          {/* Add StarRating here if needed */}
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
};
