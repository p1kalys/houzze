const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { registerValidator, loginValidator } = require('../validators/userValidator');
require('dotenv').config();
const Vacancy = require('../models/Vacancy');

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET;

// Register user
const registerUser = async (req, res) => {
  try {
    const data = registerValidator.parse(req.body);
    const { name, email, password } = data;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    // Create user
    const user = new User({ name, email, password });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Validation error' });
  }
};

// Login user
const loginUser = async (req, res) => {
  try {
    const data = loginValidator.parse(req.body);
    const { email, password } = data;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '3h' });
    res.json({ token, role: user.role });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Validation error' });
  }
};

const logoutUser = (req, res) => {
  res.status(200).json({ message: 'Logged out successfully.' });
};

// Get user details
const getUserDetails = async (req, res) => {
  try {
    const vacancies = await Vacancy.find({
      createdBy: req.user._id,
    });

    res.json({
      user: req.user,
      vacancies: vacancies, 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser, logoutUser, getUserDetails };
