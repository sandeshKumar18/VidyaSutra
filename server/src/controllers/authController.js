const userModel = require('../models/User.js');
const jwt = require('jsonwebtoken');

// Helper to generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

/**
 * @desc    Register user
 * @route   POST /api/auth/register
 */


async function register(req, res) {

  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all fields' });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Email already exists' });
    }

    // Create user
    const user = await userModel.create({
      name,
      email,
      password,
      // Default avatar and role (defaults to 'user')
      avatar: { type: 'preset', presetOption: 'avatar1', color: '#3b82f6' }
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      data: { 
        user: { 
          id: user._id, 
          name: user.name, 
          email: user.email,
          avatar: user.avatar,
          // 🔥 CRITICAL FIX: Send role so frontend knows if this is an admin
          role: user.role, 
          progress: user.progress || []
        } 
      }
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 */
async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    // Select password because it's usually excluded in the model
    const user = await userModel.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      data: { 
        user: { 
          id: user._id, 
          name: user.name, 
          email: user.email,
          avatar: user.avatar,
          role: user.role,
          progress: user.progress 
        } 
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/me
 */


async function getMe(req, res) {
  try {
    // Populate progress details for the dashboard
    const user = await userModel.findById(req.user._id).populate('progress.technology');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, data: { user } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


module.exports = {
  register,
  login,
  getMe
};
