const express = require('express');
const connectDB = require('./src/database_config/mongo_config')
const cors = require('cors')
const UserRouter = require('./src/routes/user.route');
const HotelRouter = require('./src/routes/hotel.route');
require("dotenv").config();

const app = express(); //Create server

app.use(express.json());

//Cors setting
app.use(
   cors({
     origin: "*",
   })
 );
 

//Middleware Routing
app.use("/user", UserRouter);

//Hotel
app.use("/hotel", HotelRouter);

//Connect Mongo Config
connectDB();

//Listen Server
app.listen(process.env.PORT || 8080, () => console.log("Server is running at ",process.env.PORT || 8080));