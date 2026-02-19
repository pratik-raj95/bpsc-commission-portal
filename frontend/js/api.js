// ========================================
// BPSC Government Commission Portal - API Module
// All API/Fetch calls separated for modularity
// ========================================

// API Base URL
const API_URL = 'http://localhost:3000/api';

// Get token from localStorage
function getToken() {
    return localStorage.getItem('token');
}

// ========================================
// Authentication API Calls
// ========================================

// Login
async function login(email, password) {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });
    return await response.json();
}

// Get current user
async function getCurrentUser() {
    const token = getToken();
    const response = await fetch(`${API_URL}/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return await response.json();
}

// Update profile
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

// Update profile image
async function updateProfileImage(formData) {
    const token = getToken();
    const response = await fetch(`${API_URL}/auth/profile-image`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: formData
    });
    return await response.json();
}

// ========================================
// Users API Calls
// ========================================

// Get all users
async function getUsers() {
    const token = getToken();
    const response = await fetch(`${API_URL}/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return await response.json();
}

// Get user by ID
async function getUser(userId) {
    const token = getToken();
    const response = await fetch(`${API_URL}/users/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return await response.json();
}

// Get user stats
async function getUserStats() {
    const token = getToken();
    const response = await fetch(`${API_URL}/users/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return await response.json();
}

// Create user
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

// Update user
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

// Delete user
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

// Get all projects
async function getProjects() {
    const token = getToken();
    const response = await fetch(`${API_URL}/projects`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return await response.json();
}

// Get project by ID
async function getProject(projectId) {
    const token = getToken();
    const response = await fetch(`${API_URL}/projects/${projectId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return await response.json();
}

// Get project stats
async function getProjectStats() {
    const token = getToken();
    const response = await fetch(`${API_URL}/projects/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return await response.json();
}

// Create project
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

// Update project
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

// Delete project
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

// Get all tasks
async function getTasks() {
    const token = getToken();
    const response = await fetch(`${API_URL}/tasks`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return await response.json();
}

// Get task by ID
async function getTask(taskId) {
    const token = getToken();
    const response = await fetch(`${API_URL}/tasks/${taskId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return await response.json();
}

// Get task stats
async function getTaskStats() {
    const token = getToken();
    const response = await fetch(`${API_URL}/tasks/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return await response.json();
}

// Create task
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

// Update task
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

// Delete task
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

// Get all announcements (public)
async function getAnnouncements() {
    const response = await fetch(`${API_URL}/announcements`);
    return await response.json();
}

// Get announcements (admin with auth)
async function getAnnouncementsAdmin() {
    const token = getToken();
    const response = await fetch(`${API_URL}/announcements`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return await response.json();
}

// Get announcement by ID
async function getAnnouncement(announcementId) {
    const token = getToken();
    const response = await fetch(`${API_URL}/announcements/${announcementId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return await response.json();
}

// Create announcement
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

// Update announcement
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

// Delete announcement
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

// Get all documents
async function getDocuments() {
    const token = getToken();
    const response = await fetch(`${API_URL}/documents`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return await response.json();
}

// Upload document
async function uploadDocument(formData) {
    const token = getToken();
    const response = await fetch(`${API_URL}/documents`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: formData
    });
    return await response.json();
}

// Delete document
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
        login,
        getCurrentUser,
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
