const asyncWrapper = require('../middlewares/asyncHandler')
const hotel = require('../models/hotel')
const reservation = require('../models/reservation')
const monthlyPayment = require('../models/monthlyPayment')
const mongoose = require('mongoose')
const dayjs = require('dayjs')
const cron = require('node-cron')


exports.getMonthlyPaymentByMonthYear = asyncWrapper(async (req, res) => {
  try {
    let { month, year, hotelId, name } = req.query;

    const currentDate = dayjs();
    month = month ? parseInt(month) : currentDate.month() + 1; // Thêm +1 để đúng format
    year = year ? parseInt(year) : currentDate.year();

    let filter = { year, month };

    if (month) {
      month = parseInt(month);
      if (month < 1 || month > 12) {
        return res.status(400).json({
          success: false,
          message: "Month must be between 1 and 12.",
        });
      }
      filter.month = month;
    }

    if (hotelId) {
      hotelId = new mongoose.Types.ObjectId(hotelId);
      filter.hotel = hotelId;
    }

    if (name) {
      filter.name = { $regex: name, $options: "i" }; // Case-insensitive search
    }

    const monthlyPayments = await monthlyPayment.find(filter);

    console.log(hotelId)
    console.log(month)
    console.log(year)
    console.log(monthlyPayments)

    const reservations = (await reservation.find({hotel: hotelId})).length;


    return res.status(200).json({
      success: true,
      data: monthlyPayments,
      reservations
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
});

exports.getDashBoardData = asyncWrapper(async (req, res) => {
  const currentUser = req.user;

  try {
    // Get all hotels of owner
    const ownerHotels = await hotel.find({ owner: currentUser._id });
    const hotelIds = ownerHotels.map((item) => item._id);

    // Get all reservations of owner hotels
    const reservations = await reservation.find({ hotel: { $in: hotelIds } });

    // Count active hotels
    const activeHotelCount = await hotel.countDocuments({
      owner: currentUser._id,
      ownerStatus: "ACTIVE",
      adminStatus: "APPROVED",
    });

    // Total reservations
    const totalReservationAmount = reservations.length;

    // Total revenue (only successful bookings)
    const totalRevenue = reservations
      .filter((res) =>
        ["COMPLETED", "CHECKED OUT", "PROCESSING", "BOOKED"].includes(res.status)
      )
      .reduce((sum, res) => sum + res.totalPrice, 0);

    // Count canceled reservations
    const cancelReservation = reservations.filter((res) =>
      ["CANCELLED", "PENDING"].includes(res.status)
    ).length;

    // Normal reservations (successful bookings)
    const normalReservations = totalReservationAmount - cancelReservation;

    // Initialize revenue per month
    const monthlyRevenue = Array(12).fill(0); // Mảng chứa doanh thu từng tháng

    // Lọc dữ liệu doanh thu theo từng tháng
    reservations.forEach((res) => {
      if (["COMPLETED", "CHECKED OUT", "PROCESSING", "BOOKED"].includes(res.status)) {
        const monthIndex = new Date(res.checkInDate).getMonth(); // Lấy tháng (0-11)
        monthlyRevenue[monthIndex] += res.totalPrice; // Cộng tổng doanh thu vào tháng tương ứng
      }
    });

    // Tính doanh thu trung bình của từng tháng
    const averageMonthlyRevenue = monthlyRevenue.map((revenue) =>
      hotelIds.length > 0 ? Math.round(revenue / hotelIds.length) : 0
    );

    return res.status(200).json({
      totalHotel: ownerHotels.length,
      activeHotel: activeHotelCount,
      totalRevenue,
      totalReservationAmount,
      cancelReservation,
      normalReservations,
      averageMonthlyRevenue, // Thêm dữ liệu trung bình theo tháng
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

exports.createMonthlyPayment = asyncWrapper(async(req, res) => {

  const newMonthlyPayment = new monthlyPayment(req.body)

  await newMonthlyPayment.save();

  console.log("Đã insert thành công")

  return res.status(200).send("Create monthly payment successfully");

});

const calculateMonthlyPayments = async () => {
  try {
    console.log("🔄 Running Monthly Payment Calculation...");

    const year = dayjs().year();
    const month = dayjs().month() + 1; // tháng hiện tại (1 - 12)

    // 1️⃣ Lấy danh sách tất cả khách sạn
    const hotels = await hotel.find();
    if (!hotels.length) {
      console.log("No hotels found");
      return;
    }

    // 2️⃣ Lặp qua từng khách sạn để tính tổng số reservation & tổng tiền
    for (const hotel of hotels) {
      const reservations = await reservation.find({
        hotel: hotel._id,
        status: { $in: ["CHECKED OUT", "COMPLETED", "PROCESSING", "BOOKED"] },
        checkOutDate: {
          $gte: dayjs().startOf("month").toDate(),
          $lte: dayjs().endOf("month").toDate(),
        },
      });

      const totalReservations = reservations.length;
      const totalAmount = reservations.reduce((sum, res) => sum + res.totalPrice, 0);

      console.log(`🏨 Hotel: ${hotel.name} | Total Reservations: ${totalReservations} | Total Amount: ${totalAmount}`);

      // 3️⃣ Kiểm tra nếu đã có MonthlyPayment cho tháng này, thì cập nhật
      const existingPayment = await MonthlyPayment.findOne({
        hotel: hotel._id,
        month,
        year,
      });

      if (existingPayment) {
        existingPayment.amount = totalAmount;
        await existingPayment.save();
        console.log(`✅ Updated MonthlyPayment for hotel ${hotel.name}`);
      } else {
        // Nếu chưa có, tạo mới
        await MonthlyPayment.create({
          hotel: hotel._id,
          month,
          year,
          amount: totalAmount,
        });
        console.log(`✅ Created MonthlyPayment for hotel ${hotel.name}`);
      }
    }
  } catch (error) {
    console.error("❌ Error calculating monthly payments:", error);
  }
};

// 4️⃣ Định nghĩa cron job chạy vào 23:59 ngày cuối cùng của mỗi tháng
cron.schedule("59 23 28-31 * *", async () => {
  const today = dayjs();
  const lastDayOfMonth = today.endOf("month").date();
  
  if (today.date() === lastDayOfMonth) {
    await calculateMonthlyPayments();
  }
}, {
  timezone: "Asia/Ho_Chi_Minh"
});
