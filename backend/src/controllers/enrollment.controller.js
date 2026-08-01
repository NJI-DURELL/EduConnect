const enrollmentService = require('../services/enrollment.service');

/**
 * POST /api/courses/:id/enroll
 * Protected: Enroll the logged-in student in a course.
 */
const enroll = async (req, res, next) => {
  try {
    const enrollment = await enrollmentService.enrollInCourse(
      req.user._id,
      req.params.id
    );
    res.status(201).json({ success: true, enrollment });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/enrollments/my
 * Protected: Get all courses the logged-in student is enrolled in.
 */
const getMyEnrollments = async (req, res, next) => {
  try {
    const courses = await enrollmentService.getMyEnrollments(req.user._id);
    res.status(200).json({ success: true, courses });
  } catch (error) {
    next(error);
  }
};

module.exports = { enroll, getMyEnrollments };
