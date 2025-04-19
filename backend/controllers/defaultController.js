const Course = require('../models/Course');
const Unit = require('../models/Unit');
const Topic = require('../models/Topic');

// Create default courses
exports.createDefaultCourses = async (req, res) => {
  try {
    const { courses } = req.body;
    
    // Check if default courses already exist
    const existingCourses = await Course.find({ isDefault: true });
    if (existingCourses.length > 0) {
      return res.status(400).json({ error: 'Default courses already exist' });
    }

    const createdCourses = await Course.insertMany(courses);

    // Create some default units and topics for each course
    for (const course of createdCourses) {
      // Create units
      const units = await Unit.insertMany([
        { title: 'Introduction', course: course._id, order: 0 },
        { title: 'Fundamentals', course: course._id, order: 1 },
        { title: 'Advanced Concepts', course: course._id, order: 2 }
      ]);

      // Create topics for each unit
      for (const unit of units) {
        await Topic.insertMany([
          {
            title: 'Getting Started',
            estimatedTime: 30,
            unit: unit._id,
            course: course._id,
            order: 0,
            isLocked: false
          },
          {
            title: 'Core Concepts',
            estimatedTime: 45,
            unit: unit._id,
            course: course._id,
            order: 1,
            isLocked: true
          },
          {
            title: 'Practical Applications',
            estimatedTime: 60,
            unit: unit._id,
            course: course._id,
            order: 2,
            isLocked: true
          }
        ]);
      }
    }

    res.status(201).json({ message: 'Default courses created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};