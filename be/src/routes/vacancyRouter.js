const express = require('express');
const router = express.Router();
const { createVacancy, getVacancies, updateVacancy, getVacancy, deleteVacancy } = require('../controllers/vacancyController');
const { protect } = require('../middleware/authMiddleware');

router.post('/create', protect, createVacancy);
router.put('/:id', protect, updateVacancy);
router.delete('/:id', protect, deleteVacancy);
router.get('/:id', getVacancy);
router.get('/', getVacancies);

module.exports = router;
