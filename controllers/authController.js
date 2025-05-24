import User from '../models/User.js';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, UnAuthenticatedError } from '../errors/index.js';
import attachCookie from '../utils/attachCookie.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Helper function to create JWT
const createJWT = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
};

// Helper function to compare password
const comparePassword = async (candidatePassword, hashedPassword) => {
  const isMatch = await bcrypt.compare(candidatePassword, hashedPassword);
  return isMatch;
};

// Optimized register controller
const register = async (req, res) => {
  const { name, email, password } = req.body;

  // Validate input
  if (!name || !email || !password) {
    throw new BadRequestError('please provide all values');
  }

  try {
    // Create user directly without checking existence first (let MongoDB handle unique constraint)
    const user = await User.create({ 
      name, 
      email: email.toLowerCase(), // Normalize email
      password 
    });

    // Generate token
    const token = createJWT(user._id);
    
    // Attach cookie
  attachCookie({ res, token });

    // Send response
  res.status(StatusCodes.CREATED).json({
    user: {
      email: user.email,
      lastName: user.lastName,
      location: user.location,
      name: user.name,
    },
    location: user.location,
  });
  } catch (error) {
    if (error.code === 11000) {
      throw new BadRequestError('Email already in use');
    }
    throw error;
  }
};

// Optimized login controller
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError('Please provide all values');
  }

  // Find user and select password
  const user = await User.findOne({ email: email.toLowerCase() })
    .select('+password')
    .lean();

  if (!user) {
    throw new UnAuthenticatedError('Invalid Credentials');
  }

  const isPasswordCorrect = await comparePassword(password, user.password);
  if (!isPasswordCorrect) {
    throw new UnAuthenticatedError('Invalid Credentials');
  }

  const token = createJWT(user._id);
  attachCookie({ res, token });

  // Remove password from response
  delete user.password;

  res.status(StatusCodes.OK).json({ user, location: user.location });
};

// Optimized update user controller
const updateUser = async (req, res) => {
  const { email, name, lastName, location } = req.body;

  if (!email || !name || !lastName || !location) {
    throw new BadRequestError('Please provide all values');
  }

  // Use findOneAndUpdate for better performance
  const user = await User.findOneAndUpdate(
    { _id: req.user.userId },
    { 
      email: email.toLowerCase(),
      name,
      lastName,
      location
    },
    { 
      new: true,
      runValidators: true
    }
  ).lean();

  const token = createJWT(user._id);
  attachCookie({ res, token });

  res.status(StatusCodes.OK).json({ user, location: user.location });
};

// Optimized get current user controller
const getCurrentUser = async (req, res) => {
  const user = await User.findById(req.user.userId)
    .lean()
    .exec();
    
  res.status(StatusCodes.OK).json({ user, location: user.location });
};

// Optimized logout controller
const logout = async (req, res) => {
  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
    secure: process.env.NODE_ENV === 'production'
  });
  res.status(StatusCodes.OK).json({ msg: 'user logged out!' });
};

export { register, login, updateUser, getCurrentUser, logout };