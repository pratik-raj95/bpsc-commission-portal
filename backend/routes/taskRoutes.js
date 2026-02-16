const express = require('express');
const router = express.Router();
const { 
  getTasks, 
  getTask, 
  createTask, 
  updateTask, 
  deleteTask,
  getTaskStats
} = require('../controllers/taskController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/stats').get(getTaskStats);

router.route('/')
  .get(getTasks)
  .post(authorize('superadmin', 'admin'), createTask);

router.route('/:id')
  .get(getTask)
  .put(updateTask)
  .delete(authorize('superadmin', 'admin'), deleteTask);

module.exports = router;
