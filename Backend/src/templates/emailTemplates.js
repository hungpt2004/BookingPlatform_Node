module.exports = {
  VERIFICATION_EMAIL_TEMPLATE: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #2196F3, #00BCD4); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Verify Your Email</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello,</p>
    <p>Thank you for signing up! Your verification code is:</p>
    <div style="text-align: center; margin: 30px 0;">
      <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #2196F3;">{verificationCode}</span>
    </div>
    <p>Enter this code on the verification page to complete your registration.</p>
    <p>This code will expire in 15 minutes for security reasons.</p>
    <p>If you didn't create an account with us, please ignore this email.</p>
    <p>Best regards,<br>Travelofy Team</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>   
    <p>&copy; ${new Date().getFullYear()} Travelofy. All rights reserved.</p>
  </div>
</body>
</html>
`,
  PASSWORD_RESET_REQUEST_TEMPLATE: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset Request</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: linear-gradient(to right, #2196F3, #00BCD4);
      padding: 20px;
      text-align: center;
      color: white;
      border-radius: 5px 5px 0 0;
    }
    .content {
      background-color: #f9f9f9;
      padding: 20px;
      border-radius: 0 0 5px 5px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }
    .button {
      display: inline-block;
      background-color: #2196F3;
      color: white;
      padding: 12px 20px;
      text-decoration: none;
      border-radius: 5px;
      font-weight: bold;
      margin: 30px 0;
    }
    .footer {
      text-align: center;
      margin-top: 20px;
      color: #888;
      font-size: 0.8em;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Password Reset</h1>
  </div>
  <div class="content">
    <p>Hi {userName},</p>
    <p>We received a request to reset your password for your account. If you didn’t request this, you can safely ignore this email.</p>
    <p>To reset your password, please click the button below:</p>
    <div style="text-align: center;">
      <a href="{resetURL}" class="button">Reset Password</a>
    </div>
    <p>This link will expire in 1 hour for security reasons.</p>
    <p>If you have any questions or need further assistance, feel free to contact our support team.</p>
    <p>Best regards,<br>Travelofy Team</p>
  </div>
  <div class="footer">
    <p>This is an automated message; please do not reply to this email.</p>
    <p>&copy; ${new Date().getFullYear()} Travelofy. All rights reserved.</p>
  </div>
</body>
</html>
`,
HOTEL_APPROVAL_TEMPLATE: `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Hotel Approved</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
<div style="background: linear-gradient(to right, #2196F3, #00BCD4); padding: 20px; text-align: center;">
  <h1 style="color: white; margin: 0;">Hotel Approval Notification</h1>
</div>
<div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
  <p>Dear {ownerName},</p>
  <p>We are pleased to inform you that your hotel <strong>"{hotelName}"</strong> has been approved and is now listed on our platform!</p>
  
  <div style="text-align: center; margin: 30px 0;">
    <span style="display: inline-block; background-color: #4CAF50; color: white; font-size: 18px; font-weight: bold; padding: 10px 20px; border-radius: 5px;">APPROVED</span>
  </div>
  
  <p>You can now:</p>
  <ul style="margin-left: 20px; padding-left: 20px;">
    <li>Manage your hotel through your dashboard</li>
    <li>Update your hotel's information and offerings</li>
    <li>Start receiving bookings from travelers</li>
    <li>Access analytics and performance metrics</li>
  </ul>
  
  {adminComment}
  
  <p>If you have any questions or need assistance setting up your hotel profile, please don't hesitate to contact our support team.</p>
  <p>Thank you for choosing Travelofy for your hotel listing!</p>
  <p>Best regards,<br>Travelofy Team</p>
</div>
<div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
  <p>This is an automated message, please do not reply to this email.</p>   
  <p>&copy; ${new Date().getFullYear()} Travelofy. All rights reserved.</p>
</div>
</body>
</html>
`,
HOTEL_REJECTION_TEMPLATE: `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Hotel Registration Update</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
<div style="background: linear-gradient(to right, #2196F3, #00BCD4); padding: 20px; text-align: center;">
  <h1 style="color: white; margin: 0;">Hotel Registration Notification</h1>
</div>
<div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
  <p>Dear {ownerName},</p>
  <p>We have reviewed your application for listing <strong>"{hotelName}"</strong> on our platform.</p>
  
  <div style="text-align: center; margin: 30px 0; padding: 15px; border: 1px solid #f44336; border-radius: 5px; background-color: #ffebee;">
    <p style="margin: 0; font-weight: bold; color: #d32f2f;">We regret to inform you that your hotel listing could not be approved at this time.</p>
  </div>
  
  <div style="background-color: #eeeeee; padding: 15px; border-radius: 5px; margin: 20px 0;">
    <p style="margin: 0 0 10px 0; font-weight: bold;">Reason for rejection:</p>
    <p style="margin: 0; font-style: italic;">{rejectionReason}</p>
  </div>
  
  <p>We encourage you to address the concerns mentioned above and submit a new application. Here are some tips for a successful listing:</p>
  <ul style="margin-left: 20px; padding-left: 20px;">
    <li>Ensure all required documentation is complete and valid</li>
    <li>Provide clear and accurate information about your property</li>
    <li>Include high-quality images of your hotel</li>
    <li>Clearly list all services and amenities offered</li>
  </ul>
  
  <p>If you have any questions or need clarification about the rejection reason, please contact our support team.</p>
  <p>Thank you for your understanding.</p>
  <p>Best regards,<br>Travelofy Team</p>
</div>
<div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
  <p>This is an automated message, please do not reply to this email.</p>   
  <p>&copy; ${new Date().getFullYear()} Travelofy. All rights reserved.</p>
</div>
</body>
</html>
`
};