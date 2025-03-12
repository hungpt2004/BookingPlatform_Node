const asyncWrapper = require('../middlewares/asyncHandler')
const hotel = require('../models/hotel')
const reservation = require('../models/reservation')
const dayjs = require('dayjs')
const cron = require('node-cron')


exports.getMonthlyPaymentOfAllHotels = asyncWrapper(async (req, res) => {
  try {
    let { month, year } = req.query;

    const currentDate = dayjs();
    year = parseInt(year) || currentDate.year(); // Mặc định lấy năm hiện tại

    let filter = { year };

    // Nếu nhập month thì thêm vào filter, nếu không thì lấy cả 12 tháng
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

    // Truy vấn dữ liệu
    const payments = await MonthlyPayment.find(filter).populate("hotel", "name owner");

    return res.status(200).json({
      success: true,
      data: payments,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});



const calculateMonthlyPayments = async () => {
  try {
    console.log("🔄 Running Monthly Payment Calculation...");

    const year = dayjs().year();
    const month = dayjs().month() + 1; // tháng hiện tại (1 - 12)

    // 1️⃣ Lấy danh sách tất cả khách sạn
    const hotels = await hotel.find();
    if (!hotels.length) {
      console.log("❌ No hotels found.");
      return;
    }

    // 2️⃣ Lặp qua từng khách sạn để tính tổng số reservation & tổng tiền
    for (const hotel of hotels) {
      const reservations = await reservation.find({
        hotel: hotel._id,
        status: { $in: ["CHECKED OUT", "COMPLETED"] },
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
