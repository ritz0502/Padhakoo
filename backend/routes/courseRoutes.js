const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const upload = require('../middleware/upload');

// Course routes
router.get('/', courseController.getAllCourses);
router.post('/', courseController.createCourse);
router.get('/:courseId', courseController.getCourse);
router.delete('/:courseId', courseController.deleteCourse);

// Unit routes
router.post('/:courseId/units', courseController.createUnit);
router.delete('/:courseId/units/:unitId', courseController.deleteUnit);

// Topic routes
router.post('/:courseId/units/:unitId/topics', courseController.createTopic);
router.delete('/:courseId/units/:unitId/topics/:topicId', courseController.deleteTopic);

// Material routes
router.post(
  '/:courseId/units/:unitId/topics/:topicId/materials',
  upload.single('file'),
  courseController.addMaterial
);
router.delete(
  '/:courseId/units/:unitId/topics/:topicId/materials/:materialId',
  courseController.deleteMaterial
);

// Assignment routes
router.post(
  '/:courseId/units/:unitId/topics/:topicId/assignment',
  upload.single('attachment'),
  courseController.createAssignment
);
router.delete(
  '/:courseId/units/:unitId/topics/:topicId/assignment',
  courseController.deleteAssignment
);

module.exports = router;