const express = require('express');
const userController = require('../controllers/user.controller');
const authController = require('../controllers/authenticate.controller');

const authenticateRoute = express.Router();

authenticateRoute.post('/signup', authController.signup);
authenticateRoute.post('/login', authController.login);
authenticateRoute.post('/google-login', authController.googleLogin);
authenticateRoute.post('/logout', authController.logout);
authenticateRoute.post('/verify-email', authController.verifyEmail);
authenticateRoute.post('/resend-verification', authController.resendEmailVerification);
authenticateRoute.post('/forgot-password', authController.forgotPassword);
authenticateRoute.patch('/reset-password/:token', authController.resetPassword);

// authenticateRoute
//   .route('/')
//   .get(userController.getAllUser)
//   .post(userController.createUser);

// authenticateRoute
//   .route('/:id')
//   .get(userController.getUser)
//   .patch(userController.updateUser)
//   .delete(userController.deleteUser);

module.exports = authenticateRoute;