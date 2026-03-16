const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  try {

    let token;

    // 1️⃣ Check Authorization header
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    // 2️⃣ If not found, check cookies
    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }

    // 3️⃣ If still no token
    if (!token) {
      return res.status(401).json({
        message: "Unauthorized - No token provided"
      });
    }

    // 4️⃣ Verify token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    req.user = decoded;

    next();

  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token"
    });
  }
}

module.exports = authMiddleware;