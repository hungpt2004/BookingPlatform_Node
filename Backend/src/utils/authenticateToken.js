const jwt = require("jsonwebtoken");

exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  console.log("Chạy ở authenToken");
  console.log("Header: ", authHeader);
  const token = authHeader && authHeader.split(" ")[1]; // Lấy token từ header

  if (!token) {
    return res
      .status(401)
      .json({ error: true, message: "Access token missing or invalid" });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: true, message: "Invalid token" });
    }
    req.user = user; // Gắn thông tin người dùng vào req.user
    next(); // Tiếp tục xử lý
  });
};
