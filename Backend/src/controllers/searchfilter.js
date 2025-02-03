const Hotel = require("../models/hotel");
const Room = require("../models/room");
const Reservation = require("../models/reservation");

exports.searchAndFilterHotels = async (req, res) => {
  try {
    const {
      hotelName,
      address,
      checkinDate,
      checkoutDate,
      priceRange,
      numberOfPeople,
    } = req.query;
    let query = {};

    if (hotelName) {
      query.hotelName = { $regex: hotelName, $options: "i" }; //hotel name
    }

    if (address) {
      query.address = { $regex: address, $options: "i" };
    }

    if (priceRange) {
      const [minRating, maxRating] = priceRange.split("-").map(Number);
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

    //Filter khách sạn có phòng còn trống lớn hơn 0
    const hotelsWithCapacity = filteredHotelsByCapacity.filter(
      (hotel) => hotel.availableRooms.length > 0
    );

    if (checkinDate && checkoutDate) {

      if (checkinDate > checkoutDate) {
        return res.status(400).json({
          error: true,
          message: "CheckInDate can not before CheckOutDate",
        });
      }

      if (checkoutDate < Date.now()) {
        return res.status(400).json({
          error: true,
          message: "CheckOutDate can not after time now",
        });
      }

      //Change to check checkindate and checkoutdate of hotel
      const reservedRooms = await Reservation.find({
        checkInDate: { $lt: new Date(checkoutDate) },
        checkOutDate: { $gt: new Date(checkinDate) },
      }).distinct("rooms");

      const availableHotels = hotelsWithCapacity.map((hotel) => {
        const availableRooms = hotel.availableRooms.filter(
          (room) => !reservedRooms.includes(room._id.toString())
        );
        return { hotel: hotel.hotel, availableRooms };
      });

      const finalFilteredHotels = availableHotels.filter(
        (hotel) => hotel.availableRooms.length > 0
      );
      return res.status(200).json({
        error: false,
        finalFilteredHotels,
        message: "Searching Hotel Successfully",
      });
    }

    return res.json({
        error: false,
        hotelsWithCapacity,
        message:'Search successfully'
    })

  } catch (error) {
    res.status(500).json({
      error: true,
      message: "Error when fetch data",
    });
  }
};
