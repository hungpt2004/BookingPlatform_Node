const Hotel = require('../models/hotel');
const Room = require('../models/room');
const Reservation = require('../models/reservation');

exports.getAllHotels = async (req, res) => {
    try {
        const hotels = await Hotel.find();
        res.status(200).json(hotels);
    } catch (error) {
        console.error('Error fetching hotels:', error);
        res.status(500).json({ message: 'Error fetching hotels', error });
    }
};

exports.searchAndFilterHotels = async (req, res) => {
    try {
        const { hotelName, address, checkinDate, checkoutDate, priceRange, numberOfPeople } = req.query;
        let query = {};
        
        if (hotelName) {
            query.hotelName = { $regex: hotelName, $options: 'i' };
        }

        if (address) {
            query.address = { $regex: address, $options: 'i' };
        }

        if (priceRange) {
            const [minRating, maxRating] = priceRange.split('-').map(Number);
            query.rating = { $gte: minRating, $lte: maxRating };
        }

        const hotels = await Hotel.find(query);
        const filteredHotelsByCapacity = await Promise.all(hotels.map(async (hotel) => {
            const rooms = await Room.find({ hotel: hotel._id });
            const availableRooms = rooms.filter(room => room.capacity >= Number(numberOfPeople));
            return { hotel, availableRooms };
        }));

        const hotelsWithCapacity = filteredHotelsByCapacity.filter(hotel => hotel.availableRooms.length > 0);

        if (checkinDate && checkoutDate) {
            const reservedRooms = await Reservation.find({
                checkInDate: { $lt: new Date(checkoutDate) },
                checkOutDate: { $gt: new Date(checkinDate) }
            }).distinct('rooms');

            const availableHotels = hotelsWithCapacity.map(hotel => {
                const availableRooms = hotel.availableRooms.filter(room =>
                    !reservedRooms.includes(room._id.toString())
                );
                return { hotel: hotel.hotel, availableRooms };
            });

            const finalFilteredHotels = availableHotels.filter(hotel => hotel.availableRooms.length > 0);
            return res.status(200).json(finalFilteredHotels);
        }
        return res.status(200).json(hotelsWithCapacity);
    } catch (error) {
        console.error('Error fetching hotels:', error);
        res.status(500).json({ message: 'Error fetching hotels', error: error.message });
    }
};
