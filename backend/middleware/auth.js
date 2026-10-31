
const jwt = require("jsonwebtoken");

function authenticateAdmin(req, res, next) {
  try {
    // 1. Check whether the admin cookie exists
    const token = req.cookies?.adminToken;

    if (!token) {
      console.warn("Admin authentication failed: Cookie not found.");

      return res.status(401).json({
        success: false,
        message: "Admin session not found. Please log in again.",
      });
    }

    // 2. Check whether JWT_SECRET is configured
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      console.error("Admin authentication failed: JWT_SECRET is missing.");

      return res.status(500).json({
        success: false,
        message: "Authentication service is not configured.",
      });
    }

    // 3. Verify the JWT token
    const decoded = jwt.verify(token, jwtSecret);

    // 4. Verify admin role
    if (!decoded || decoded.role !== "admin") {
      console.warn("Admin authentication failed: Invalid admin role.");

      return res.status(403).json({
        success: false,
        message: "Admin access required.",
      });
    }

    // 5. Attach authenticated admin details to request
    req.admin = {
      email: decoded.email,
      role: decoded.role,
    };

    // 6. Continue to the requested route
    return next();

  } catch (error) {
    console.error("Admin JWT verification failed:", {
      name: error.name,
      message: error.message,
      jwtSecretConfigured: Boolean(process.env.JWT_SECRET),
    });

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Admin session expired. Please log in again.",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid admin session. Please log in again.",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Admin authentication failed.",
    });
  }
}

module.exports = authenticateAdmin;
