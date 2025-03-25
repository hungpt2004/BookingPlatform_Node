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
  PERIODIC_PAYMENT_TEMPLATE: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Periodic Payment Invoice - Travelofy</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .invoice-container {
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            padding: 30px;
        }
        .invoice-header {
            text-align: center;
            border-bottom: 2px solid #007bff;
            padding-bottom: 20px;
            margin-bottom: 20px;
        }
        .invoice-details {
            margin-bottom: 20px;
        }
        .invoice-details table {
            width: 100%;
            border-collapse: collapse;
        }
        .invoice-details th, .invoice-details td {
            border: 1px solid #ddd;
            padding: 10px;
            text-align: left;
        }
        .total {
            font-weight: bold;
            text-align: right;
        }
        .footer {
            text-align: center;
            color: #666;
            margin-top: 20px;
            font-size: 0.9em;
        }
    </style>
</head>
<body>
    <div class="invoice-container">
        <div class="invoice-header">
            <h1>Periodic Payment Invoice</h1>
            <p>Travelofy Billing Statement</p>
        </div>

        <div class="invoice-details">
            <p>Dear {ownerName},</p>
            <p>Hotel: {hotel}</p>
            <p>Address: {location}</p>

            <table>
                <tr>
                    <th>Billing Period</th>
                    <td>{month} {year}</td>
                </tr>
                <tr>
                    <th>Payment Date</th>
                    <td>{paymentDate}</td>
                </tr>
                <tr>
                    <th>Total Amount</th>
                    <td class="total">{amount}</td>
                </tr>
            </table>
        </div>

        <p>This is a confirmation of your periodic payment processed by Travelofy. The amount has been successfully charged to your account.</p>

        <p>If you have any questions or concerns about this invoice, please contact our customer support team.</p>

        <p>Thank you for your continued trust in Travelofy.</p>

        <div class="footer">
            <p>© {new Date().getFullYear()} Travelofy. All rights reserved.</p>
            <p>Contact: support@travelofy.com | +1 (555) 123-4567</p>
        </div>
    </div>
</body>
</html>`,
  REFUND_CUSTOMER_TEMPLATE: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Refund Confirmation</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; background-color: #f4f4f4; padding: 20px; }
    .email-container { max-width: 600px; margin: 0 auto; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .header { background-color: #003b95; padding: 20px; border-radius: 8px 8px 0 0; color: white; text-align: center; }
    .footer { margin-top: 20px; font-size: 0.9rem; color: #555; text-align: center; }
    .btn { background-color: #003b95; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px; }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>Refund Confirmation</h1>
    </div>
    <p>Dear {customerName},</p>
    <p>We have processed your refund of <strong>{refundAmount}</strong> for the booking ID <strong>{reservationId}</strong>.</p>
    <p><strong>Refund Date:</strong> {decisionDate}</p>
    <p>Please allow 5-7 business days for the refund to reflect in your account.</p>
    <p>Thank you for choosing Travelofy.</p>
    <p>Best regards,<br>Travelofy Team</p>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Travelofy. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`,
};
