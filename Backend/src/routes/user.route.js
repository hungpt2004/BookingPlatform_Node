const express = require("express");
const UserRouter = express.Router();
const UserController = require("../controllers/user.controller");
const SearchController = require("../controllers/searchfilter");
const { protect } = require("../controllers/authenticate.controller");
const authController = require("./../controllers/authenticate.controller");
const router = express.Router();

router.use(authController.protect);

UserRouter.get("/get-all-user", UserController.getAllUser);
UserRouter.get("/get-all-owner", UserController.getOwnerUser);
UserRouter.get("/get-all-customer", UserController.getCustomerUser);

UserRouter.get("/search", SearchController.searchAndFilterHotels);

UserRouter.route("/update-profile")
  .patch(protect, UserController.updateUser)
  .delete(UserController.deleteUser);

UserRouter.put("/update-avatar/:id", protect, UserController.updateAvatar);

UserRouter.get("/current-user", protect, UserController.getCurrentUser);
 UserRouter.put("/toggle-lock/:userId", protect, UserController.toggleLock);

module.exports = UserRouter;
