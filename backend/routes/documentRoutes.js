const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { 
  getDocuments, 
  getDocument, 
  uploadDocument, 
  updateDocument, 
  deleteDocument,
  downloadDocument,
  getDocumentStats
} = require('../controllers/documentController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'backend/uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx|xls|xlsx|ppt|pptx|txt|jpg|jpeg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only document files are allowed'));
  }
});

// Protected routes
router.use(protect);

router.route('/stats').get(authorize('superadmin', 'admin'), getDocumentStats);

router.route('/')
  .get(getDocuments)
  .post(authorize('superadmin', 'admin'), upload.single('file'), uploadDocument);

router.route('/:id')
  .get(getDocument)
  .put(authorize('superadmin', 'admin'), updateDocument)
  .delete(authorize('superadmin', 'admin'), deleteDocument);

router.route('/:id/download').get(downloadDocument);

module.exports = router;
