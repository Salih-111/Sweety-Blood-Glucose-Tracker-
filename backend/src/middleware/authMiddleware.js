import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  // Read JWT from HttpOnly cookie
  const token = req.cookies?.glucotrack_token;

  if (!token) {
    return res.status(401).json({
      message: "Authentication required.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      userId: decoded.userId,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token.",
    });
  }
};

export default authMiddleware;