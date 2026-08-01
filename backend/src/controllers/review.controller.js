const { validationResult } = require('express-validator');
const reviewService = require('../services/review.service');

/**
 * GET /api/courses/:id/reviews
 * Public: Get all reviews for a course.
 */
const getCourseReviews = async (req, res, next) => {
  try {
    const reviews = await reviewService.getCourseReviews(req.params.id);
    res.status(200).json({ success: true, reviews });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/courses/:id/reviews
 * Protected: Submit a review (enrolled students only).
 */
const addReview = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { rating, comment } = req.body;
    const review = await reviewService.addReview(req.user._id, req.params.id, {
      rating,
      comment,
    });

    res.status(201).json({ success: true, review });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCourseReviews, addReview };
