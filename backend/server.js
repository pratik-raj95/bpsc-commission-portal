require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const connectDB = require('./config/db');

// Connect to database
connectDB();

const app = express();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =====================
// STATIC FILES (Order matters in Express!)
// =====================

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Static files for frontend - CSS
app.use('/css', express.static(path.join(__dirname, '../frontend/css')));

// Static files for frontend - JavaScript
app.use('/js', express.static(path.join(__dirname, '../frontend/js')));

// Serve assets (images, logos etc)
app.use('/assets', express.static(path.join(__dirname, '../frontend/assets')));

// =====================
// FRONTEND ROUTES - These MUST be before express.static!
// In Express, route handlers (app.get) are matched BEFORE middleware
// =====================

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/public/index.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/public/admin.html'));
});

app.get('/employee', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/public/employee.html'));
});

// Static files for frontend - Public (fallback for any other static files)
// This comes AFTER route handlers so they take precedence
app.use(express.static(path.join(__dirname, '../frontend/public')));

// =====================
// API ROUTES
// =====================

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/announcements', require('./routes/announcementRoutes'));
app.use('/api/documents', require('./routes/documentRoutes'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Server Error'
  });
});

// 404 handler - MUST be last
app.use((req, res) => {
  // For API routes, return JSON
  if (req.originalUrl.startsWith('/api')) {
    return res.status(404).json({
      success: false,
      message: 'API route not found'
    });
  }
  // For frontend routes, serve index.html (SPA behavior)
  res.sendFile(path.join(__dirname, '../frontend/public/index.html'));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Access the application at: http://localhost:${PORT}`);
});
