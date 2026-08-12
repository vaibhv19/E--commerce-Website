import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Helper to generate JWT token and set in cookie
const generateTokenAndSetCookie = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '1d'
  });

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  });
};

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
export const signup = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // 1. Input Validation
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Please fill in all fields' });
    }

    if (username.length < 3) {
      return res.status(400).json({ message: 'Username must be at least 3 characters long' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // 2. Check if user already exists
    const userExists = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username }]
    });

    if (userExists) {
      if (userExists.email === email.toLowerCase()) {
        return res.status(400).json({ message: 'A user with this email already exists' });
      }
      return res.status(400).json({ message: 'Username is already taken' });
    }

    // 3. Create user
    const user = await User.create({
      username,
      email,
      password
    });

    if (user) {
      // 4. Generate token & set cookie
      generateTokenAndSetCookie(res, user._id);

      return res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt
      });
    } else {
      return res.status(400).json({ message: 'Invalid user data received' });
    }
  } catch (error) {
    console.error('Signup error:', error.message);
    return res.status(500).json({ message: 'Server error during signup' });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Input Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // 2. Find user
    const user = await User.findOne({ email: email.toLowerCase() });

    // 3. Compare passwords
    if (user && (await user.comparePassword(password))) {
      generateTokenAndSetCookie(res, user._id);

      return res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt
      });
    } else {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login error:', error.message);
    return res.status(500).json({ message: 'Server error during login' });
  }
};

// @desc    Log user out & clear cookie
// @route   POST /api/auth/logout
// @access  Public
export const logout = (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
  return res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Get user profile (current session)
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  if (req.user) {
    return res.status(200).json({
      _id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      createdAt: req.user.createdAt
    });
  } else {
    return res.status(404).json({ message: 'User not found' });
  }
};
