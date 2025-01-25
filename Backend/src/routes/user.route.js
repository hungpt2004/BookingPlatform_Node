const express = require('express');
const UserRouter = express.Router();
const UserController = require('../controllers/user.controller')
const SearchController = require('../controllers/searchfilter')

UserRouter.get("/get-all-user", UserController.getAllUser);
UserRouter.get("/search", SearchController.searchAndFilterHotels);

module.exports = UserRouter;