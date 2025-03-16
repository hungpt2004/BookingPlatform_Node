const express = require("express");
const PDFRouter = express.Router();
const PDFController = require('../controllers/pdf.controller')

PDFRouter.get("/:reservationId/download-pdf", PDFController.downloadReservationPDF); // Route tải PDF

module.exports = PDFRouter;
