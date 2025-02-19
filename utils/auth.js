import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

export const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      username: user.username,
      restaurant_id: user.restaurant_id,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: '2h' }  // 2 saat
  );
};

export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
}; 