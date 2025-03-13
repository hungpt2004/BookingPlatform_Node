const express = require('express')
const MonthlyRouter = express.Router();
const MonthlyController = require('../controllers/monthlyPayment.controller')
const {
  restrictTo,
  protect,
} = require("../controllers/authenticate.controller");
const authController = require("./../controllers/authenticate.controller");
const router = express.Router();

router.use(authController.protect)

MonthlyRouter.get('/', protect, MonthlyController.getDashBoardData);

module.exports = MonthlyRouter;

