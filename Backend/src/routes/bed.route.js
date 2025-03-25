const express = require('express')
const BedRouter = express.Router();
const BedController = require('../controllers/bed.controller')

BedRouter.get('/get-all-bed', BedController.getAllBed);
BedRouter.get('/bed-detail/:roomId', BedController.getBedByRoomId);
BedRouter.get('/:id', BedController.getBedByBedId);

module.exports = BedRouter;