# Government Commission Portal - Admin Portal System Implementation Plan

## Project Overview
Build a professional admin portal system for the Government Commission Portal with authentication, profile management, dashboard with stats, employee management, and project management.

## Current State Analysis

### Backend (Already Working)
- ✅ Node.js + Express.js + MongoDB + Mongoose
- ✅ JWT authentication (middleware exists)
- ✅ bcrypt password hashing (User model)
- ✅ Role-based access control (middleware)
- ✅ User model with most fields
- ✅ Task model
- ✅ Auth controller (register, login, getMe, updatePassword)
- ✅ User controller (CRUD operations)
- ✅ Task controller (CRUD operations)
- ✅ Multer for file uploads

### Frontend (Needs Updates)
- ✅ HTML structure for admin dashboard
- ✅ CSS with government blue theme
- ⚠️ Hardcoded data needs to be dynamic
- ⚠️ Profile dropdown needs to be implemented
- ⚠️ Charts need to be added

---

## Implementation Plan

### Phase 1: Backend Updates

#### 1.1 Update User Model
- [ ] Add bio field to User model
- [ ] Add contactNumber field to User model
- [ ] Update timestamps

#### 1.2 Create Project Model
- [ ] Create backend/models/Project.js with:
  - projectName, description, department
  - startDate, deadline, status
  - assignedEmployees (array of User refs)
  - totalTasks, completedTasks
  - progress calculation
  - createdBy, createdAt, updatedAt

#### 1.3 Create Project Controller
- [ ] Create backend/controllers/projectController.js
- [ ] Implement getProjects, getProject, createProject, updateProject, deleteProject
- [ ] Implement getProjectStats
- [ ] Implement assignEmployeesToProject

#### 1.4 Create Project Routes
- [ ] Create backend/routes/projectRoutes.js
- [ ] Add CRUD endpoints with protection and admin authorization
- [ ] Add stats endpoint
- [ ] Add assign-employees endpoint

#### 1.5 Update Auth Controller
- [ ] Add profile update endpoint (updateProfile)
- [ ] Add profile image upload using Multer
- [ ] Add lastLogin tracking
- [ ] Update getMe to include all profile fields

#### 1.6 Update Task Model
- [ ] Add project reference field
- [ ] Add index for project queries

#### 1.7 Update Server
- [ ] Add project routes to server.js
- [ ] Ensure uploads folder exists
- [ ] Add Multer configuration for profile images

### Phase 2: Frontend Updates

#### 2.1 Update admin.html
- [ ] Add profile dropdown in header with:
  - Profile image (rounded avatar)
  - Admin name
  - Admin designation
  - Dropdown menu: View Profile, Edit Profile, Logout
- [ ] Add Profile section/page
- [ ] Add Projects section/page
- [ ] Make all tables dynamic (Users, Tasks, Projects)
- [ ] Add Chart.js for visualizations

#### 2.2 Update styles.css
- [ ] Add profile dropdown styles
- [ ] Add profile page styles
- [ ] Add project management styles
- [ ] Add chart styles
- [ ] Add modal styles for forms

#### 2.3 Update app.js
- [ ] Add profile management API calls
- [ ] Add project management API calls
- [ ] Add dashboard stats API calls
- [ ] Add employee management API calls
- [ ] Add Chart.js initialization
- [ ] Add dynamic data loading
- [ ] Add profile dropdown functionality

### Phase 3: Integration & Testing

#### 3.1 API Integration
- [ ] Test all new endpoints
- [ ] Test authentication flow
- [ ] Test profile upload
- [ ] Test project creation
- [ ] Test employee assignment

#### 3.2 Frontend Integration
- [ ] Test dashboard loading
- [ ] Test profile dropdown
- [ ] Test all CRUD operations
- [ ] Test charts rendering
- [ ] Test responsive design

---

## File Changes Summary

### New Files to Create:
1. backend/models/Project.js
2. backend/controllers/projectController.js
3. backend/routes/projectRoutes.js

### Files to Update:
1. backend/models/User.js - Add bio, contactNumber
2. backend/models/Task.js - Add project reference
3. backend/controllers/authController.js - Add profile update, image upload
4. backend/routes/authRoutes.js - Add new endpoints
5. backend/server.js - Add project routes
6. frontend/public/admin.html - Add dynamic content, profile dropdown
7. frontend/css/styles.css - Add new styles
8. frontend/js/app.js - Add all API calls and functionality

---

## Priority Order

1. **Backend Core**: Update User model, create Project model
2. **Backend API**: Create project controller and routes, update auth controller
3. **Server Integration**: Add routes to server
4. **Frontend Structure**: Update admin.html with profile dropdown
5. **Frontend Styling**: Add CSS for new components
6. **Frontend Logic**: Update app.js with all API calls
7. **Testing**: Verify everything works together

---

## Dependencies Already Available
- bcryptjs
- cors
- dotenv
- express
- jsonwebtoken
- mongoose
- multer

## Additional Dependencies Needed
- None (all required packages are already installed)

---

## Success Criteria
1. Admin can log in with JWT
2. Admin can view and edit profile with image upload
3. Dashboard shows dynamic stats (employees, projects, tasks)
4. Admin can manage employees (CRUD)
5. Admin can manage projects (CRUD)
6. All data is from database (no hardcoded values)
7. Professional UI with charts
8. Responsive design
9. No errors in console
10. Blue government theme maintained
