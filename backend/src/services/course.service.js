const Course = require('../models/Course.model');

/**
 * Returns a paginated list of courses with optional search/filter.
 * @param {object} query - { search, category, minPrice, maxPrice, page, limit }
 */
const getAllCourses = async ({ search, category, minPrice, maxPrice, page = 1, limit = 12 }) => {
  const filter = {};

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  if (category) {
    filter.category = category;
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.price = {};
    if (minPrice !== undefined) filter.price.$gte = Number(minPrice);
    if (maxPrice !== undefined) filter.price.$lte = Number(maxPrice);
  }

  const skip = (Number(page) - 1) * Number(limit);
  const total = await Course.countDocuments(filter);
  const courses = await Course.find(filter)
    .populate('instructor', 'username profilePicture')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  return { courses, total, page: Number(page), pages: Math.ceil(total / limit) };
};

/**
 * Returns a single course by ID with full detail.
 */
const getCourseById = async (courseId) => {
  const course = await Course.findById(courseId).populate(
    'instructor',
    'username profilePicture bio'
  );
  if (!course) {
    const error = new Error('Course not found.');
    error.statusCode = 404;
    throw error;
  }
  return course;
};

/**
 * Returns all courses created by the logged-in instructor.
 */
const getMyCourses = async (instructorId) => {
  return Course.find({ instructor: instructorId })
    .sort({ createdAt: -1 });
};

/**
 * Creates a new course.
 */
const createCourse = async (instructorId, courseData) => {
  const course = await Course.create({
    ...courseData,
    instructor: instructorId,
  });
  return course;
};

/**
 * Updates a course. Only the owner can update.
 */
const updateCourse = async (courseId, instructorId, updateData) => {
  const course = await Course.findById(courseId);
  if (!course) {
    const error = new Error('Course not found.');
    error.statusCode = 404;
    throw error;
  }

  if (course.instructor.toString() !== instructorId.toString()) {
    const error = new Error('You are not authorized to update this course.');
    error.statusCode = 403;
    throw error;
  }

  Object.assign(course, updateData);
  await course.save();
  return course;
};

/**
 * Deletes a course. Only the owner can delete.
 */
const deleteCourse = async (courseId, instructorId) => {
  const course = await Course.findById(courseId);
  if (!course) {
    const error = new Error('Course not found.');
    error.statusCode = 404;
    throw error;
  }

  if (course.instructor.toString() !== instructorId.toString()) {
    const error = new Error('You are not authorized to delete this course.');
    error.statusCode = 403;
    throw error;
  }

  await course.deleteOne();
  return { message: 'Course deleted successfully.' };
};

module.exports = {
  getAllCourses,
  getCourseById,
  getMyCourses,
  createCourse,
  updateCourse,
  deleteCourse,
};
