const express = require('express');
const connectDB = require('./src/database_config/mongo_config')

const app = express(); //Create server

app.use(express.json());

const port = 3000;

//Middleware Routing


//Connect Mongo Config
connectDB();

//Listen Server
app.listen(port, () => console.log("Server is running at ",port));