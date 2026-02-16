const express = require('express');
const router = express.Router();
const { 
  getUsers, 
  getUser, 
  createUser, 
  updateUser, 
  deleteUser, 
  getUserStats,
  getEmployeesByDepartment
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('superadmin', 'admin'));

router.route('/')
  .get(getUsers)
  .post(createUser);

router.route('/stats').get(getUserStats);
router.route('/department/:department').get(getEmployeesByDepartment);

router.route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

module.exports = router;
