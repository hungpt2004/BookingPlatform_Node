const express = require("express");
const connectDB = require("./src/database_config/mongo_config");
const cors = require("cors");
const UserRouter = require("./src/routes/user.route");
const HotelRouter = require("./src/routes/hotel.route");
const ReservationRouter = require("./src/routes/reservation.route");
const PaymentRouter = require("./src/routes/payment.route");
const authenticateRoute = require("./src/routes/authenticate.route");
const FavoriteRouter = require("./src/routes/favorite.route");
const FeedbackRouter = require("./src/routes/feedback.route");
const RoomRouter = require("./src/routes/room.route");
const BedRouter = require("./src/routes/bed.route");
const HotelServiceRouter = require("./src/routes/hotel.service.route");
const hotelFacilityRouter = require("./src/routes/hotelFacility.route");
const roomFacilityRouter = require("./src/routes/roomFacility.route");
const hotelApprovalRouter = require("./src/routes/hotel.approval.route");
require("dotenv").config();
const fileupload = require("express-fileupload");
const app = express(); //Create server
const path = require("path");
const fs = require("fs");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const MonthlyRouter = require("./src/routes/monthlypayment.route");
const PDFRouter = require("./src/routes/pdf.route");

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Hỗ trợ dữ liệu form-urlencoded
app.use(fileupload({ useTempFiles: true }));
app.use(cookieParser());

//Cors setting
const allowedOrigins = ["http://localhost:5173"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    credentials: true,
  })
);

//Session setting
app.use(
  session({
    secret: process.env.SECRET_KEY, // Khóa bí mật để mã hóa session
    resave: false, // Không lưu lại session nếu không có thay đổi
    saveUninitialized: false, // Không lưu session trống
    cookie: {
      maxAge: 5 * 60 * 1000, // Thời gian hết hạn session (5p)
    },
  })
);

//Customer
app.use("/customer", UserRouter);

//Authentication
app.use("/user", authenticateRoute);

//Hotel
app.use("/hotel", HotelRouter);

//Reservation
app.use("/reservation", ReservationRouter);

//Payment
app.use("/payment", PaymentRouter);

//Favorite
app.use("/favorite", FavoriteRouter);

//Feedback
app.use("/feedback", FeedbackRouter);

//Room
app.use("/room", RoomRouter);

//Bed
app.use("/bed", BedRouter);

//Hotel Service
app.use("/hotel-service", HotelServiceRouter);

//Monthly Payment
app.use("/monthly-payment", MonthlyRouter);

//PDF
app.use("/pdf", PDFRouter);

//facility
app.use("/facility", hotelFacilityRouter);

//RoomFacility
app.use("/roomFacility", roomFacilityRouter);

//Approval
app.use("/hotel-approval", hotelApprovalRouter);

//Connect Mongo Config
connectDB();

//Listen Server
app.listen(process.env.PORT || 8080, () =>
  console.log("Server is running at ", process.env.PORT || 8080)
);

// Xóa thư mục `/tmp` khi server khởi động
const tempFolder = path.join(__dirname, "tmp");
fs.rm(tempFolder, { recursive: true, force: true }, (err) => {
  if (err) console.error("Lỗi khi dọn dẹp thư mục tmp:", err);
  else console.log("Đã dọn dẹp thư mục tmp");
});
