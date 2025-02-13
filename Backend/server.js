const express = require('express');
const connectDB = require('./src/database_config/mongo_config')
const cors = require('cors')
const UserRouter = require('./src/routes/user.route');
const HotelRouter = require('./src/routes/hotel.route');
const ReservationRouter = require('./src/routes/reservation.route');
const PaymentRouter = require('./src/routes/payment.route');
const authenticateRoute = require('./src/routes/authenticate.route');
const FeedbackRouter = require('./src/routes/feedback.route');
const RoomRouter = require('./src/routes/room.route');
require("dotenv").config();

const app = express(); //Create server

app.use(express.json());

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
app.use("/payment", PaymentRouter)

//Feedback
app.use("/feedback", FeedbackRouter)

//Room
app.use('/room', RoomRouter)

//Connect Mongo Config
connectDB();

//Listen Server
app.listen(process.env.PORT || 8080, () => console.log("Server is running at ",process.env.PORT || 8080));