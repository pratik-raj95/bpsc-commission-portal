const express = require('express');
const router = express.Router();
const { 
  getProjects, 
  getProject, 
  createProject, 
  updateProject, 
  deleteProject,
  assignEmployees,
  getProjectStats
} = require('../controllers/projectController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Protect all routes
router.use(protect);
router.use(authorize('superadmin', 'admin'));

router.route('/')
  .get(getProjects)
  .post(createProject);

router.route('/stats').get(getProjectStats);

router.route('/:id')
  .get(getProject)
  .put(updateProject)
  .delete(deleteProject);

router.route('/:id/assign')
  .put(assignEmployees);

module.exports = router;
