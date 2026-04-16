const jwt = require("jsonwebtoken");

// this middleware checks if the user has a valid JWT token
const authMiddleware = (req, res, next) => {
  // token is sent in Authorization header as "Bearer <token>"
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided, access denied" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach user info to request
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token is not valid or expired" });
  }
};

module.exports = authMiddleware;
