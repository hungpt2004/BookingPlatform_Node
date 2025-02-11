const express = require("express");
const UserRouter = express.Router();
const UserController = require("../controllers/user.controller");
const SearchController = require("../controllers/searchfilter");
const authController = require("../controllers/authenticate.controller");
const avatarController = require("../controllers/user.controller");
const {authenticateToken} = require("../utils/authenticateToken");
UserRouter.get("/get-all-user", UserController.getAllUsers);
UserRouter.get("/search", SearchController.searchAndFilterHotels);
UserRouter.post("/signup", authController.signup);
UserRouter.post("/login", authController.login);
UserRouter.post("/google-login", authController.googleLogin);
UserRouter.post("/logout", authController.logout);
UserRouter.post("/verify-email", authController.verifyEmail);
UserRouter.post("/resend-verification", authController.resendEmailVerification);
UserRouter.post("/forgot-password", authController.forgotPassword);
UserRouter.patch("/reset-password/:token", authController.resetPassword);

UserRouter.route("/")
  .get(UserController.getAllUsers)
  .post(UserController.createUser);

UserRouter.route("/:id")
  .get(UserController.getUser)

  .patch(UserController.updateUser)
  .delete(UserController.deleteUser);
UserRouter.put(
  "/update-avatar/:id",
   authenticateToken,
  avatarController.updateAvatar
);
module.exports = UserRouter;
