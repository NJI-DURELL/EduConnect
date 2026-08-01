const { validationResult } = require('express-validator');
const courseService = require('../services/course.service');

/**
 * GET /api/courses
 * Public: List/search/filter all courses.
 */
const getAllCourses = async (req, res, next) => {
  try {
    const { search, category, minPrice, maxPrice, page, limit } = req.query;
    const result = await courseService.getAllCourses({
      search,
      category,
      minPrice,
      maxPrice,
      page,
      limit,
    });
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/courses/my
 * Protected: Get courses created by the logged-in instructor.
 */
const getMyCourses = async (req, res, next) => {
  try {
    const courses = await courseService.getMyCourses(req.user._id);
    res.status(200).json({ success: true, courses });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/courses/:id
 * Public: Get a single course by ID.
 */
const getCourseById = async (req, res, next) => {
  try {
    const course = await courseService.getCourseById(req.params.id);
    res.status(200).json({ success: true, course });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/courses
 * Protected: Create a new course.
 */
const createCourse = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { title, description, price, category, thumbnail, modules } = req.body;
    const course = await courseService.createCourse(req.user._id, {
      title,
      description,
      price,
      category,
      thumbnail,
      modules: modules || [],
    });

    res.status(201).json({ success: true, course });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/courses/:id
 * Protected: Update a course (owner only).
 */
const updateCourse = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { title, description, price, category, thumbnail, modules } = req.body;
    const course = await courseService.updateCourse(req.params.id, req.user._id, {
      title,
      description,
      price,
      category,
      thumbnail,
      modules,
    });

    res.status(200).json({ success: true, course });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/courses/:id
 * Protected: Delete a course (owner only).
 */
const deleteCourse = async (req, res, next) => {
  try {
    const result = await courseService.deleteCourse(req.params.id, req.user._id);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllCourses,
  getMyCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
};
