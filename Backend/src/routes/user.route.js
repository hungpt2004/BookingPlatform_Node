const express = require("express");
const UserRouter = express.Router();
const UserController = require("../controllers/user.controller");
const { authenticateToken } = require("../utils/authenticateToken");


UserRouter.route("/")
  .get(authenticateToken, UserController.getUser);


UserRouter.route("/:id")
  .patch(UserController.updateUser)
  .delete(UserController.deleteUser);

UserRouter.put(
  "/update-avatar/:id",
  authenticateToken,
  UserController.updateAvatar
);

UserRouter.get("/current-user",
  UserController.getCurrentUser);


module.exports = UserRouter;
