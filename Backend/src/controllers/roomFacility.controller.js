const asyncHandler = require("../middlewares/asyncHandler.js");
const roomFacility = require('../models/roomFacility');

exports.getAllHotelFacilities = asyncHandler(async (req, res) => {
    const facilities = await roomFacility.find();

    if (facilities.length === 0) {
        return res.status(404).json({
            error: true,
            message: 'No facilities found',
        });
    }

    return res.status(200).json({
        error: false,
        facilities,
        message: 'Get all facilities success',
    });
});

exports.getAllHotelFacilitiesSortByName = asyncHandler(async (req, res) => {
    try {
        const facilities = await roomFacility.aggregate([
            {
                $group: {
                    _id: "$name", // Group by name to remove duplicates
                    hotel: { $first: "$hotel" }, // Keep the first occurrence
                    description: { $first: "$description" },
                    url: { $first: "$url" }
                }
            },
            {
                $sort: { _id: 1 } // Sort by name (ascending)
            }
        ]);

        if (facilities.length === 0) {
            return res.status(404).json({
                error: true,
                message: 'No facilities found',
            });
        }

        return res.status(200).json({
            error: false,
            facilities,
            message: 'Get all unique facilities success',
        });

    } catch (error) {
        console.error("Error fetching hotel facilities:", error);
        res.status(500).json({
            error: true,
            message: "Server error fetching hotel facilities",
        });
    }
});
