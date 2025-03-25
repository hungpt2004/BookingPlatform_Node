const asyncWrapper = require("../middlewares/asyncHandler");
const hotel = require("../models/hotel");
const reservation = require("../models/reservation");
const monthlyPayment = require("../models/monthlyPayment");
const mongoose = require("mongoose");
const dayjs = require("dayjs");
const cron = require("node-cron");
const nodemailer = require("nodemailer");
const { PERIODIC_PAYMENT_TEMPLATE, REFUND_CUSTOMER_TEMPLATE } = require("../templates/emailTemplates");
const user = require("../models/user");
const { formatCurrencyVND } = require("../utils/fomatPrice");
const refundingReservation = require("../models/refundingReservation");

exports.getMonthlyPaymentByMonthYear = asyncWrapper(async (req, res) => {
  const currentUserId = req.user.id;

  try {
    let { month, year, hotelId, name } = req.query;

    console.log(hotelId)

    const currentDate = dayjs();
    month = month ? parseInt(month) : currentDate.month() + 1;
    year = year ? parseInt(year) : currentDate.year();

    if (month < 1 || month > 12) {
      return res.status(400).json({
        success: false,
        message: "Month must be between 1 and 12.",
      });
    }

    let filter = { year, month };

    // Lọc danh sách các khách sạn thuộc sở hữu của owner hiện tại
    const ownedHotels = await hotel.find({ owner: currentUserId }).select("_id");

    // Nếu owner không có khách sạn nào
    if (ownedHotels.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        reservations: 0,
      });
    }

    // Nếu có hotelId, kiểm tra xem hotel đó có thuộc về owner không
    if (hotelId) {
      console.log(hotelId)
      hotelId = new mongoose.Types.ObjectId(hotelId);
      if (!ownedHotels.some((h) => h._id.equals(hotelId))) {
        return res.status(400).json({
          success: false,
          message: "You do not own this hotel.",
        });
      }
      filter.hotel = hotelId;
      console.log("khong co")
    } else {
      filter.hotel = { $in: ownedHotels.map((hotel) => hotel._id) };
    }

    if (name) {
      filter.name = { $regex: name, $options: "i" };
    }

    // Lấy danh sách monthlyPayments
    const monthlyPayments = await monthlyPayment.find(filter).populate("hotel");

    // Tạo khoảng thời gian cho tháng hiện tại
    const startDate = new Date(`${year}-${month.toString().padStart(2, "0")}-01`);
    const endDate = new Date(new Date(startDate).setMonth(startDate.getMonth() + 1));

    // Lọc reservation theo tháng, năm cho các khách sạn thuộc owner
    let reservationFilter = {
      hotel: { $in: ownedHotels.map((hotel) => hotel._id) },
      checkInDate: { $lt: endDate, $gt: startDate },
      checkOutDate: { $gte: startDate, $lt: endDate},
    };

    // Nếu có hotelId, chỉ lấy reservation của khách sạn đó
    if (hotelId) {
      reservationFilter.hotel = hotelId;
    }

    // Lấy tổng số lượng reservations
    const reservations = await reservation.countDocuments(reservationFilter);

    // Kiểm tra dữ liệu trả về
    console.log(await reservation.find(reservationFilter));

    console.log(reservationFilter)

    return res.status(200).json({
      success: true,
      data: monthlyPayments,
      reservations,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
});


exports.getMonthlyPaymentByMonthYearAdmin = asyncWrapper(async (req, res) => {
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

    // Lấy danh sách monthlyPayments dựa trên filter
    const monthlyPayments = await monthlyPayment.find(filter).populate("hotel");

    // Lấy danh sách reservation dựa trên hotelId hoặc tất cả
    let reservationFilter = {};

    if (hotelId) {
      reservationFilter.hotel = hotelId;
    }

    // Lọc reservation theo tháng, năm
    reservationFilter.checkInDate = {
      $gte: new Date(`${year}-${month}-01`),
      $lt: new Date(`${year}-${month + 1}-01`),
    };

    const reservations = await reservation.countDocuments(reservationFilter);

    return res.status(200).json({
      success: true,
      data: monthlyPayments,
      reservations,
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
    // Lấy tất cả khách sạn của chủ sở hữu
    const ownerHotels = await hotel.find({ owner: currentUser._id });
    const hotelIds = ownerHotels.map((item) => item._id);

    // Lấy tất cả đơn đặt phòng của khách sạn thuộc chủ sở hữu
    const reservations = await reservation.find({ hotel: { $in: hotelIds } });

    // Đếm số khách sạn đang hoạt động
    const activeHotelCount = await hotel.countDocuments({
      owner: currentUser._id,
      ownerStatus: "ACTIVE",
      adminStatus: "APPROVED",
    });

    // Tổng số lượng đơn đặt phòng
    const totalReservationAmount = reservations.length;

    // Tổng doanh thu (chỉ tính đơn thành công)
    const totalRevenue = reservations
      .filter((res) =>
        ["COMPLETED", "CHECKED OUT", "CHECK IN", "BOOKED"].includes(
          res.status
        )
      )
      .reduce((sum, res) => sum + res.totalPrice, 0);

    // Đếm số đơn đặt phòng bị hủy
    const cancelReservation = reservations.filter((res) =>
      ["CANCELLED", "PENDING"].includes(res.status)
    ).length;

    // Đơn đặt phòng hợp lệ
    const normalReservations = totalReservationAmount - cancelReservation;

    // Khởi tạo doanh thu theo tháng
    const monthlyRevenue = Array(12).fill(0);

    // Duyệt qua từng đơn đặt phòng
    reservations.forEach((res) => {
      if (
        ["COMPLETED", "CHECKED OUT", "CHECK IN", "BOOKED"].includes(
          res.status
        )
      ) {
        const checkIn = new Date(res.checkInDate);
        const checkOut = new Date(res.checkOutDate);

        let startMonth = checkIn.getMonth();
        let endMonth = checkOut.getMonth();

        if (startMonth === endMonth) {
          // Nếu check-in và check-out cùng một tháng -> cộng dồn vào tháng đó
          monthlyRevenue[startMonth] += res.totalPrice;
        } else {
          // Nếu check-in và check-out khác tháng -> chia doanh thu theo số ngày
          let totalDays = (checkOut - checkIn) / (1000 * 60 * 60 * 24); // Tổng số ngày ở
          let revenuePerDay = res.totalPrice / totalDays;

          let tempDate = new Date(checkIn);
          while (tempDate <= checkOut) {
            let monthIndex = tempDate.getMonth();
            monthlyRevenue[monthIndex] += revenuePerDay; // Cộng vào tháng tương ứng
            tempDate.setDate(tempDate.getDate() + 1); // Tăng ngày lên 1
          }
        }
      }
    });

    // Làm tròn giá trị doanh thu
    const formattedMonthlyRevenue = monthlyRevenue.map((revenue) =>
      Math.round(revenue)
    );

    // Debug
    formattedMonthlyRevenue.forEach((item) => console.log(item));

    return res.status(200).json({
      totalHotel: ownerHotels.length,
      activeHotel: activeHotelCount,
      totalRevenue,
      totalReservationAmount,
      cancelReservation,
      normalReservations,
      monthlyRevenue: formattedMonthlyRevenue, // Doanh thu theo tháng
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

exports.createMonthlyPayment = asyncWrapper(async (req, res) => {
  const newMonthlyPayment = new monthlyPayment(req.body);

  await newMonthlyPayment.save();

  console.log("Đã insert thành công");

  return res.status(200).send("Create monthly payment successfully");
});

exports.getAdminDashBoardData = asyncWrapper(async (req, res) => {
  try {
    // Lấy tất cả khách sạn
    const ownerHotels = await hotel.find();
    const hotelIds = ownerHotels.map((hotel) => hotel._id);

    // Lấy tất cả đơn đặt phòng
    const reservations = await reservation.find({ hotel: { $in: hotelIds } });

    // Đếm số khách sạn đang hoạt động
    const activeHotelCount = await hotel.countDocuments({
      ownerStatus: "ACTIVE",
      adminStatus: "APPROVED",
    });

    console.log(activeHotelCount);

    // Tổng số lượng đơn đặt phòng
    const totalReservationAmount = reservations.length;

    // Đếm số đơn đặt phòng bị hủy
    const cancelReservation = reservations.filter((res) =>
      ["CANCELLED", "PENDING"].includes(res.status)
    ).length;

    // Đơn đặt phòng hợp lệ
    const normalReservations = totalReservationAmount - cancelReservation;

    // Tổng doanh thu admin ăn 10%
    let totalRevenue = 0;

    // Khởi tạo doanh thu theo tháng (12 tháng)
    const monthlyRevenue = Array(12).fill(0);

    // Duyệt qua từng đơn đặt phòng
    reservations.forEach((res) => {
      if (
        ["COMPLETED", "CHECKED OUT", "CHECK IN", "BOOKED"].includes(
          res.status
        )
      ) {
        const checkIn = new Date(res.checkInDate);
        const month = checkIn.getMonth(); // Lấy tháng từ 0 - 11

        // Tính 10% doanh thu và cộng dồn vào tháng đó
        const adminRevenue = res.totalPrice * 0.1;
        monthlyRevenue[month] += adminRevenue; // Cộng dồn vào tháng tương ứng
        totalRevenue += adminRevenue; // Cộng dồn vào tổng doanh thu
      }
    });

    // Làm tròn doanh thu theo tháng
    const formattedMonthlyRevenue = monthlyRevenue.map((revenue) =>
      Math.round(revenue)
    );

    return res.status(200).json({
      totalHotel: ownerHotels.length,
      activeHotel: activeHotelCount,
      totalRevenue: Math.round(totalRevenue),
      totalReservationAmount,
      cancelReservation,
      normalReservations,
      monthlyRevenue: formattedMonthlyRevenue, // Doanh thu theo tháng
    });
  } catch (error) {
    console.error("Error getting dashboard data for admin:", error);
    throw error;
  }
});

exports.returnBackAmountForOwner = asyncWrapper(async (req, res) => {
  const { hotelId, monthlyId } = req.body;

  if (!hotelId || !monthlyId) {
    return res.status(400).json({
      message: "Hotel ID or Monthly ID is missing",
    });
  }

  let session;

  try {
    session = await mongoose.startSession();
    session.startTransaction();

    const currentHotel = await hotel.findOne({ _id: hotelId }).session(session);
    if (!currentHotel) {
      throw new Error("Hotel not found");
    }

    const owner = await user
      .findOne({ _id: currentHotel.owner })
      .session(session);
    if (!owner) {
      throw new Error("Owner not found");
    }

    // Set monthly payment status to PAID and set refundDate
    const currentMonthly = await monthlyPayment.findOneAndUpdate(
      { hotel: hotelId, _id: monthlyId },
      { $set: { status: "PAID", paymentDate: Date.now() } },
      { new: true, session } // Truyền session đúng cách
    );

    if (!currentMonthly) {
      throw new Error("Monthly payment not found");
    }

    // Send the Email
    await sendEmailForOwner(
      owner.email,
      owner.name,
      currentMonthly,
      currentHotel
    );

    await session.commitTransaction();
    await session.endSession();

    return res.status(200).json({
      message: "Payment for owner successfully",
    });
  } catch (error) {
    if (session && session.inTransaction()) {
      await session.abortTransaction();
      await session.endSession();
    }
    console.error("Error:", error.message);

    return res.status(500).json({
      error: true,
      message: error.message || "Failed to pay owner",
    });
  }
});

exports.returnBackAmountForCustomer = asyncWrapper(async (req, res) => {
  const { refundId, reservationId, customerName, email} = req.body;

  if (!refundId || !reservationId) {
    return res.status(500).json({
      message: "Id không hợp lệ",
    });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // UPDATE DESICION DATE AND STATUS
    const currentRefundReservation = await refundingReservation.findOne({
      _id: refundId,
      reservation: reservationId,
    });

    if (!currentRefundReservation) {
      return res.status(500).json({
        message: "Yêu cầu hủy không tìm thấy !",
      });
    }

    await refundingReservation.findOneAndUpdate(
      { _id: refundId, reservation: reservationId },
      {
        $set: {
          decisionDate: Date.now(),
          status: "APPROVED",
        },
      }
    );

    // UPDATE STATUS RESERVATION
    await reservation.findOneAndUpdate(
      { _id: reservationId },
      { $set: { status: "CANCELLED" } }
    );

    await sendEmailForCustomer(email,currentRefundReservation,customerName);

    console.log("Đơn đã được hủy");

    await session.commitTransaction();
    await session.endSession();

    return res.status(200).json({
      message: "Hoàn tiền và hủy đơn thành công !"
    })

  } catch (error) {
    if (session && session.inTransaction()) {
      await session.abortTransaction();
    }
    await session.endSession();
    return res.status(500).json({
      message: "Đã có lỗi khi xác nhận hủy đơn"
    })
  }

});

const transporter = nodemailer.createTransport({
  service: "gmail", // Hoặc dịch vụ bạn sử dụng
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASSWORD,
  },
});

const sendEmailForOwner = async (
  email,
  ownerName,
  currentMonthlyPayment,
  currentHotel
) => {
  console.log(currentMonthlyPayment.month);

  try {
    await transporter.sendMail({
      from: process.env.AUTH_EMAIL,
      to: email,
      subject: "Periodic Payment",
      html: PERIODIC_PAYMENT_TEMPLATE.replace(
        "{ownerName}",
        ownerName || "User"
      )
        .replace("{hotel}", currentHotel.hotelName)
        .replace("{location}", currentHotel.address)
        .replace(
          "{amount}",
          formatCurrencyVND(currentMonthlyPayment.amount * 0.9)
        )
        .replace("{month}", currentMonthlyPayment.month)
        .replace("{year}", currentMonthlyPayment.year)
        .replace("{paymentDate}", currentMonthlyPayment.paymentDate),
    });
    console.log("Email sent successfully!");
  } catch (error) {
    console.error("Failed to send email:", error);
  }
};

const sendEmailForCustomer = async (
  email,
  currentRefundReservation,
  customerName,
) => {
  try {
    await transporter.sendMail({
      from: process.env.AUTH_EMAIL,
      to: email,
      subject: "Periodic Payment",
      html: REFUND_CUSTOMER_TEMPLATE
        .replace("{customerName}", customerName)
        .replace("{refundAmount}", formatCurrencyVND(currentRefundReservation.refundAmount))
        .replace(
          "{reservationId}",
          currentRefundReservation.reservation
        )
        .replace("{decisionDate}", new Date())
    });
    console.log("Email sent successfully!");
  } catch (error) {
    console.error("Failed to send email:", error);
  }
};

// Lưu doanh thu hàng tháng cho tất cả các năm trong Reservation
const saveMonthlyRevenue = async () => {
  try {
    // Lấy tất cả khách sạn
    const hotels = await hotel.find();
    const hotelIds = hotels.map((hotel) => hotel._id);

    // Lấy tất cả đơn đặt phòng
    const reservations = await reservation.find({ hotel: { $in: hotelIds } });

    // Khởi tạo đối tượng lưu doanh thu
    const revenueByHotelMonthYear = {};

    // Duyệt qua từng đơn đặt phòng
    for (const res of reservations) {
      if (
        ["COMPLETED", "CHECKED OUT", "PROCESSING", "BOOKED"].includes(
          res.status
        )
      ) {
        const checkIn = new Date(res.checkInDate);
        const checkOut = new Date(res.checkOutDate);

        let tempDate = new Date(checkIn);
        while (tempDate <= checkOut) {
          let month = tempDate.getMonth() + 1; // Lấy tháng (1-12)
          let year = tempDate.getFullYear();
          let key = `${res.hotel}-${year}-${month}`;

          if (!revenueByHotelMonthYear[key]) {
            revenueByHotelMonthYear[key] = 0;
          }

          // Admin ăn 10%
          const revenue = res.totalPrice * 0.1;
          revenueByHotelMonthYear[key] += revenue;

          // Cập nhật lại totalPrice của Reservation sau khi trừ 10%
          res.totalPrice = Math.max(res.totalPrice - revenue, 0);

          tempDate.setDate(tempDate.getDate() + 1); // Tăng ngày lên 1
        }

        // Lưu lại thay đổi của Reservation
        await res.save();
      }
    }

    // Lưu hoặc cập nhật vào bảng monthly_payment
    for (const [key, amount] of Object.entries(revenueByHotelMonthYear)) {
      const [hotel, year, month] = key.split("-");
      const existingPayment = await monthlyPayment.findOne({
        hotel: hotel,
        month: parseInt(month),
        year: parseInt(year),
      });

      if (existingPayment) {
        existingPayment.amount += amount;
        await existingPayment.save();
      } else {
        await monthlyPayment.create({
          hotel: hotel,
          month: parseInt(month),
          year: parseInt(year),
          amount,
        });
      }
    }

    console.log(`Monthly revenue saved for all years.`);
  } catch (error) {
    console.error("Error saving monthly revenue:", error);
  }
};

// 1 hour auto 1 time
cron.schedule("0 * * * *", () => {
  console.log("Running monthly revenue job...");
  saveMonthlyRevenue();
});
