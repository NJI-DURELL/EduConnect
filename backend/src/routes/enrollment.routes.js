const express = require('express');
const { getMyEnrollments } = require('../controllers/enrollment.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

// GET /api/enrollments/my
router.get('/my', protect, getMyEnrollments);

module.exports = router;
