const asyncHandler = require("../middlewares/asyncHandler");
const Reservation = require("../models/reservation");
const cron = require('node-cron')

exports.getALlReservation = asyncHandler(async (req, res) => {
  //Get user
  //const user = req.user.user;

  //Get all reservation sort with total price increase
  //   const reservations = await Reservation.find({ user: user }).sort({
  //     totalPrice: -1,
  //   });

  const reservations = await Reservation.find();

//   if (!user) {
//     return res.status(500).json({
//       error: true,
//       message: "Authenticated user failed",
//     });
//   }

   console.log(reservations)

  if (reservations.length === 0) {
    return res.status(404).json({
      error: true,
      message: "No have any reservations",
    });
  }

  return res.status(200).json({
    error: false,
    reservations,
    message: "Get all reservations success",
  });

});


exports.getRoomByReservationId = asyncHandler(async (req, res) => {

   //user

   const { reservationId } = req.params;

   const rooms = await Reservation.find({ _id: reservationId }).populate('rooms');


   if(rooms.length === 0) {
      return res.status(404).json({
         error: true,
         message: "No have any rooms",
       });
   }

   return res.status(200).json({
      error: false,
      rooms,
      message: "Get all rooms success",
    });
  

})


exports.getReservationByStatus = asyncHandler(async (req, res) => {

   //user

   const { status } = req.query;

   console.log(`This is ${status}`)

   if (!status) {
      return res.status(400).json({
        error: true,
        message: "Query parameter 'status' is required",
      });
    }
  
    let reservations = null;

   if(status === 'ALL') {
      reservations = await Reservation.find();
      if(reservations.length === 0) {
         return res.status(404).json({
            error: true,
            message: "No have any reservations",
          });
      }
   
      return res.status(200).json({
         error: false,
         reservations,
         message: "Get reservations by 'ALL' successfully",
       });
   }

   reservations = await Reservation.find({status})

   //Need user id to verify

   if(reservations.length === 0) {
      return res.status(404).json({
         error: true,
         message: "No have any rooms",
       });
   }

   return res.status(200).json({
      error: false,
      reservations,
      message: `Get reservations by ${status} successfully`,
    });
  

})


//automatic update status of reservations
const autoUpdateReservationStatus = asyncHandler( async () => {
   const currentDate = new Date();

   const reservations = await Reservation.find();

   for(const r of reservations) {

      //1. Update from Booked to CheckIn
      if ( currentDate < r.checkInDate ) r.status = "CHECKED_IN"

      //2. Update from CheckIn to CheckOut
      if ( currentDate > r.checkOutDate ) r.status = "CHECKED_OUT"

      await Reservation.updateOne(
         {_id: r._id},
         {$set: { status: r.status }}
      )

      console.log(`Updated status for note ID ${r._id} to ${r.status}`);
   }

})

//setinterval auto run after each minutes
cron.schedule('* * * * *', () => {
   console.log("THIS FUNCTION AUTO UPDATE EVERY MINUTES");
   autoUpdateReservationStatus();
})