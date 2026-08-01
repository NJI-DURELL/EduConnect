const Enrollment = require('../models/Enrollment.model');
const Course = require('../models/Course.model');

/**
 * Enrolls a student in a course.
 * Prevents duplicate enrollments and self-enrollment.
 */
const enrollInCourse = async (studentId, courseId) => {
  const course = await Course.findById(courseId);
  if (!course) {
    const error = new Error('Course not found.');
    error.statusCode = 404;
    throw error;
  }

  // Prevent instructor from enrolling in their own course
  if (course.instructor.toString() === studentId.toString()) {
    const error = new Error('Instructors cannot enroll in their own course.');
    error.statusCode = 400;
    throw error;
  }

  const existingEnrollment = await Enrollment.findOne({
    student: studentId,
    course: courseId,
  });

  if (existingEnrollment) {
    const error = new Error('You are already enrolled in this course.');
    error.statusCode = 400;
    throw error;
  }

  const enrollment = await Enrollment.create({
    student: studentId,
    course: courseId,
  });

  // Increment enrollment count on course
  await Course.findByIdAndUpdate(courseId, { $inc: { enrollmentCount: 1 } });

  return enrollment;
};

/**
 * Returns all courses a student is enrolled in.
 */
const getMyEnrollments = async (studentId) => {
  const enrollments = await Enrollment.find({ student: studentId })
    .populate({
      path: 'course',
      populate: { path: 'instructor', select: 'username profilePicture' },
    })
    .sort({ createdAt: -1 });

  return enrollments.map((e) => e.course);
};

/**
 * Checks if a student is enrolled in a course (used for review gate).
 */
const isEnrolled = async (studentId, courseId) => {
  const enrollment = await Enrollment.findOne({
    student: studentId,
    course: courseId,
  });
  return !!enrollment;
};

module.exports = { enrollInCourse, getMyEnrollments, isEnrolled };
