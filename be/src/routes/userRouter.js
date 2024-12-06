const express = require('express');
const { registerUser, loginUser, logoutUser, getUserDetails } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerUser); // Register a new user
router.post('/login', loginUser);       // Log in a user
router.post('/logout', logoutUser);
router.get('/account', protect, getUserDetails);

module.exports = router;
