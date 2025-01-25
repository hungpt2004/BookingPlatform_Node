const express = require('express')
const PaymentRouter = express.Router();
const PaymentController = require('../controllers/payment.controller')

PaymentRouter.post('/create-payment-link', PaymentController.createPaymentLink)

module.exports = PaymentRouter