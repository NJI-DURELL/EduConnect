const Review = require('../models/Review.model');
const Course = require('../models/Course.model');
const { isEnrolled } = require('./enrollment.service');

/**
 * Returns all reviews for a course, populated with student info.
 */
const getCourseReviews = async (courseId) => {
  const course = await Course.findById(courseId);
  if (!course) {
    const error = new Error('Course not found.');
    error.statusCode = 404;
    throw error;
  }

  return Review.find({ course: courseId })
    .populate('student', 'username profilePicture')
    .sort({ createdAt: -1 });
};

/**
 * Adds a review from an enrolled student.
 * Recalculates and updates the course's averageRating.
 */
const addReview = async (studentId, courseId, { rating, comment }) => {
  // Enrollment gate
  const enrolled = await isEnrolled(studentId, courseId);
  if (!enrolled) {
    const error = new Error('You must be enrolled in this course to leave a review.');
    error.statusCode = 403;
    throw error;
  }

  // Check for existing review
  const existingReview = await Review.findOne({ student: studentId, course: courseId });
  if (existingReview) {
    const error = new Error('You have already reviewed this course.');
    error.statusCode = 400;
    throw error;
  }

  const review = await Review.create({
    student: studentId,
    course: courseId,
    rating,
    comment,
  });

  // Recalculate average rating for the course
  const allReviews = await Review.find({ course: courseId });
  const averageRating =
    allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length;

  await Course.findByIdAndUpdate(courseId, {
    averageRating: Math.round(averageRating * 10) / 10,
    totalReviews: allReviews.length,
  });

  return review.populate('student', 'username profilePicture');
};

module.exports = { getCourseReviews, addReview };
