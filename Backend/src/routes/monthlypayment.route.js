// const express = require("express");
// const MonthlyRouter = express.Router();
// const MonthlyController = require("../controllers/monthlyPayment.controller");
// const authController = require("./../controllers/authenticate.controller");
// const router = express.Router();

// router.use(authController.protect);

// MonthlyRouter.get("/", protect, MonthlyController.getDashBoardData);

// module.exports = MonthlyRouter;

//fix like below

const express = require("express");
const MonthlyRouter = express.Router();
const MonthlyController = require("../controllers/monthlyPayment.controller");
const authController = require("../controllers/authenticate.controller");

// Áp dụng middleware bảo vệ cho tất cả các route trong router này
MonthlyRouter.use(authController.protect);

// Lấy dữ liệu dashboard - chỉ cho phép OWNER truy cập
MonthlyRouter.get(
  "/owner",
  authController.restrictTo("OWNER"),
  MonthlyController.getDashBoardData
);

MonthlyRouter.get(
  "/admin",
  authController.restrictTo("ADMIN"),
  MonthlyController.getAdminDashBoardData
);

MonthlyRouter.post(
  "/create",
  authController.restrictTo("OWNER"),
  MonthlyController.createMonthlyPayment
);

MonthlyRouter.get(
  '/monthly-data',
  authController.restrictTo("OWNER"),
  MonthlyController.getMonthlyPaymentByMonthYear
)

// Nếu cần thêm route cho các role khác thì làm như này:
// MonthlyRouter.get('/admin-stats', authController.restrictTo("ADMIN"), MonthlyController.getAdminStats);
// MonthlyRouter.get('/customer-view', authController.restrictTo("CUSTOMER"), MonthlyController.getCustomerView);

module.exports = MonthlyRouter;
