# BPSC Government Commission Portal

A complete full-stack Government Commission Portal inspired by Bihar Public Service Commission (BPSC). This application provides a comprehensive platform for managing government recruitment, announcements, tasks, and documents.

## Features

### Public Website
- Official government header with emblem
- Responsive navigation
- Notice strip with scrolling announcements
- Quick links sidebar
- Online services portal
- Announcements and news section
- Contact information
- Statistics display

### Admin Dashboard
- Secure JWT authentication
- User management (CRUD operations)
- Announcement management
- Task assignment and tracking
- Document upload and management
- Statistics and reports
- Department-wise user distribution

### Employee Dashboard
- Task management
- Status updates
- Announcements viewing
- Team hierarchy
- Profile management

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer
- **Frontend**: HTML5, CSS3, Vanilla JavaScript

## Project Structure

```
project-root/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js  # Authentication logic
│   │   ├── userController.js  # User management
│   │   ├── taskController.js  # Task management
│   │   ├── announcementController.js
│   │   └── documentController.js
│   ├── middleware/
│   │   └── authMiddleware.js  # JWT authentication
│   ├── models/
│   │   ├── User.js            # User schema
│   │   ├── Announcement.js    # Announcement schema
│   │   ├── Task.js           # Task schema
│   │   └── Document.js       # Document schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── taskRoutes.js
│   │   ├── announcementRoutes.js
│   │   └── documentRoutes.js
│   ├── uploads/               # File uploads directory
│   ├── server.js              # Express server
│   └── seed.js                # Database seeding
├── frontend/
│   ├── public/
│   │   ├── index.html         # Public website
│   │   ├── admin.html        # Admin dashboard
│   │   └── employee.html     # Employee dashboard
│   ├── css/
│   │   └── styles.css        # Global styles
│   └── js/
│       └── app.js             # Frontend JavaScript
├── package.json
├── .env.example
└── README.md
```

## Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Steps

1. **Clone the repository**
   
```
bash
   cd project-directory
   
```

2. **Install dependencies**
   
```
bash
   npm install
   
```

3. **Configure environment variables**
   
```
bash
   cp .env.example .env
   
```
   
   Edit `.env` file and update the values:
   
```
   MONGODB_URI=mongodb://localhost:27017/bpsc_portal
   JWT_SECRET=your_secret_key_here
   JWT_EXPIRE=7d
   PORT=3000
   
```

4. **Start MongoDB**
   
```
bash
   # On Windows
   net start MongoDB
   
   # On Linux/Mac
   sudo systemctl start mongod
   
```

5. **Seed the database** (optional - creates demo data)
   
```
bash
   npm run seed
   
```

6. **Start the server**
   
```
bash
   npm start
   
```

7. **Access the application**
   - Public Website: http://localhost:3000
   - Admin Dashboard: http://localhost:3000/admin
   - Employee Dashboard: http://localhost:3000/employee

## Demo Accounts

After running the seed script, you can login with these accounts:

| Role | Email | Password |
|------|-------|----------|
| Super Admin | superadmin@bpsc.gov.in | password123 |
| Admin | admin@bpsc.gov.in | password123 |
| Employee | employee1@bpsc.gov.in | password123 |
| Employee | employee2@bpsc.gov.in | password123 |
| Employee | employee3@bpsc.gov.in | password123 |
| User | user@bpsc.gov.in | password123 |

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/password` - Update password

### Users (Admin only)
- `GET /api/users` - Get all users
- `POST /api/users` - Create user
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `GET /api/users/stats` - Get user statistics

### Announcements
- `GET /api/announcements` - Get all announcements
- `GET /api/announcements/featured` - Get featured announcements
- `POST /api/announcements` - Create announcement (Admin)
- `PUT /api/announcements/:id` - Update announcement (Admin)
- `DELETE /api/announcements/:id` - Delete announcement (Admin)

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create task (Admin)
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task (Admin)

### Documents
- `GET /api/documents` - Get all documents
- `POST /api/documents` - Upload document (Admin)
- `GET /api/documents/:id/download` - Download document
- `DELETE /api/documents/:id` - Delete document (Admin)

## Design Guidelines

- **Theme**: Deep government blue (#0f3c75)
- **Font**: Merriweather for headings, Roboto for body
- **Style**: Formal, institutional, no glassmorphism
- **Border Radius**: Maximum 4px
- **Layout**: Structured grid, fully responsive

## Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Role-based authorization
- Protected routes
- Input validation
- CORS enabled

## Deployment

### Production Build

1. Set NODE_ENV=production
2. Update MongoDB URI for production database
3. Use strong JWT_SECRET
4. Enable HTTPS/SSL
5. Configure reverse proxy (Nginx)

### Example Nginx Configuration

```
nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## License

MIT License

## Support

For support and queries, contact:
- Email: bpsc@bihar.gov.in
- Phone: +91-612-2215015

---

Developed with ❤️ for Government of Bihar
