const asyncHandler = require('../middlewares/asyncHandler')
const Hotel = require('../models/hotel')

exports.getAllHotels = asyncHandler(async (req, res) => {

   const hotels = await Hotel.find();

   if (hotels.length === 0) {
      return res.status(404).json({
         error: true,
         message: "No hotels found"
      });
   }

   return res.status(200).json({
      error: false,
      hotels,
      message: "Get all hotels success"
   })

})


