// ========================================
// BPSC Government Commission Portal - Employee Module
// Employee-specific JavaScript
// ========================================

// API Base URL
const API_URL = 'http://localhost:3000/api';

// ========================================
// Initialize Employee Dashboard
// ========================================

function initEmployee() {
    // Initialize common dashboard functionality
    const isInitialized = initDashboard();
    
    if (!isInitialized) return;
    
    // Load initial section data
    loadSectionData('dashboard');
    
    // Initialize employee-specific modals
    initEmployeeModals();
}

// ========================================
// Section Data Loading
// ========================================

async function loadSectionData(sectionId) {
    switch(sectionId) {
        case 'dashboard':
            await loadEmployeeDashboard();
            break;
        case 'profile':
            await loadEmployeeProfile();
            break;
        case 'tasks':
            await loadEmployeeTasks();
            break;
        case 'announcements':
            await loadEmployeeAnnouncements();
            break;
    }
}

// ========================================
// Employee Dashboard
// ========================================

async function loadEmployeeDashboard() {
    try {
        const token = getToken();
        
        // Load user data
        const userResponse = await fetch(`${API_URL}/auth/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const userData = await userResponse.json();
        
        if (userData.success) {
            updateEmployeeInfo(userData.user);
        }

        // Load tasks for employee
        const tasksResponse = await fetch(`${API_URL}/tasks`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const tasksData = await tasksResponse.json();
        
        if (tasksData.success) {
            updateEmployeeTaskStats(tasksData.tasks);
        }

        // Load announcements
        const announcementsResponse = await fetch(`${API_URL}/announcements?limit=3`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const announcementsData = await announcementsResponse.json();
        
        if (announcementsData.success) {
            updateEmployeeAnnouncements(announcementsData.announcements);
        }

    } catch (error) {
        console.error('Error loading employee dashboard:', error);
    }
}

function updateEmployeeInfo(user) {
    // Update employee info card
    const nameElements = document.querySelectorAll('#dashboardUserName, .employee-text h2');
    nameElements.forEach(el => {
        if (el) el.textContent = user.fullName || 'Employee';
    });
    
    const designationElements = document.querySelectorAll('.employee-text .designation');
    designationElements.forEach(el => {
        if (el) el.textContent = user.designation || 'Employee';
    });
    
    const departmentElements = document.querySelectorAll('.employee-text .department');
    departmentElements.forEach(el => {
        if (el) el.textContent = `Department: ${user.department || '-'}`;
    });
    
    const employeeIdElements = document.querySelectorAll('.employee-text .employee-id');
    employeeIdElements.forEach(el => {
        if (el) el.textContent = `Employee ID: ${user.employeeId || '-'}`;
    });
    
    // Update profile images
    const profileImages = document.querySelectorAll('.employee-photo, #headerProfileImage');
    profileImages.forEach(img => {
        if (img && user.profileImage) {
            img.src = user.profileImage;
        }
    });
}

function updateEmployeeTaskStats(tasks) {
    const pending = tasks.filter(t => t.status === 'pending').length;
    const inProgress = tasks.filter(t => t.status === 'in_progress').length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    
    const statNumbers = document.querySelectorAll('.employee-stats .emp-stat-number');
    if (statNumbers.length >= 3) {
        statNumbers[0].textContent = pending;
        statNumbers[1].textContent = inProgress;
        statNumbers[2].textContent = completed;
    }
}

function updateEmployeeAnnouncements(announcements) {
    const announcementList = document.querySelector('.announcement-list');
    if (!announcementList) return;
    
    announcementList.innerHTML = announcements.map(ann => `
        <div class="announcement-mini">
            <h4>${ann.title}</h4>
            <p>${ann.content.substring(0, 80)}...</p>
            <span class="announcement-date">${formatDate(ann.publishDate)}</span>
        </div>
    `).join('');
}

// ========================================
// Employee Tasks
// ========================================

async function loadEmployeeTasks() {
    try {
        const token = getToken();
        const response = await fetch(`${API_URL}/tasks`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        
        if (data.success) {
            updateEmployeeTasksList(data.tasks);
        }
    } catch (error) {
        console.error('Error loading tasks:', error);
    }
}

function updateEmployeeTasksList(tasks) {
    const tbody = document.querySelector('#tasks .data-table tbody');
    if (!tbody) return;
    
    if (tasks.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="empty-state">No tasks found</td></tr>';
        return;
    }
    
    tbody.innerHTML = tasks.map(task => `
        <tr>
            <td>${task.taskId || '-'}</td>
            <td>${task.title}</td>
            <td>${task.description ? task.description.substring(0, 50) + '...' : '-'}</td>
            <td><span class="priority ${task.priority}">${task.priority}</span></td>
            <td><span class="status ${task.status}">${task.status.replace('_', ' ')}</span></td>
            <td>${formatDate(task.dueDate)}</td>
            <td>
                <button class="action-btn primary" onclick="updateTaskStatus('${task._id}')">Update</button>
            </td>
        </tr>
    `).join('');
}

// Update task status function
window.updateTaskStatus = async function(taskId) {
    alert('Task update functionality - implement modal to select new status');
};

// ========================================
// Employee Announcements
// ========================================

async function loadEmployeeAnnouncements() {
    try {
        const response = await fetch(`${API_URL}/announcements`);
        const data = await response.json();
        
        if (data.success) {
            updateEmployeeAnnouncementsGrid(data.announcements);
        }
    } catch (error) {
        console.error('Error loading announcements:', error);
    }
}

function updateEmployeeAnnouncementsGrid(announcements) {
    const grid = document.querySelector('#announcements .announcements-grid');
    if (!grid) return;
    
    grid.innerHTML = announcements.map(ann => `
        <div class="announcement-card">
            <div class="announcement-card-header">
                <span class="category-tag ${ann.category}">${ann.category}</span>
                <span class="announcement-date">${formatDate(ann.publishDate)}</span>
            </div>
            <h3>${ann.title}</h3>
            <p>${ann.content.substring(0, 100)}...</p>
            <a href="#" class="read-more">Read More</a>
        </div>
    `).join('');
}

// ========================================
// Employee Profile
// ========================================

async function loadEmployeeProfile() {
    try {
        const token = getToken();
        const response = await fetch(`${API_URL}/auth/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        
        if (data.success) {
            updateEmployeeProfileForm(data.user);
        }
    } catch (error) {
        console.error('Error loading profile:', error);
    }
}

function updateEmployeeProfileForm(user) {
    const fullNameInput = document.querySelector('#profile input[type="text"]');
    if (fullNameInput) fullNameInput.value = user.fullName || '';
    
    const emailInput = document.querySelector('#profile input[type="email"]');
    if (emailInput) emailInput.value = user.email || '';
    
    const phoneInput = document.querySelector('#profile input[type="tel"]');
    if (phoneInput) phoneInput.value = user.phone || '';
    
    const profilePhoto = document.querySelector('#profile .profile-photo');
    if (profilePhoto && user.profileImage) {
        profilePhoto.src = user.profileImage;
    }
}

// ========================================
// Employee Modals Initialization
// ========================================

function initEmployeeModals() {
    // Profile form submission
    const profileForm = document.querySelector('#profile .profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = {
                fullName: profileForm.querySelector('input[type="text"]').value,
                phone: profileForm.querySelector('input[type="tel"]').value
            };
            
            try {
                const token = getToken();
                const response = await fetch(`${API_URL}/auth/profile`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(formData)
                });
                
                const data = await response.json();
                
                if (data.success) {
                    alert('Profile updated successfully!');
                    const currentUser = getCurrentUser();
                    const updatedUser = { ...currentUser, ...formData };
                    localStorage.setItem('user', JSON.stringify(updatedUser));
                    updateUserInfo();
                } else {
                    alert(data.message || 'Failed to update profile');
                }
            } catch (error) {
                console.error('Error updating profile:', error);
                alert('An error occurred');
            }
        });
    }
    
    // Password form submission
    const passwordForm = document.querySelector('#profile .password-form');
    if (passwordForm) {
        passwordForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const newPassword = passwordForm.querySelector('input:nth-of-type(2)').value;
            const confirmPassword = passwordForm.querySelector('input:nth-of-type(3)').value;
            
            if (newPassword !== confirmPassword) {
                alert('Passwords do not match');
                return;
            }
            
            alert('Password change functionality would be implemented here');
        });
    }
}

// ========================================
// Initialize Employee on DOM Ready
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on employee dashboard
    const dashboardBody = document.querySelector('.dashboard-body');
    const employeeHeader = document.querySelector('.logo-text');
    
    if (dashboardBody && employeeHeader && employeeHeader.textContent.includes('Employee')) {
        initEmployee();
    }
});
