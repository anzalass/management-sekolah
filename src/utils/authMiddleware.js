import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const AuthMiddleware = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header is missing" });
  }

  // Extract the token from the header (Bearer <token>)
  const token = authHeader.split(" ")[1];
  
  try {
    // Verify the token with JWT secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    
    // Attach the decoded data (user info) to req.user
    req.user = decoded;
    
    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    // If token is invalid or expired
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};
