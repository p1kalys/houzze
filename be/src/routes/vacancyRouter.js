const express = require('express');
const router = express.Router();
const { createVacancy, getVacancies } = require('../controllers/vacancyController');
const { protect } = require('../middleware/authMiddleware'); // Auth middleware

// Route to create a vacancy (authenticated)
router.post('/create', protect, createVacancy);

// Route to get all vacancies with filters
router.get('/', getVacancies);

module.exports = router;
