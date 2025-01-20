const express = require('express');
const UserRouter = express.Router();
const UserController = require('../controllers/user.controller')

UserRouter.get("/get-all-user", UserController.getAllUser);

module.exports = UserRouter;