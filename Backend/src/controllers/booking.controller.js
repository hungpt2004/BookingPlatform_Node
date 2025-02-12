const asyncHandler = require('../middlewares/asyncHandler')
const Hotel = require('../models/hotel')
const Room = require('../models/room')
const Reservation = require('../models/reservation')


exports.createBooking = asyncHandler(async (req, res) => {
    const userId = req.user;
    const { hotelId, roomId, checkInDate, checkOutDate } = req.body;

    try {
        // Validate required fields
        if (!userId || !hotelId || !roomId || !checkInDate || !checkOutDate) {
            return res.status(400).json({ error: true, message: "Missing required fields" });
        }

        // Validate that the hotel exists
        const hotel = await Hotel.findById(hotelId);
        if (!hotel) {
            return res.status(404).json({ error: true, message: "Hotel not found" });
        }

        // Validate that the rooms exist, belong to the hotel, and have quantity > 0
        const rooms = await Room.find({ _id: { $in: roomId }, hotel: hotelId, quantity: { $gt: 0 } });

        if (rooms.length !== roomId.length) {
            return res.status(404).json({ error: true, message: "Some rooms were not found or do not belong to the specified hotel" });
        }


        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);


        // Validate that the user already booked the room
        const userBooked = await Reservation.find({
            rooms: { $in: roomId },
            hotel: hotelId,
            user: userId,
            status: { $nin: ["CANCELLED", "COMPLETED", "CHECKED_OUT"] },
        }).populate("rooms").select("rooms")


        // Extract room names from the populated result
        if (userBooked.length > 0) {
            console.log('userId', userId)
            console.log("userBooked", userBooked);

            const bookedRoomNames = userBooked
                .flatMap(reservation => reservation.rooms)
                .map(room => room.type);

            console.log("bookedRoomNames", bookedRoomNames);

            // Remove duplicates
            const uniqueNames = [...new Set(bookedRoomNames)];

            return res.status(400).json({
                error: true,
                message: `You already booked this room: ${uniqueNames.join(", ")}`
            });
        }

        // Check for existing reservations that overlap dates for room or rooms
        const overlapReservations = await Reservation.find({
            rooms: { $in: roomId },
            status: { $nin: ["CANCELLED", "COMPLETED", "CHECKED_OUT"] },
            $or: [
                { checkInDate: { $lte: checkOut }, checkOutDate: { $gte: checkIn } },
            ]
        }).populate("rooms");

        // If overlapping reservations exist return error message
        if (overlapReservations.length > 0) {
            const conflictRooms = overlapReservations
                .flatMap(res => res.rooms)
                .filter(room => roomId.includes(room._id.toString()))
                .map(room => room.type);

            const uniqueNames = [...new Set(conflictRooms)];

            return res.status(409).json({
                error: true,
                message: `Room(s) ${uniqueNames.join(", ")} are already booked during these dates.`
            })

        }

        // Calculate the total price based on room prices and duration
        const roomPrices = rooms.map((room) => room.price);
        const nights = (new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24);
        const totalPrice = roomPrices.reduce((sum, price) => sum + price, 0) * nights;

        // Create the reservation
        const reservation = new Reservation({
            user: userId,
            hotel: hotelId,
            rooms: roomId,
            checkInDate,
            checkOutDate,
            totalPrice,
            status: "BOOKED", // Default status
        });

        // // Save the reservation to the database
        // await reservation.save();

        // // Decrement the quantity of the booked rooms
        // for (const room of rooms) {
        //     room.quantity -= 1;
        //     await room.save();
        // }

        res.status(201).json({
            error: false,
            message: "Reservation created successfully",
            reservation,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: true, message: "Failed to create reservation" });
    }
});

