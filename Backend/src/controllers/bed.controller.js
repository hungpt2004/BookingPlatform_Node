const Bed = require('../models/bed')
const Room = require('../models/room')
const asyncHandler = require('../middlewares/asyncHandler')
const { ROOM } = require('../utils/constantMessage')

exports.getBedByRoomId = asyncHandler(async (req, res) => {

   const {roomId} = req.params

   console.log(roomId)

   if(!roomId){
      return res.status(500).json({
         error: true,
         message: ROOM.INVALID_ID
      })
   }

   const bed = await Room.findOne(
      {_id: roomId},
   )
   .populate('bed')

   if(!bed) {
      return res.status(500).json({
         error: true,
         message: ROOM.NOT_FOUND
      })
   }

   return res.status(200).json({
      error: false,
      bed: bed.bed,
      message: ROOM.SUCCESS
   })

})

exports.getBedByBedId = asyncHandler(async (req, res) => {

   const {id} = req.params;

   const bed = await Bed.findOne(
      {_id: id}
   )

   return res.status(200).json({
      error: false,
      bed,
      message: ROOM.SUCCESS
   })

})