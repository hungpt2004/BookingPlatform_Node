const Hotel = require("../models/hotel");
const Room = require("../models/room");
const Reservation = require("../models/reservation");
const { HOTEL } = require("../utils/constantMessage");

exports.searchAndFilterHotels = async (req, res) => {
  try {
    const {
      hotelName,
      address,
      checkinDate,
      checkoutDate,
      hotelRating,
      numberOfPeople,
      page = 1, 
      limit = 8, 
    } = req.query;

    let query = {};

    if (hotelName) {
      query.hotelName = { $regex: hotelName, $options: "i" };
    }

    if (address) {
      query.address = { $regex: address, $options: "i" };
    }

    if (hotelRating) {
      const [minRating, maxRating] = hotelRating.split("-").map(Number);
      if (isNaN(minRating) || isNaN(maxRating)) {
        return res.status(400).json({ error: true, message: "Invalid price range" });
      }
      query.rating = { $gte: minRating, $lte: maxRating };
    }

    const allHotels = await Hotel.find(query);

    const filteredByCapacity = await Promise.all(
      allHotels.map(async (hotel) => {
        const rooms = await Room.find({ hotel: hotel._id });
        const availableRooms = rooms.filter(
          (room) => room.capacity >= Number(numberOfPeople)
        );
        return { hotel, availableRooms };
      })
    );

    const hotelsWithCapacity = filteredByCapacity.filter(
      (hotel) => hotel.availableRooms.length > 0
    );
    let finalHotels = hotelsWithCapacity;
    if (checkinDate && checkoutDate) {
      if (checkinDate > checkoutDate) {
        return res.status(400).json({
          error: true,
          message: "CheckInDate cannot be before CheckOutDate",
        });
      }

      if (new Date(checkoutDate) < new Date()) {
        return res.status(400).json({
          error: true,
          message: "CheckOutDate cannot be in the past",
        });
      }

      const reservedRooms = await Reservation.find({
        checkInDate: { $lt: new Date(checkoutDate) },
        checkOutDate: { $gt: new Date(checkinDate) },
      }).distinct("rooms");

      const availableHotels = hotelsWithCapacity.map((hotel) => {
        const availableRooms = hotel.availableRooms.filter(
          (room) => !reservedRooms.some(reservedRoom => reservedRoom.equals(room._id))
        );
        return { hotel: hotel.hotel, availableRooms };
      });

      finalHotels = availableHotels.filter(
        (hotel) => hotel.availableRooms.length > 0
      );
    }

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedHotels = finalHotels.slice(startIndex, endIndex);

    return res.status(200).json({
      error: false,
      hotels: paginatedHotels,
      totalPages: Math.ceil(finalHotels.length / limit),
      currentPage: Number(page),
      message: HOTEL.SUCCESS
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error
    });
  }
};