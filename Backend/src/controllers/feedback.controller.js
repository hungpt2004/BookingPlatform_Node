const Feedback = require('../models/feedback')
const asyncHandler = require('../middlewares/asyncHandler')


exports.getAllFeedBackByHotelId = asyncHandler( async (req, res) => {
   
   const { hotelId } = req.params;

   const feedback = await Feedback.find({ hotel: hotelId });

   if (feedback.length === 0) {
      return res.status(401).json({
         error: true,
         message: "No have any feedback"
      })
   }

   return res.status(200).json({
      error: false,
      feedback,
      message: "Get all feed by hotel id success"
   })

})