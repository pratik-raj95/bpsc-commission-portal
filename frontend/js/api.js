// ========================================
// BPSC Government Commission Portal - API Module
// All API/Fetch calls - Consolidated and Optimized
// ========================================

// API Base URL - Single definition
if (!window.API_URL) {
  window.API_URL = 'http://localhost:3000/api';
}

// ========================================
// Authentication Utilities
// ========================================

function getToken() {
    return localStorage.getItem('token');
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem('user') || '{}');
}

function setUserData(token, user) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
}

function clearUserData() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
}

function isLoggedIn() {
    return !!getToken();
}

function getUserRole() {
    const user = getCurrentUser();
    return user.role || null;
}

function hasRole(role) {
    return getUserRole() === role;
}

function isAdmin() {
    const role = getUserRole();
    return role === 'admin' || role === 'superadmin';
}

function isEmployee() {
    return getUserRole() === 'employee';
}

// ========================================
// Authentication API Calls
// ========================================

async function login(email, password) {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    return await response.json();
}

async function getAuthUser() {
    const token = getToken();
    const response = await fetch(`${API_URL}/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return await response.json();
}

async function updateProfile(formData) {
    const token = getToken();
    const response = await fetch(`${API_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
    });
    return await response.json();
}

async function updateProfileImage(formData) {
    const token = getToken();
    const response = await fetch(`${API_URL}/auth/profile-image`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
    });
    return await response.json();
}

// ========================================
// Users API Calls
// ========================================

async function getUsers() {
    const token = getToken();
    const response = await fetch(`${API_URL}/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return await response.json();
}

async function getUser(userId) {
    const token = getToken();
    const response = await fetch(`${API_URL}/users/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return await response.json();
}

async function getUserStats() {
    const token = getToken();
    const response = await fetch(`${API_URL}/users/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return await response.json();
}

async function createUser(userData) {
    const token = getToken();
    const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userData)
    });
    return await response.json();
}

async function updateUser(userId, userData) {
    const token = getToken();
    const response = await fetch(`${API_URL}/users/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userData)
    });
    return await response.json();
}

async function deleteUser(userId) {
    const token = getToken();
    const response = await fetch(`${API_URL}/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return await response.json();
}

// ========================================
// Projects API Calls
// ========================================

async function getProjects() {
    const token = getToken();
    const response = await fetch(`${API_URL}/projects`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return await response.json();
}

async function getProject(projectId) {
    const token = getToken();
    const response = await fetch(`${API_URL}/projects/${projectId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return await response.json();
}

async function getProjectStats() {
    const token = getToken();
    const response = await fetch(`${API_URL}/projects/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return await response.json();
}

async function createProject(projectData) {
    const token = getToken();
    const response = await fetch(`${API_URL}/projects`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(projectData)
    });
    return await response.json();
}

async function updateProject(projectId, projectData) {
    const token = getToken();
    const response = await fetch(`${API_URL}/projects/${projectId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(projectData)
    });
    return await response.json();
}

async function deleteProject(projectId) {
    const token = getToken();
    const response = await fetch(`${API_URL}/projects/${projectId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return await response.json();
}

// ========================================
// Tasks API Calls
// ========================================

async function getTasks() {
    const token = getToken();
    const response = await fetch(`${API_URL}/tasks`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return await response.json();
}

async function getTask(taskId) {
    const token = getToken();
    const response = await fetch(`${API_URL}/tasks/${taskId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return await response.json();
}

async function getTaskStats() {
    const token = getToken();
    const response = await fetch(`${API_URL}/tasks/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return await response.json();
}

async function createTask(taskData) {
    const token = getToken();
    const response = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(taskData)
    });
    return await response.json();
}

async function updateTask(taskId, taskData) {
    const token = getToken();
    const response = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(taskData)
    });
    return await response.json();
}

async function deleteTask(taskId) {
    const token = getToken();
    const response = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return await response.json();
}

// ========================================
// Announcements API Calls
// ========================================

async function getAnnouncements() {
    const response = await fetch(`${API_URL}/announcements`);
    return await response.json();
}

async function getAnnouncementsAdmin() {
    const token = getToken();
    const response = await fetch(`${API_URL}/announcements`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return await response.json();
}

async function getAnnouncement(announcementId) {
    const token = getToken();
    const response = await fetch(`${API_URL}/announcements/${announcementId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return await response.json();
}

async function createAnnouncement(announcementData) {
    const token = getToken();
    const response = await fetch(`${API_URL}/announcements`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(announcementData)
    });
    return await response.json();
}

async function updateAnnouncement(announcementId, announcementData) {
    const token = getToken();
    const response = await fetch(`${API_URL}/announcements/${announcementId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(announcementData)
    });
    return await response.json();
}

async function deleteAnnouncement(announcementId) {
    const token = getToken();
    const response = await fetch(`${API_URL}/announcements/${announcementId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return await response.json();
}

// ========================================
// Documents API Calls
// ========================================

async function getDocuments() {
    const token = getToken();
    const response = await fetch(`${API_URL}/documents`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return await response.json();
}

async function uploadDocument(formData) {
    const token = getToken();
    const response = await fetch(`${API_URL}/documents`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
    });
    return await response.json();
}

async function deleteDocument(documentId) {
    const token = getToken();
    const response = await fetch(`${API_URL}/documents/${documentId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return await response.json();
}

// Export all functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        API_URL,
        getToken,
        getCurrentUser,
        setUserData,
        clearUserData,
        isLoggedIn,
        getUserRole,
        hasRole,
        isAdmin,
        isEmployee,
        login,
        getAuthUser,
        updateProfile,
        updateProfileImage,
        getUsers,
        getUser,
        getUserStats,
        createUser,
        updateUser,
        deleteUser,
        getProjects,
        getProject,
        getProjectStats,
        createProject,
        updateProject,
        deleteProject,
        getTasks,
        getTask,
        getTaskStats,
        createTask,
        updateTask,
        deleteTask,
        getAnnouncements,
        getAnnouncementsAdmin,
        getAnnouncement,
        createAnnouncement,
        updateAnnouncement,
        deleteAnnouncement,
        getDocuments,
        uploadDocument,
        deleteDocument
    };
}

// expose API functions globally
Object.assign(window, {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  getAuthUser,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getAnnouncements,
  getAnnouncementsAdmin
});