const asyncWrapper = require('../middlewares/asyncHandler');
const hotelFacility = require('../models/hotelFacility');


exports.getAllHotelFacilities = asyncWrapper(async (req, res) => {
    const hotelFacilities = await hotelFacility.find();

    if (hotelFacilities.length === 0) {
        return res.status(404).json({
            error: true,
            message: "No hotelFacilities found",
        });
    }

    return res.status(200).json({
        error: false,
        hotelFacilities,
        message: "Get all hotelFacilities success",
    });
});

exports.createHotelFacility = asyncWrapper(async (req, res) => {
    try {
        console.log(req.body);

        if (!req.body || req.body.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Dữ liệu gửi lên không hợp lệ!",
            });
        }

        // Nếu dữ liệu là một object đơn lẻ, chuyển thành mảng
        const facilities = Array.isArray(req.body) ? req.body : [req.body];

        // Lưu vào database
        const newFacilities = await hotelFacility.insertMany(facilities);

        return res.status(201).json({
            success: true,
            message: "Thêm dịch vụ khách sạn thành công!",
            data: newFacilities,
        });

    } catch (error) {
        console.error("Lỗi khi tạo dịch vụ khách sạn:", error);
        return res.status(500).json({
            success: false,
            message: "Lỗi máy chủ khi tạo dịch vụ khách sạn.",
            error: error.message,
        });
    }
});
