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

//
exports.getAllHotelServicesSortByName = asyncHandler(async (req, res) => {
    try {
        const services = await HotelService.aggregate([
            {
                $group: {
                    _id: "$name", // Group by the 'name' field
                    hotel: { $first: "$hotel" }, // Keep the first occurrence
                    price: { $first: "$price" } // Keep the first occurrence
                }
            },
            {
                $sort: { _id: 1 } // Sort by name (ascending)
            }
        ]);

        if (services.length === 0) {
            return res.status(404).json({
                error: true,
                message: 'No services found',
            });
        }

        return res.status(200).json({
            error: false,
            services,
            message: 'Get all unique services success',
        });

    } catch (error) {
        console.error("Error fetching hotel services:", error);
        res.status(500).json({
            error: true,
            message: "Server error fetching hotel services",
        });
    }
});