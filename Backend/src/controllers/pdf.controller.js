const asyncHandler = require("../middlewares/asyncHandler");
const PDFDocument = require("pdfkit-table");
const Reservation = require("../models/reservation");

exports.downloadReservationPDF = asyncHandler(async (req, res) => {
   const { reservationId } = req.params;
 
   if (!reservationId) {
     return res.status(400).json({ message: "Invalid reservation ID" });
   }
 
   try {
     const reservation = await Reservation.findById(reservationId)
       .populate("user", "name email phoneNumber")
       .populate("hotel", "hotelName address rating star pricePerNight")
       .populate("rooms.room", "name type price");
 
     if (!reservation) {
       return res.status(404).json({ message: "Reservation not found" });
     }
 
     // **📄 Khởi tạo PDF**
     const doc = new PDFDocument({ margin: 50 });
 
     // **Gửi Header cho Response**
     res.setHeader("Content-Disposition", `attachment; filename="reservation_${reservationId}.pdf"`);
     res.setHeader("Content-Type", "application/pdf");
 
     // **Ghi PDF vào response**
     doc.pipe(res);
 
     // **📌 Tiêu đề chính**
     doc.fontSize(20).text("Reservation Details", { align: "center" }).moveDown(2);
 
     // **📌 Thông tin chung**
     doc.fontSize(14).text(`Reservation ID: ${reservation._id}`).moveDown();
     doc.text(`User: ${reservation.user.name} (${reservation.user.email})`);
     doc.text(`Phone: ${reservation.user.phoneNumber}`).moveDown();
     doc.text(`Hotel: ${reservation.hotel.hotelName}`);
     doc.text(`Address: ${reservation.hotel.address}`);
     doc.text(`Rating: ${reservation.hotel.rating} ⭐`);
     doc.text(`Price per Night: $${reservation.hotel.pricePerNight}`).moveDown();
 
     doc.text(`Check-in: ${reservation.checkInDate.toDateString()}`);
     doc.text(`Check-out: ${reservation.checkOutDate.toDateString()}`).moveDown(2);
 
     // **📌 Dữ liệu bảng**
     const table = {
       headers: ["No.", "Room Name", "Type", "Price ($)"],
       rows: reservation.rooms.map((room, index) => [
         index + 1,
         room.room.name,
         room.room.type,
         `$${room.room.price}`,
       ]),
     };
 
     // **📌 Thêm bảng vào PDF**
     await doc.table(table, { width: 500 });
 
     doc.moveDown(2);
     doc.text(`Total Price: $${reservation.totalPrice}`, { bold: true });
 
     // **Đóng stream sau khi hoàn tất**
     doc.end();

     return res.status(200).json({
      message:"Download file success! Please check"
     })
 
   } catch (error) {
     return res.status(500).json({ message: error.message });
   }
 });