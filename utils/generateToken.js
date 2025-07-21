import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.SECRET, {
    expiresIn: '1h',
  });
};

export default generateToken;
