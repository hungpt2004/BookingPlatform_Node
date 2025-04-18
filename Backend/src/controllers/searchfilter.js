const Hotel = require("../models/hotel");
const Room = require("../models/room");
const Reservation = require("../models/reservation");
const HotelService = require("../models/hotelService");
const HotelFacility = require("../models/hotelFacility");
const RoomFacility= require("../models/hotelFacility");
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
      serviceNames,
      facilityNames,
      page = 1,
      limit = 4,
    } = req.query;

    console.log('Address ',address)

    let query = { adminStatus:"APPROVED", ownerStatus:"ACTIVE" };

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
      // query.star = { $gte: minRating, $lte: maxRating };
    }

    if (serviceNames) {
      const serviceArray = serviceNames.split(',');
      const services = await HotelService.find({
        name: { $in: serviceArray.map(name => new RegExp(`^${name}$`, 'i')) }
      });
      query.services = { $in: services.map(s => s._id) };
    }
    
    const allHotels = await Hotel.find(query)
      .populate('services')
    const hotelsWithRooms = await Promise.all(
      allHotels.map(async (hotel) => {
        const rooms = await Room.find({ hotel: hotel._id });
        return { hotel, rooms };
      })
    );

    let finalHotels = [];

    if (checkinDate && checkoutDate) {
      const overlappingReservations = await Reservation.find({
        $and: [
          { checkInDate: { $lt: new Date(checkoutDate) } },
          { checkOutDate: { $gt: new Date(checkinDate) } }
        ]
      });

      const reservedRoomIds = overlappingReservations.flatMap(reservation =>
        reservation.rooms.map(room => room.room.toString())
      );

      finalHotels = hotelsWithRooms.map(({ hotel, rooms }) => {
        const availableRooms = rooms.filter(room =>
          !reservedRoomIds.includes(room._id.toString())
        );
        const totalCapacity = availableRooms.reduce((sum, room) => sum + room.capacity, 0);
        return { hotel, availableRooms, totalCapacity };
      }).filter(({ totalCapacity }) => totalCapacity >= Number(numberOfPeople));
    } else {
      finalHotels = hotelsWithRooms.map(({ hotel, rooms }) => {
        const totalCapacity = rooms.reduce((sum, room) => sum + room.capacity, 0);
        return { hotel, availableRooms: rooms, totalCapacity };
      }).filter(({ totalCapacity }) => totalCapacity >= Number(numberOfPeople));
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
    console.error('Server error:', error);
    res.status(500).json({
      error: true,
      message: error.message || 'Internal server error'
    });
  }
};
exports.getAllServiceToSearch = async (req, res) =>{
  try {
    const services = await HotelService.aggregate([
      { $group: { 
          _id: { $toLower: "$name" }, 
          name: { $first: "$name" } 
        } 
      },
      { $project: { _id: 0, name: 1 } }
    ]);
    res.status(200).json({ error: false, services: services.map(s => s.name) });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
}
