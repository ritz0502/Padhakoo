const Course = require('../models/Course');
const Unit = require('../models/Unit');
const Topic = require('../models/Topic');
const Material = require('../models/Material');
const Assignment = require('../models/Assignment');
const fs = require('fs');
const path = require('path');

// Get all courses
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single course with units and topics
exports.getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const units = await Unit.find({ course: req.params.courseId })
      .sort({ order: 1 })
      .populate({
        path: 'topics',
        options: { sort: { order: 1 } },
        populate: {
          path: 'materials assignment'
        }
      });

    res.json({
      ...course.toObject(),
      units
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new course
exports.createCourse = async (req, res) => {
  try {
    const { name, department, description } = req.body;

    const course = new Course({
      name,
      department,
      description,
      createdBy: req.user._id
    });

    await course.save();
    res.status(201).json(course);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a course and its related data
exports.deleteCourse = async (req, res) => {
  try {
    // Delete course and all related data (units, topics, materials, assignments)
    await Promise.all([
      Course.findByIdAndDelete(req.params.courseId),
      Unit.deleteMany({ course: req.params.courseId }),
      Topic.deleteMany({ course: req.params.courseId }),
      Material.deleteMany({ course: req.params.courseId }),
      Assignment.deleteMany({ course: req.params.courseId })
    ]);

    res.json({ message: 'Course deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new unit in a course
exports.createUnit = async (req, res) => {
  try {
    const { title, description } = req.body;

    // Get count of existing units to set order
    const unitCount = await Unit.countDocuments({ course: req.params.courseId });

    const unit = new Unit({
      title,
      description,
      course: req.params.courseId,
      order: unitCount
    });

    await unit.save();
    res.status(201).json(unit);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a unit
exports.deleteUnit = async (req, res) => {
  try {
    // Delete unit and all related data (topics, materials, assignments)
    await Promise.all([
      Unit.findByIdAndDelete(req.params.unitId),
      Topic.deleteMany({ unit: req.params.unitId }),
      Material.deleteMany({ unit: req.params.unitId }),
      Assignment.deleteMany({ unit: req.params.unitId })
    ]);

    res.json({ message: 'Unit deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new topic in a unit
exports.createTopic = async (req, res) => {
  try {
    const { title, estimatedTime } = req.body;

    // Get count of existing topics to set order
    const topicCount = await Topic.countDocuments({ unit: req.params.unitId });

    const topic = new Topic({
      title,
      estimatedTime,
      unit: req.params.unitId,
      course: req.params.courseId,
      order: topicCount,
      isLocked: topicCount > 0 // Lock all topics except the first one
    });

    await topic.save();
    res.status(201).json(topic);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a topic
exports.deleteTopic = async (req, res) => {
  try {
    // Delete topic and all related data (materials, assignment)
    await Promise.all([
      Topic.findByIdAndDelete(req.params.topicId),
      Material.deleteMany({ topic: req.params.topicId }),
      Assignment.findOneAndDelete({ topic: req.params.topicId })
    ]);

    res.json({ message: 'Topic deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add study material to a topic
exports.addMaterial = async (req, res) => {
  try {
    const { title, type, url } = req.body;
    let filePath = null;

    if (req.file) {
      filePath = req.file.path;
    }

    const material = new Material({
      title,
      type,
      filePath,
      url,
      topic: req.params.topicId,
      unit: req.params.unitId,
      course: req.params.courseId
    });

    await material.save();
    res.status(201).json(material);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a material
exports.deleteMaterial = async (req, res) => {
  try {
    const material = await Material.findById(req.params.materialId);
    if (!material) {
      return res.status(404).json({ error: 'Material not found' });
    }

    // Delete file if exists
    if (material.filePath) {
      fs.unlink(material.filePath, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }

    await Material.findByIdAndDelete(req.params.materialId);
    res.json({ message: 'Material deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create assignment for a topic
exports.createAssignment = async (req, res) => {
  try {
    const { title, description, deadline } = req.body;
    let filePath = null;

    if (req.file) {
      filePath = req.file.path;
    }

    // Check if assignment already exists
    const existingAssignment = await Assignment.findOne({ topic: req.params.topicId });
    if (existingAssignment) {
      return res.status(400).json({ error: 'Assignment already exists for this topic' });
    }

    const assignment = new Assignment({
      title,
      description,
      deadline,
      filePath,
      topic: req.params.topicId,
      unit: req.params.unitId,
      course: req.params.courseId
    });

    await assignment.save();
    res.status(201).json(assignment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete assignment
exports.deleteAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findOne({ topic: req.params.topicId });
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    // Delete file if exists
    if (assignment.filePath) {
      fs.unlink(assignment.filePath, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }

    await Assignment.findByIdAndDelete(assignment._id);
    res.json({ message: 'Assignment deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};