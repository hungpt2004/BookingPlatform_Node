const express = require('express');
const connectDB = require('./src/database_config/mongo_config')
const cors = require('cors')
const UserRouter = require('./src/routes/user.route');
const HotelRouter = require('./src/routes/hotel.route');
const ReservationRouter = require('./src/routes/reservation.route');
const PaymentRouter = require('./src/routes/payment.route');
const authenticateRoute = require('./src/routes/authenticate.route');
const FeedbackRouter = require('./src/routes/feedback.route');
require("dotenv").config();
const fileupload = require("express-fileupload");
const app = express(); //Create server
const path = require("path"); // 
const fs = require("fs");
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Hỗ trợ dữ liệu form-urlencoded
app.use(fileupload({ useTempFiles: true }));
//Cors setting
app.use(
   cors({
     origin: "*",
   })
 );
 

app.use("/customer", UserRouter)

//Middleware Routing
app.use("/user", authenticateRoute);

//Hotel
app.use("/hotel", HotelRouter);

//Reservation
app.use("/reservation", ReservationRouter);

//Payment
app.use("/payment", PaymentRouter);

//Feedback

app.use("/feedback", FeedbackRouter);

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