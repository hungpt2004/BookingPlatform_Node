const Hotel = require("../models/hotel");
const Room = require("../models/room")

exports.searchAndFilterHotels = async (req, res) => {
  try {
    const {hotelName,address,checkinDate,checkoutDate,hotelRating,numberOfPeople,} = req.query;
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

    const hotels = await Hotel.find(query);
    const filteredHotelsByCapacity = await Promise.all(
      hotels.map(async (hotel) => {
        const rooms = await Room.find({ hotel: hotel._id });
        const availableRooms = rooms.filter(
          (room) => room.capacity >= Number(numberOfPeople)
        );
        return { hotel, availableRooms };
      })
    );

    const hotelsWithCapacity = filteredHotelsByCapacity.filter(
      (hotel) => hotel.availableRooms.length > 0
    );

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

      const finalFilteredHotels = availableHotels.filter(
        (hotel) => hotel.availableRooms.length > 0
      );
      return res.status(200).json(finalFilteredHotels);
      return res.status(200).json(finalFilteredHotels);
    }
    return res.status(200).json(hotelsWithCapacity);
  } catch (error) {
    console.error("Error fetching hotels:", error);
    res
      .status(500)
      .json({ message: "Error fetching hotels", error: error.message });
  }
};