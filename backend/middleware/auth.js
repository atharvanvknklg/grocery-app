import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  const { token } = req.headers;
  if (!token) return res.json({ success: false, message: "Not Authorized, Login Again" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.body.userId = decoded.id;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.json({ success: false, message: "Token expired", expired: true });
    }
    res.json({ success: false, message: "Invalid Token" });
  }
};

export default authMiddleware;
