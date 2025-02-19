const express = require("express");
const UserRouter = express.Router();
const UserController = require("../controllers/user.controller");
const SearchController = require("../controllers/searchfilter");
const { protect } = require("../controllers/authenticate.controller");
const authController = require("./../controllers/authenticate.controller");
const router = express.Router();

router.use(authController.protect);

UserRouter.get("/get-all-user", UserController.getAllUser);
UserRouter.get("/search", SearchController.searchAndFilterHotels);

UserRouter.route("/:id")
  .patch(UserController.updateUser)
  .delete(UserController.deleteUser);

UserRouter.put("/update-avatar/:id", protect, UserController.updateAvatar);

UserRouter.get("/current-user", protect, UserController.getCurrentUser);

module.exports = UserRouter;
