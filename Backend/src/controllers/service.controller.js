const HotelService = require('../models/hotelService');
const asyncHandler = require("../middlewares/asyncHandler");
exports.getAllHotelServices = asyncHandler(async (req, res) => {
    const services = await HotelService.find();

    if (services.length === 0) {
        return res.status(404).json({
            error: true,
            message: 'No services found',
        });
    }

    return res.status(200).json({
        error: false,
        services,
        message: 'Get all services success',
    });
});