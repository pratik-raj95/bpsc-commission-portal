// ========================================
// BPSC Government Commission Portal - Employee Module
// Employee-specific JavaScript
// Note: Uses main.js for common functions and api.js for API calls
// ========================================

// ========================================
// Initialize Employee Dashboard
// ========================================

function initEmployee() {
    // Initialize common dashboard functionality (from main.js)
    const isInitialized = initDashboard();
    
    if (!isInitialized) return;
    
    // Load initial section data
    const hash = window.location.hash.substring(1);
    loadSectionData(hash || 'dashboard');
    
    // Initialize employee-specific modals
    initEmployeeModals();
}

// ========================================
// Section Data Loading (Employee-specific)
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
        default:
            // Use common loadSectionData from app.js for other sections
            if (typeof window.loadSectionDataCommon === 'function') {
                await window.loadSectionDataCommon(sectionId);
            }
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
        const userData = await getAuthUser();
        
        if (userData.success) {
            updateEmployeeInfo(userData.user);
        }

        // Load tasks for employee
        const tasksData = await getTasks();
        
        if (tasksData.success) {
           updateEmployeeTaskStats(tasksData.tasks);
renderEmployeeTasks(tasksData.tasks);
        }

        // Load announcements
        const announcementsData = await getAnnouncementsAdmin();
        
        if (announcementsData.success) {
            updateEmployeeAnnouncements(announcementsData.announcements);
        }

    } catch (error) {
        // Silent fail
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

function renderEmployeeTasks(tasks) {

    const dashboardTable = document.getElementById("employeeDashboardTasks");
    const fullTable = document.getElementById("employeeTasksTable");

    if (!tasks || tasks.length === 0) {
        if (dashboardTable)
            dashboardTable.innerHTML = `<tr><td colspan="7">No tasks assigned</td></tr>`;
        if (fullTable)
            fullTable.innerHTML = `<tr><td colspan="7">No tasks assigned</td></tr>`;
        return;
    }

    const rows = tasks.map(task => `
        <tr>
            <td>${task.taskId || task._id.slice(-5)}</td>
            <td>${task.title}</td>
            <td>${task.assignedBy?.fullName || 'Admin'}</td>
            <td><span class="priority ${task.priority}">${task.priority}</span></td>
            <td><span class="status ${task.status}">
                ${task.status.replace('_',' ')}
            </span></td>
            <td>${formatDate(task.dueDate)}</td>
            <td>
                <button class="action-btn primary"
                onclick="updateTaskStatus('${task._id}')">
                Update
                </button>
            </td>
        </tr>
    `).join("");

    if (dashboardTable) dashboardTable.innerHTML = rows.slice(0,3);
    if (fullTable) fullTable.innerHTML = rows;
}

function updateEmployeeAnnouncements(announcements) {
    const announcementList = document.querySelector('.announcement-list');
    if (!announcementList) return;
    
    announcementList.innerHTML = announcements.slice(0, 3).map(ann => `
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
        const data = await getTasks();
        
        if (data.success) {
            updateEmployeeTasksList(data.tasks);
        }
    } catch (error) {
        // Silent fail
    }
}

function updateEmployeeTasksList(tasks) {
    renderEmployeeTasks(tasks);
}

// Update task status function
window.updateTaskStatus = async function(taskId) {
    // Simple alert for now - could be enhanced with a modal
    const newStatus = prompt('Enter new status (pending/in_progress/completed):');
    if (!newStatus) return;
    
    try {
        const data = await updateTask(taskId, { status: newStatus });
        
        if (data.success) {
            alert('Task status updated successfully!');
            loadEmployeeTasks();
        } else {
            alert(data.message || 'Failed to update task status');
        }
    } catch (error) {
        alert('An error occurred');
    }
};

// ========================================
// Employee Announcements
// ========================================

async function loadEmployeeAnnouncements() {
    try {
        const data = await getAnnouncements();
        
        if (data.success) {
            updateEmployeeAnnouncementsGrid(data.announcements);
        }
    } catch (error) {
        // Silent fail
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
        const data = await getAuthUser();
        
        if (data.success) {
            updateEmployeeProfileForm(data.user);
        }
    } catch (error) {
        // Silent fail
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
                const data = await updateProfile(formData);
                
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
            
            // Password change functionality - using updateProfile
            try {
                const data = await updateProfile({ password: newPassword });
                
                if (data.success) {
                    alert('Password changed successfully!');
                    passwordForm.reset();
                } else {
                    alert(data.message || 'Failed to change password');
                }
            } catch (error) {
                alert('An error occurred');
            }
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

