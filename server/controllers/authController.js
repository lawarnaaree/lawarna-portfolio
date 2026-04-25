import { authModel } from '../models/authModel.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error('Please provide email and password');
    }

    const admin = await authModel.findByEmail(email);

    if (!admin) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, admin.password_hash);

    if (!isMatch) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    // Generate Token
    const token = jwt.sign(
      { id: admin.id, email: admin.email },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    // Update last login
    await authModel.updateLastLogin(admin.id);

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      data: {
        token,
        admin: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          avatar_url: admin.avatar_url
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const admin = await authModel.findById(req.admin.id);
    res.status(200).json({
      success: true,
      data: admin
    });
  } catch (error) {
    next(error);
  }
};
