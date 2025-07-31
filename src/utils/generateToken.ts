import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

 const JWT_SECRET = process.env.SECRET;
    if (!JWT_SECRET) {
      console.error("Missing SECRET");
      process.exit(1);
    }

const generateToken = (userId: string): string => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: "1h" });
};

export default generateToken;
