import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Check for Bearer token
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.SECRET);
      const user = await User.findById(decoded.id).select("-password"); // exclude password

      if (!user) {
        return res
          .status(401)
          .json({ message: "Unauthorized: User not found" });
      }

      req.user = user; // attach user to request
      next();
    } catch (error) {
      console.error("Auth error:", error);
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
  } catch (err) {
    console.error("Error in auth middleware:", err);
    return res.status(401).json({ message: "Unauthorized" });
  }
};
