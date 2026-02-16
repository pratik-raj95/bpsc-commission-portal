const express = require('express');
const router = express.Router();
const { 
  getAnnouncements, 
  getAnnouncement, 
  createAnnouncement, 
  updateAnnouncement, 
  deleteAnnouncement,
  getAnnouncementStats,
  getFeaturedAnnouncements
} = require('../controllers/announcementController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public routes
router.get('/featured', getFeaturedAnnouncements);

// Protected routes
router.use(protect);

router.route('/stats').get(authorize('superadmin', 'admin'), getAnnouncementStats);

router.route('/')
  .get(getAnnouncements)
  .post(authorize('superadmin', 'admin'), createAnnouncement);

router.route('/:id')
  .get(getAnnouncement)
  .put(authorize('superadmin', 'admin'), updateAnnouncement)
  .delete(authorize('superadmin', 'admin'), deleteAnnouncement);

module.exports = router;
