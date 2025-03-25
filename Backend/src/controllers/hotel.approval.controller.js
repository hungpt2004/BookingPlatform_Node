const Hotel = require("../models/hotel");
const User = require("../models/user");
const nodemailer = require("nodemailer");
const emailTemplates = require("../templates/emailTemplates");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASSWORD,
  },
});

exports.getPendingHotels = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
  
      const pendingHotels = await Hotel.find({ adminStatus: "PENDING" })
        .populate("owner", "name email")
        .select("hotelName description address requestDate businessDocuments")
        .skip(skip)
        .limit(limit)
        .sort({ requestDate: -1 });
  
      const totalHotels = await Hotel.countDocuments({ adminStatus: "PENDING" });
  
      res.status(200).json({
        status: "success",
        results: totalHotels,
        data: {
          hotels: pendingHotels,
          page,
          pages: Math.ceil(totalHotels / limit)
        },
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  };

exports.getHotelForApproval = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id)
      .populate("owner", "name email phoneNumber address")
      .populate("services")
      .populate("facilities");

    if (!hotel) {
      return res.status(404).json({
        status: "fail",
        message: "Hotel not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        hotel,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.processHotelApproval = async (req, res) => {
  try {
    const { hotelId, isApproved, adminComment } = req.body;

    if (!hotelId) {
      return res.status(400).json({
        status: "fail",
        message: "Hotel ID is required",
      });
    }

    // If rejecting, require a comment
    if (!isApproved && !adminComment) {
      return res.status(400).json({
        status: "fail",
        message: "A rejection reason is required",
      });
    }

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({
        status: "fail",
        message: "Hotel not found",
      });
    }

    const owner = await User.findById(hotel.owner);
    if (!owner) {
      return res.status(404).json({
        status: "fail",
        message: "Hotel owner not found",
      });
    }

    // Send email to owner
    let emailSubject, emailContent;

    if (isApproved) {
      // Approve hotel
      hotel.adminStatus = "APPROVED";
      hotel.decisionDate = new Date();
      
      await Hotel.findByIdAndUpdate(hotelId, {
        adminStatus: "APPROVED",
        decisionDate: new Date()
      }, { runValidators: false }); 

      // Update user role to OWNER if not already
      if (owner.role !== "OWNER") {
        owner.role = "OWNER";
        await owner.save();
      }

      emailSubject = "Congratulations! Your Hotel Has Been Approved";

      // Format admin comment section if provided
      const adminCommentSection = adminComment
        ? `<div style="background-color: #e8f5e9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p style="margin: 0 0 10px 0; font-weight: bold;">Note from our team:</p>
                <p style="margin: 0;">${adminComment}</p>
              </div>`
        : "";

      emailContent = emailTemplates.HOTEL_APPROVAL_TEMPLATE.replace(
        "{ownerName}",
        owner.name
      )
        .replace("{hotelName}", hotel.hotelName)
        .replace("{adminComment}", adminCommentSection);
    } else {
      // Reject and delete hotel
      emailSubject = "Hotel Registration Update";
      emailContent = emailTemplates.HOTEL_REJECTION_TEMPLATE.replace(
        "{ownerName}",
        owner.name
      )
        .replace("{hotelName}", hotel.hotelName)
        .replace("{rejectionReason}", adminComment);

      // Remove hotel from owner's ownedHotels array
      owner.ownedHotels = owner.ownedHotels.filter(
        (id) => id.toString() !== hotelId
      );
      await owner.save();

      // Delete the hotel
      await Hotel.findByIdAndDelete(hotelId);
    }

    // Send email notification
    await transporter.sendMail({
      from: process.env.AUTH_EMAIL,
      to: owner.email,
      subject: emailSubject,
      html: emailContent,
    });

    res.status(200).json({
      status: "success",
      message: isApproved
        ? "Hotel has been approved successfully"
        : "Hotel has been rejected and deleted",
    });
  } catch (error) {
    console.error("Error processing hotel approval:", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
