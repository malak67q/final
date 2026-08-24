import jwt from "jsonwebtoken";

export function requireAdmin(req, res, next) {
  // Get authorization header
  const authHeader = req.headers.authorization;

  // Check if header exists and starts with Bearer
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Authentication required",
    });
  }

  // Get token
  const token = authHeader.split(" ")[1];

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user is admin
    if (decoded.role !== "admin") {
      return res.status(403).json({
        message: "Admin access required",
      });
    }

    // Save user information for later use
    req.user = decoded;

    // Continue
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
}
