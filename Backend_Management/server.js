const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./src/database_config/mongo_config');
const UserRouter = require('./src/routes/userRoute');
const HotelRouter = require('./src/routes/hotelRoute');
require('dotenv').config({ path: './config.env' });

const app = express(); //Create server

app.use(express.json());

//Cors setting
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }),
);

//Body Parser
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

//Test Middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.cookies);
  next();
});

//Middleware Routing
app.use('/user', UserRouter);

//Hotel
app.use('/hotel', HotelRouter);

//Connect Mongo Config
connectDB();

//Listen Server
app.listen(process.env.PORT || 8080, () =>
  console.log('Server is running at ', process.env.PORT || 8080),
);
