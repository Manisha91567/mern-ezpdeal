const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token)
    return res.status(401).json({ message: "Access Denied. No token provided." });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid token" });
  }
};

exports.requireRole = (role) => (req, res, next) => {
  console.log(">>>>>>>>>>>>>>>>>>>>>", req.user.role, role)
  if (req.user.role !== role)
    return res.status(403).json({ message: "Insufficient rights" });
  next();
};
