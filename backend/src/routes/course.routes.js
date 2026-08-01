const express = require('express');
const { body } = require('express-validator');
const {
  getAllCourses,
  getMyCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
} = require('../controllers/course.controller');
const { enroll } = require('../controllers/enrollment.controller');
const { getCourseReviews, addReview } = require('../controllers/review.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

const courseValidation = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 150 }).withMessage('Title cannot exceed 150 characters'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a non-negative number'),
  body('category')
    .isIn(['Programming', 'Design', 'Marketing', 'Business', 'Data Science', 'Other'])
    .withMessage('Invalid category'),
];

// ──── Public Routes ────────────────────────────────────────────────────────────
// GET /api/courses
router.get('/', getAllCourses);

// GET /api/courses/:id
router.get('/:id', getCourseById);

// GET /api/courses/:id/reviews
router.get('/:id/reviews', getCourseReviews);

// ──── Protected Routes ─────────────────────────────────────────────────────────
// GET /api/courses/my  (MUST be before /:id to avoid conflict)
router.get('/my/courses', protect, getMyCourses);

// POST /api/courses
router.post('/', protect, courseValidation, createCourse);

// PUT /api/courses/:id
router.put('/:id', protect, courseValidation, updateCourse);

// DELETE /api/courses/:id
router.delete('/:id', protect, deleteCourse);

// POST /api/courses/:id/enroll
router.post('/:id/enroll', protect, enroll);

// POST /api/courses/:id/reviews
router.post(
  '/:id/reviews',
  protect,
  [
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('comment').trim().notEmpty().withMessage('Comment is required'),
  ],
  addReview
);

module.exports = router;
