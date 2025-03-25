const nodemailer = require('nodemailer');
require('dotenv').config();

exports.sendEmail = async (toEmail, subject, content) => {
   try {
     const transporter = nodemailer.createTransport({
       service: 'Gmail',
       auth: {
         user: process.env.EMAIL_USER, // Email của bạn
         pass: process.env.EMAIL_PASS, // Mật khẩu ứng dụng
       },
     });
 
     const mailOptions = {
       from: process.env.EMAIL_USER,
       to: toEmail,
       subject: subject,
       html: content,
     };
 
     await transporter.sendMail(mailOptions);
     console.log('Email sent successfully to', toEmail);
   } catch (error) {
     console.error('Error sending email:', error);
   }
 };