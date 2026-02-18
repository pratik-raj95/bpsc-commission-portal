// ========================================
// BPSC Government Commission Portal
// JavaScript Application
// ========================================

// API Base URL
const API_URL = 'http://localhost:3000/api';

// ========================================
// Global Variables
// ========================================
let currentUser = null;
let token = null;

// ========================================
// Public Website JavaScript
// ========================================

// Check if we're on the public website
if (document.getElementById('loginBtn')) {
    // Login Modal Functionality
    const loginBtn = document.getElementById('loginBtn');
    const loginModal = document.getElementById('loginModal');
    const closeModal = document.getElementById('closeModal');
    const loginForm = document.getElementById('loginForm');

    // Open modal
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            loginModal.classList.add('active');
        });
    }

    // Close modal
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            loginModal.classList.remove('active');
        });
    }

    // Close modal on outside click
    if (loginModal) {
        loginModal.addEventListener('click', (e) => {
            if (e.target === loginModal) {
                loginModal.classList.remove('active');
            }
        });
    }

    // Handle login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch(`${API_URL}/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                // Check response status before parsing JSON
                if (!response.ok) {
                    const errorData = await response.json();
                    alert(errorData.message || 'Login failed');
                    return;
                }

                const data = await response.json();

                if (data.success) {
                    // Store token and user in localStorage
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    
                    // Close login modal
                    loginModal.classList.remove('active');
                    
                    // Role-based redirect
                    const userRole = data.user.role;
                    
                    if (userRole === 'admin' || userRole === 'superadmin') {
                        window.location.href = '/admin';
                    } else if (userRole === 'employee') {
                        window.location.href = '/employee';
                    } else if (userRole === 'user') {
                        window.location.href = '/';
                    } else {
                        // Fallback for unknown roles
                        window.location.href = '/';
                    }
                } else {
                    alert(data.message || 'Login failed');
                }
            } catch (error) {
                console.error('Login error:', error);
                alert('An error occurred during login');
            }
        });
    }

    // Hero Slider Functionality
    const heroSlides = document.querySelectorAll('.hero-slide');
    let currentSlide = 0;

    if (heroSlides.length > 0) {
        heroSlides[0].classList.add('active');

        setInterval(() => {
            heroSlides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % heroSlides.length;
            heroSlides[currentSlide].classList.add('active');
        }, 5000);
    }

    // Fetch Announcements
    async function loadAnnouncements() {
        try {
            const response = await fetch(`${API_URL}/announcements`);
            const data = await response.json();
            
            if (data.success) {
                updateAnnouncementsList(data.announcements);
            }
        } catch (error) {
            console.error('Error loading announcements:', error);
        }
    }

    function updateAnnouncementsList(announcements) {
        const announcementsList = document.getElementById('announcementsList');
        if (!announcementsList) return;

        // Show only first 4 announcements
        const displayAnnouncements = announcements.slice(0, 4);
        
        announcementsList.innerHTML = displayAnnouncements.map(announcement => `
            <div class="announcement-item">
                <div class="announcement-date">${formatDate(announcement.publishDate)}</div>
                <div class="announcement-content">
                    <h4><a href="#">${announcement.title}</a></h4>
                    <p>${announcement.content.substring(0, 100)}...</p>
                    <span class="category-tag ${announcement.category}">${announcement.category}</span>
                </div>
            </div>
        `).join('');
    }

    // Load announcements on page load
    loadAnnouncements();
}

// ========================================
// Dashboard JavaScript (Admin & Employee)
// ========================================

// Check if we're on a dashboard page
const dashboardBody = document.querySelector('.dashboard-body');

if (dashboardBody) {
    // Get token and user from localStorage
    token = localStorage.getItem('token');
    currentUser = JSON.parse(localStorage.getItem('user') || '{}');

    // Check authentication
    if (!token) {
        // Redirect to home if not logged in
        window.location.href = '/';
    }

    // ========================================
    // Sidebar Navigation
    // ========================================
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const navLinks = document.querySelectorAll('.sidebar-nav a');
    const dashboardSections = document.querySelectorAll('.dashboard-section');

    // Toggle sidebar on mobile
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }

    // Handle navigation
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Update active nav item
            navLinks.forEach(l => l.parentElement.classList.remove('active'));
            link.parentElement.classList.add('active');
            
            // Show corresponding section
            const targetId = link.getAttribute('href').substring(1);
            dashboardSections.forEach(section => {
                section.classList.remove('active');
                if (section.id === targetId) {
                    section.classList.add('active');
                }
            });

            // Close sidebar on mobile
            if (window.innerWidth < 992) {
                sidebar.classList.remove('active');
            }

            // Load section data
            loadSectionData(targetId);
        });
    });

    // Check for hash in URL
    if (window.location.hash) {
        const targetId = window.location.hash.substring(1);
        navLinks.forEach(link => {
            if (link.getAttribute('href') === `#${targetId}`) {
                link.click();
            }
        });
    }

    // ========================================
    // Profile Dropdown
    // ========================================
    const userProfile = document.getElementById('userProfile');
    const profileDropdown = document.getElementById('profileDropdown');

    if (userProfile && profileDropdown) {
        userProfile.addEventListener('click', (e) => {
            e.stopPropagation();
            profileDropdown.classList.toggle('active');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!userProfile.contains(e.target) && !profileDropdown.contains(e.target)) {
                profileDropdown.classList.remove('active');
            }
        });
    }

    // ========================================
    // Logout Functionality
    // ========================================
    const logoutBtn = document.getElementById('logoutBtn');
    const logoutModal = document.getElementById('logoutModal');
    const cancelLogout = document.getElementById('cancelLogout');
    const confirmLogout = document.getElementById('confirmLogout');

    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (logoutModal) {
                logoutModal.classList.add('active');
            }
            if (profileDropdown) {
                profileDropdown.classList.remove('active');
            }
        });
    }

    if (cancelLogout) {
        cancelLogout.addEventListener('click', () => {
            if (logoutModal) {
                logoutModal.classList.remove('active');
            }
        });
    }

    if (confirmLogout) {
        confirmLogout.addEventListener('click', () => {
            // Clear localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Redirect to home
            window.location.href = '/';
        });
    }

    if (logoutModal) {
        logoutModal.addEventListener('click', (e) => {
            if (e.target === logoutModal) {
                logoutModal.classList.remove('active');
            }
        });
    }

    // ========================================
    // Update User Info in Header
    // ========================================
    function updateUserInfo() {
        const userNameElements = document.querySelectorAll('#headerUserName, #dropdownUserName, #dashboardUserName');
        userNameElements.forEach(el => {
            if (el) el.textContent = currentUser.fullName || 'Admin';
        });

        const designationElements = document.querySelectorAll('#dropdownUserDesignation');
        designationElements.forEach(el => {
            if (el) el.textContent = currentUser.designation || 'Admin';
        });

        // Update profile images
        const profileImages = document.querySelectorAll('#headerProfileImage, #dropdownProfileImage, #profileImage');
        profileImages.forEach(img => {
            if (img && currentUser.profileImage) {
                img.src = currentUser.profileImage;
            }
        });
    }

    // ========================================
    // Section Data Loading
    // ========================================
    async function loadSectionData(sectionId) {
        switch(sectionId) {
            case 'dashboard':
                await loadDashboardStats();
                break;
            case 'profile':
                await loadProfile();
                break;
            case 'users':
                await loadUsers();
                break;
            case 'projects':
                await loadProjects();
                break;
            case 'tasks':
                await loadTasks();
                break;
            case 'announcements':
                await loadAnnouncementsAdmin();
                break;
        }
    }

    // ========================================
    // Dashboard Stats
    // ========================================
    async function loadDashboardStats() {
        try {
            // Load user stats
            const usersResponse = await fetch(`${API_URL}/users/stats`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const usersData = await usersResponse.json();
            
            if (usersData.success) {
                document.getElementById('totalEmployees').textContent = usersData.stats.totalUsers || 0;
            }

            // Load project stats
            const projectsResponse = await fetch(`${API_URL}/projects/stats`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const projectsData = await projectsResponse.json();
            
            if (projectsData.success) {
                document.getElementById('totalProjects').textContent = projectsData.stats.totalProjects || 0;
            }

            // Load task stats
            const tasksResponse = await fetch(`${API_URL}/tasks/stats`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const tasksData = await tasksResponse.json();
            
            if (tasksData.success) {
                const stats = tasksData.stats;
                document.getElementById('totalTasks').textContent = stats.totalTasks || 0;
                document.getElementById('completedTasks').textContent = stats.completedTasks || 0;
                document.getElementById('pendingTasks').textContent = stats.pendingTasks || 0;
                
                // Calculate work progress
                const progress = stats.totalTasks > 0 
                    ? Math.round((stats.completedTasks / stats.totalTasks) * 100) 
                    : 0;
                document.getElementById('workProgress').textContent = progress + '%';
                
                // Update task overview
                document.getElementById('taskPending').textContent = stats.pendingTasks || 0;
                document.getElementById('taskInProgress').textContent = stats.inProgressTasks || 0;
                document.getElementById('taskCompleted').textContent = stats.completedTasks || 0;
                document.getElementById('taskOverdue').textContent = stats.overdueTasks || 0;
            }

            // Load recent announcements
            const announcementsResponse = await fetch(`${API_URL}/announcements?limit=5`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const announcementsData = await announcementsResponse.json();
            
            if (announcementsData.success) {
                updateAnnouncementsTable(announcementsData.announcements);
            }

            // Initialize charts
            initDashboardCharts();

        } catch (error) {
            console.error('Error loading dashboard stats:', error);
        }
    }

    function updateAnnouncementsTable(announcements) {
        const tbody = document.getElementById('announcementsTableBody');
        if (!tbody) return;

        if (announcements.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" class="empty-state">No announcements found</td></tr>';
            return;
        }

        tbody.innerHTML = announcements.map(ann => `
            <tr>
                <td>${ann.title}</td>
                <td><span class="category-tag ${ann.category}">${ann.category}</span></td>
                <td><span class="tag ${ann.status}">${ann.status}</span></td>
                <td>${formatDate(ann.publishDate)}</td>
            </tr>
        `).join('');
    }

    // ========================================
    // Charts
    // ========================================
    function initDashboardCharts() {
        // Task Status Chart
        const taskCtx = document.getElementById('taskStatusChart');
        if (taskCtx) {
            new Chart(taskCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Pending', 'In Progress', 'Completed', 'Overdue'],
                    datasets: [{
                        data: [
                            parseInt(document.getElementById('taskPending').textContent) || 0,
                            parseInt(document.getElementById('taskInProgress').textContent) || 0,
                            parseInt(document.getElementById('taskCompleted').textContent) || 0,
                            parseInt(document.getElementById('taskOverdue').textContent) || 0
                        ],
                        backgroundColor: ['#ffc107', '#17a2b8', '#28a745', '#dc3545']
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
        }

        // Project Status Chart
        const projectCtx = document.getElementById('projectStatusChart');
        if (projectCtx) {
            new Chart(projectCtx, {
                type: 'bar',
                data: {
                    labels: ['Planning', 'Active', 'On Hold', 'Completed'],
                    datasets: [{
                        label: 'Projects',
                        data: [0, 0, 0, 0],
                        backgroundColor: ['#6c757d', '#17a2b8', '#ffc107', '#28a745']
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: { beginAtZero: true }
                    }
                }
            });
        }

        // Department Chart
        const deptCtx = document.getElementById('departmentChart');
        if (deptCtx) {
            new Chart(deptCtx, {
                type: 'pie',
                data: {
                    labels: ['Administration', 'Finance', 'HR', 'IT', 'Operations'],
                    datasets: [{
                        data: [15, 12, 10, 8, 5],
                        backgroundColor: ['#0f3c75', '#28a745', '#ffc107', '#17a2b8', '#6f42c1']
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
        }
    }

    // ========================================
    // Profile Page
    // ========================================
    async function loadProfile() {
        try {
            const response = await fetch(`${API_URL}/auth/me`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();

            if (data.success) {
                const user = data.user;

                // Update profile section
                document.getElementById('profileFullName').textContent = user.fullName || '-';
                document.getElementById('profileDesignation').textContent = user.designation || '-';
                document.getElementById('profileDepartment').textContent = user.department || '-';
                document.getElementById('profileRole').textContent = user.role || '-';

                // Update profile image
                if (user.profileImage) {
                    document.getElementById('profileImage').src = user.profileImage;
                }

                // Update info grid
                document.getElementById('infoFullName').textContent = user.fullName || '-';
                document.getElementById('infoEmail').textContent = user.email || '-';
                document.getElementById('infoPhone').textContent = user.phone || '-';
                document.getElementById('infoContactNumber').textContent = user.contactNumber || '-';
                document.getElementById('infoAddress').textContent = user.address || '-';
                document.getElementById('infoEmployeeId').textContent = user.employeeId || '-';
                document.getElementById('infoRole').textContent = user.role || '-';
                document.getElementById('infoDepartment').textContent = user.department || '-';
                document.getElementById('infoDesignation').textContent = user.designation || '-';
                document.getElementById('infoCreatedAt').textContent = formatDate(user.createdAt);
                document.getElementById('infoLastLogin').textContent = user.lastLogin ? formatDate(user.lastLogin) : '-';

                // Update bio
                document.getElementById('profileBio').textContent = user.bio || 'No bio added yet.';

                // Update settings form
                document.getElementById('settingsFullName').value = user.fullName || '';
                document.getElementById('settingsEmail').value = user.email || '';
                document.getElementById('settingsDepartment').value = user.department || '';
                document.getElementById('settingsDesignation').value = user.designation || '';
            }
        } catch (error) {
            console.error('Error loading profile:', error);
        }
    }

    // Profile Edit Modal
    const profileEditModal = document.getElementById('profileEditModal');
    const editProfileBtn = document.getElementById('editProfileBtn');
    const editPersonalInfoBtn = document.getElementById('editPersonalInfoBtn');
    const editBioBtn = document.getElementById('editBioBtn');
    const closeProfileEditModal = document.getElementById('closeProfileEditModal');
    const cancelProfileEdit = document.getElementById('cancelProfileEdit');
    const profileEditForm = document.getElementById('profileEditForm');

    function openProfileEditModal() {
        if (!profileEditModal) return;

        // Populate form with current data
        document.getElementById('editFullName').value = currentUser.fullName || '';
        document.getElementById('editDepartment').value = currentUser.department || '';
        document.getElementById('editDesignation').value = currentUser.designation || '';
        document.getElementById('editPhone').value = currentUser.phone || '';
        document.getElementById('editContactNumber').value = currentUser.contactNumber || '';
        document.getElementById('editAddress').value = currentUser.address || '';
        document.getElementById('editBio').value = currentUser.bio || '';

        profileEditModal.classList.add('active');
    }

    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openProfileEditModal();
        });
    }

    if (editPersonalInfoBtn) {
        editPersonalInfoBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openProfileEditModal();
        });
    }

    if (editBioBtn) {
        editBioBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openProfileEditModal();
        });
    }

    if (closeProfileEditModal) {
        closeProfileEditModal.addEventListener('click', () => {
            profileEditModal.classList.remove('active');
        });
    }

    if (cancelProfileEdit) {
        cancelProfileEdit.addEventListener('click', () => {
            profileEditModal.classList.remove('active');
        });
    }

    if (profileEditForm) {
        profileEditForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = {
                fullName: document.getElementById('editFullName').value,
                department: document.getElementById('editDepartment').value,
                designation: document.getElementById('editDesignation').value,
                phone: document.getElementById('editPhone').value,
                contactNumber: document.getElementById('editContactNumber').value,
                address: document.getElementById('editAddress').value,
                bio: document.getElementById('editBio').value
            };

            try {
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
                    profileEditModal.classList.remove('active');
                    // Update current user
                    currentUser = { ...currentUser, ...formData };
                    localStorage.setItem('user', JSON.stringify(currentUser));
                    updateUserInfo();
                    loadProfile();
                } else {
                    alert(data.message || 'Failed to update profile');
                }
            } catch (error) {
                console.error('Error updating profile:', error);
                alert('An error occurred');
            }
        });
    }

    // Profile Image Modal
    const profileImageModal = document.getElementById('profileImageModal');
    const changePhotoBtn = document.getElementById('changePhotoBtn');
    const closeProfileImageModal = document.getElementById('closeProfileImageModal');
    const cancelImageUpload = document.getElementById('cancelImageUpload');
    const profileImageForm = document.getElementById('profileImageForm');
    const profileImageInput = document.getElementById('profileImageInput');

    if (changePhotoBtn && profileImageModal) {
        changePhotoBtn.addEventListener('click', (e) => {
            e.preventDefault();
            profileImageModal.classList.add('active');
        });
    }

    if (closeProfileImageModal) {
        closeProfileImageModal.addEventListener('click', () => {
            profileImageModal.classList.remove('active');
        });
    }

    if (cancelImageUpload) {
        cancelImageUpload.addEventListener('click', () => {
            profileImageModal.classList.remove('active');
        });
    }

    if (profileImageForm) {
        profileImageForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (!profileImageInput.files[0]) {
                alert('Please select an image');
                return;
            }

            const formData = new FormData();
            formData.append('profileImage', profileImageInput.files[0]);

            try {
                const response = await fetch(`${API_URL}/auth/profile-image`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: formData
                });

                const data = await response.json();

                if (data.success) {
                    alert('Profile image updated successfully!');
                    profileImageModal.classList.remove('active');
                    currentUser.profileImage = data.user.profileImage;
                    localStorage.setItem('user', JSON.stringify(currentUser));
                    updateUserInfo();
                    loadProfile();
                } else {
                    alert(data.message || 'Failed to upload image');
                }
            } catch (error) {
                console.error('Error uploading image:', error);
                alert('An error occurred');
            }
        });
    }

    // ========================================
    // User Management
    // ========================================
    async function loadUsers() {
        try {
            const response = await fetch(`${API_URL}/users`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();

            if (data.success) {
                updateUsersTable(data.users);
            }
        } catch (error) {
            console.error('Error loading users:', error);
        }
    }

    function updateUsersTable(users) {
        const tbody = document.getElementById('usersTableBody');
        if (!tbody) return;

        if (users.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="empty-state">No users found</td></tr>';
            return;
        }

        tbody.innerHTML = users.map(user => `
            <tr>
                <td>${user.employeeId || '-'}</td>
                <td>${user.fullName}</td>
                <td>${user.email}</td>
                <td><span class="tag ${user.role}">${user.role}</span></td>
                <td>${user.department || '-'}</td>
                <td><span class="tag ${user.isActive ? 'active' : 'inactive'}">${user.isActive ? 'Active' : 'Inactive'}</span></td>
                <td>
                    <button class="action-btn" onclick="editUser('${user._id}')">Edit</button>
                    <button class="action-btn danger" onclick="deleteUser('${user._id}')">Delete</button>
                </td>
            </tr>
        `).join('');
    }

    // Add User Modal
    const userModal = document.getElementById('userModal');
    const addUserBtn = document.getElementById('addUserBtn');
    const closeUserModal = document.getElementById('closeUserModal');
    const cancelUserModal = document.getElementById('cancelUserModal');
    const userForm = document.getElementById('userForm');

    if (addUserBtn && userModal) {
        addUserBtn.addEventListener('click', () => {
            document.getElementById('userModalTitle').textContent = 'Add New User';
            userForm.reset();
            delete userForm.dataset.userId;
            userModal.classList.add('active');
        });
    }

    if (closeUserModal) {
        closeUserModal.addEventListener('click', () => {
            userModal.classList.remove('active');
        });
    }

    if (cancelUserModal) {
        cancelUserModal.addEventListener('click', () => {
            userModal.classList.remove('active');
        });
    }

    if (userForm) {
        userForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const userId = userForm.dataset.userId;
            const formData = {
                fullName: document.getElementById('userFullName').value,
                email: document.getElementById('userEmail').value,
                username: document.getElementById('userUsername').value,
                password: document.getElementById('userPassword').value,
                role: document.getElementById('userRole').value,
                department: document.getElementById('userDepartment').value,
                designation: document.getElementById('userDesignation').value
            };

            try {
                const url = userId ? `${API_URL}/users/${userId}` : `${API_URL}/users`;
                const method = userId ? 'PUT' : 'POST';

                const response = await fetch(url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(formData)
                });

                const data = await response.json();

                if (data.success) {
                    alert(userId ? 'User updated successfully!' : 'User created successfully!');
                    userModal.classList.remove('active');
                    loadUsers();
                } else {
                    alert(data.message || 'Failed to save user');
                }
            } catch (error) {
                console.error('Error saving user:', error);
                alert('An error occurred');
            }
        });
    }

    // Edit User function
    window.editUser = async function(userId) {
        try {
            const response = await fetch(`${API_URL}/users/${userId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();

            if (data.success) {
                const user = data.user;
                document.getElementById('userModalTitle').textContent = 'Edit User';
                document.getElementById('userFullName').value = user.fullName || '';
                document.getElementById('userEmail').value = user.email || '';
                document.getElementById('userUsername').value = user.username || '';
                document.getElementById('userPassword').value = '';
                document.getElementById('userRole').value = user.role || '';
                document.getElementById('userDepartment').value = user.department || '';
                document.getElementById('userDesignation').value = user.designation || '';
                
                userModal.classList.add('active');
                
                // Store userId for update
                userForm.dataset.userId = userId;
            } else {
                alert(data.message || 'Failed to load user');
            }
        } catch (error) {
            console.error('Error loading user:', error);
            alert('An error occurred');
        }
    };

    // Delete User function
    window.deleteUser = async function(userId) {
        if (!confirm('Are you sure you want to delete this user?')) {
            return;
        }

        try {
            const response = await fetch(`${API_URL}/users/${userId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();

            if (data.success) {
                alert('User deleted successfully!');
                loadUsers();
            } else {
                alert(data.message || 'Failed to delete user');
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('An error occurred');
        }
    };

    // ========================================
    // Project Management
    // ========================================
    async function loadProjects() {
        try {
            const response = await fetch(`${API_URL}/projects`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();

            if (data.success) {
                updateProjectsTable(data.projects);
            }
        } catch (error) {
            console.error('Error loading projects:', error);
        }
    }

    function updateProjectsTable(projects) {
        const tbody = document.getElementById('projectsTableBody');
        if (!tbody) return;

        if (projects.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="empty-state">No projects found</td></tr>';
            return;
        }

        tbody.innerHTML = projects.map(project => `
            <tr>
                <td>${project.projectName}</td>
                <td>${project.department}</td>
                <td>${formatDate(project.startDate)}</td>
                <td>${formatDate(project.deadline)}</td>
                <td>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${project.progress || 0}%"></div>
                    </div>
                    <span>${project.progress || 0}%</span>
                </td>
                <td><span class="tag ${project.status}">${project.status}</span></td>
                <td>
                    <button class="action-btn" onclick="editProject('${project._id}')">Edit</button>
                    <button class="action-btn danger" onclick="deleteProject('${project._id}')">Delete</button>
                </td>
            </tr>
        `).join('');
    }

    // Add Project Modal
    const projectModal = document.getElementById('projectModal');
    const addProjectBtn = document.getElementById('addProjectBtn');
    const closeProjectModal = document.getElementById('closeProjectModal');
    const cancelProjectModal = document.getElementById('cancelProjectModal');
    const projectForm = document.getElementById('projectForm');

    if (addProjectBtn && projectModal) {
        addProjectBtn.addEventListener('click', () => {
            document.getElementById('projectModalTitle').textContent = 'Add New Project';
            projectForm.reset();
            delete projectForm.dataset.projectId;
            projectModal.classList.add('active');
        });
    }

    if (closeProjectModal) {
        closeProjectModal.addEventListener('click', () => {
            projectModal.classList.remove('active');
        });
    }

    if (cancelProjectModal) {
        cancelProjectModal.addEventListener('click', () => {
            projectModal.classList.remove('active');
        });
    }

    if (projectForm) {
        projectForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const projectId = projectForm.dataset.projectId;
            const formData = {
                projectName: document.getElementById('projectName').value,
                description: document.getElementById('projectDescription').value,
                department: document.getElementById('projectDepartment').value,
                startDate: document.getElementById('projectStartDate').value,
                deadline: document.getElementById('projectDeadline').value,
                priority: document.getElementById('projectPriority').value
            };

            try {
                const url = projectId ? `${API_URL}/projects/${projectId}` : `${API_URL}/projects`;
                const method = projectId ? 'PUT' : 'POST';

                const response = await fetch(url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(formData)
                });

                const data = await response.json();

                if (data.success) {
                    alert(projectId ? 'Project updated successfully!' : 'Project created successfully!');
                    projectModal.classList.remove('active');
                    loadProjects();
                } else {
                    alert(data.message || 'Failed to save project');
                }
            } catch (error) {
                console.error('Error saving project:', error);
                alert('An error occurred');
            }
        });
    }

    // Edit Project function
    window.editProject = async function(projectId) {
        try {
            const response = await fetch(`${API_URL}/projects/${projectId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();

            if (data.success) {
                const project = data.project;
                document.getElementById('projectModalTitle').textContent = 'Edit Project';
                document.getElementById('projectName').value = project.projectName || '';
                document.getElementById('projectDescription').value = project.description || '';
                document.getElementById('projectDepartment').value = project.department || '';
                document.getElementById('projectStartDate').value = project.startDate ? project.startDate.split('T')[0] : '';
                document.getElementById('projectDeadline').value = project.deadline ? project.deadline.split('T')[0] : '';
                document.getElementById('projectPriority').value = project.priority || '';
                
                projectModal.classList.add('active');
                
                // Store projectId for update
                projectForm.dataset.projectId = projectId;
            } else {
                alert(data.message || 'Failed to load project');
            }
        } catch (error) {
            console.error('Error loading project:', error);
            alert('An error occurred');
        }
    };

    // Delete Project function
    window.deleteProject = async function(projectId) {
        if (!confirm('Are you sure you want to delete this project?')) {
            return;
        }

        try {
            const response = await fetch(`${API_URL}/projects/${projectId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();

            if (data.success) {
                alert('Project deleted successfully!');
                loadProjects();
            } else {
                alert(data.message || 'Failed to delete project');
            }
        } catch (error) {
            console.error('Error deleting project:', error);
            alert('An error occurred');
        }
    };

    // ========================================
    // Task Management
    // ========================================
    async function loadTasks() {
        try {
            const response = await fetch(`${API_URL}/tasks`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();

            if (data.success) {
                updateTasksTable(data.tasks);
            }
        } catch (error) {
            console.error('Error loading tasks:', error);
        }
    }

    function updateTasksTable(tasks) {
        const tbody = document.getElementById('tasksTableBody');
        if (!tbody) return;

        if (tasks.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="empty-state">No tasks found</td></tr>';
            return;
        }

        tbody.innerHTML = tasks.map(task => `
            <tr>
                <td>${task.title}</td>
                <td>${task.assignedTo?.fullName || '-'}</td>
                <td>${task.project?.projectName || '-'}</td>
                <td>${formatDate(task.dueDate)}</td>
                <td><span class="tag ${task.priority}">${task.priority}</span></td>
                <td><span class="tag ${task.status}">${task.status}</span></td>
                <td>
                    <button class="action-btn" onclick="editTask('${task._id}')">Edit</button>
                    <button class="action-btn danger" onclick="deleteTask('${task._id}')">Delete</button>
                </td>
            </tr>
        `).join('');
    }

    // Add Task Modal
    const taskModal = document.getElementById('taskModal');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const closeTaskModal = document.getElementById('closeTaskModal');
    const cancelTaskModal = document.getElementById('cancelTaskModal');
    const taskForm = document.getElementById('taskForm');

    if (addTaskBtn && taskModal) {
        addTaskBtn.addEventListener('click', () => {
            document.getElementById('taskModalTitle').textContent = 'Add New Task';
            taskForm.reset();
            delete taskForm.dataset.taskId;
            taskModal.classList.add('active');
        });
    }

    if (closeTaskModal) {
        closeTaskModal.addEventListener('click', () => {
            taskModal.classList.remove('active');
        });
    }

    if (cancelTaskModal) {
        cancelTaskModal.addEventListener('click', () => {
            taskModal.classList.remove('active');
        });
    }

    if (taskForm) {
        taskForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const taskId = taskForm.dataset.taskId;
            const formData = {
                title: document.getElementById('taskTitle').value,
                description: document.getElementById('taskDescription').value,
                assignedTo: document.getElementById('taskAssignedTo').value,
                project: document.getElementById('taskProject').value,
                dueDate: document.getElementById('taskDueDate').value,
                priority: document.getElementById('taskPriority').value,
                status: document.getElementById('taskStatus').value
            };

            try {
                const url = taskId ? `${API_URL}/tasks/${taskId}` : `${API_URL}/tasks`;
                const method = taskId ? 'PUT' : 'POST';

                const response = await fetch(url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(formData)
                });

                const data = await response.json();

                if (data.success) {
                    alert(taskId ? 'Task updated successfully!' : 'Task created successfully!');
                    taskModal.classList.remove('active');
                    loadTasks();
                } else {
                    alert(data.message || 'Failed to save task');
                }
            } catch (error) {
                console.error('Error saving task:', error);
                alert('An error occurred');
            }
        });
    }

    // Edit Task function
    window.editTask = async function(taskId) {
        try {
            const response = await fetch(`${API_URL}/tasks/${taskId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();

            if (data.success) {
                const task = data.task;
                document.getElementById('taskModalTitle').textContent = 'Edit Task';
                document.getElementById('taskTitle').value = task.title || '';
                document.getElementById('taskDescription').value = task.description || '';
                document.getElementById('taskAssignedTo').value = task.assignedTo?._id || '';
                document.getElementById('taskProject').value = task.project?._id || '';
                document.getElementById('taskDueDate').value = task.dueDate ? task.dueDate.split('T')[0] : '';
                document.getElementById('taskPriority').value = task.priority || '';
                document.getElementById('taskStatus').value = task.status || '';
                
                taskModal.classList.add('active');
                
                // Store taskId for update
                taskForm.dataset.taskId = taskId;
            } else {
                alert(data.message || 'Failed to load task');
            }
        } catch (error) {
            console.error('Error loading task:', error);
            alert('An error occurred');
        }
    };

    // Delete Task function
    window.deleteTask = async function(taskId) {
        if (!confirm('Are you sure you want to delete this task?')) {
            return;
        }

        try {
            const response = await fetch(`${API_URL}/tasks/${taskId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();

            if (data.success) {
                alert('Task deleted successfully!');
                loadTasks();
            } else {
                alert(data.message || 'Failed to delete task');
            }
        } catch (error) {
            console.error('Error deleting task:', error);
            alert('An error occurred');
        }
    };

    // ========================================
    // Announcement Management (Admin)
    // ========================================
    async function loadAnnouncementsAdmin() {
        try {
            const response = await fetch(`${API_URL}/announcements`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();

            if (data.success) {
                updateAnnouncementsAdminTable(data.announcements);
            }
        } catch (error) {
            console.error('Error loading announcements:', error);
        }
    }

    function updateAnnouncementsAdminTable(announcements) {
        const tbody = document.getElementById('announcementsAdminTableBody');
        if (!tbody) return;

        if (announcements.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="empty-state">No announcements found</td></tr>';
            return;
        }

        tbody.innerHTML = announcements.map(ann => `
            <tr>
                <td>${ann.title}</td>
                <td><span class="category-tag ${ann.category}">${ann.category}</span></td>
                <td>${formatDate(ann.publishDate)}</td>
                <td><span class="tag ${ann.status}">${ann.status}</span></td>
                <td>
                    <button class="action-btn" onclick="editAnnouncement('${ann._id}')">Edit</button>
                    <button class="action-btn danger" onclick="deleteAnnouncement('${ann._id}')">Delete</button>
                </td>
            </tr>
        `).join('');
    }

    // Add Announcement Modal
    const announcementModal = document.getElementById('announcementModal');
    const addAnnouncementBtn = document.getElementById('addAnnouncementBtn');
    const closeAnnouncementModal = document.getElementById('closeAnnouncementModal');
    const cancelAnnouncementModal = document.getElementById('cancelAnnouncementModal');
    const announcementForm = document.getElementById('announcementForm');

    if (addAnnouncementBtn && announcementModal) {
        addAnnouncementBtn.addEventListener('click', () => {
            document.getElementById('announcementModalTitle').textContent = 'Add New Announcement';
            announcementForm.reset();
            delete announcementForm.dataset.announcementId;
            announcementModal.classList.add('active');
        });
    }

    if (closeAnnouncementModal) {
        closeAnnouncementModal.addEventListener('click', () => {
            announcementModal.classList.remove('active');
        });
    }

    if (cancelAnnouncementModal) {
        cancelAnnouncementModal.addEventListener('click', () => {
            announcementModal.classList.remove('active');
        });
    }

    if (announcementForm) {
        announcementForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const announcementId = announcementForm.dataset.announcementId;
            const formData = {
                title: document.getElementById('announcementTitle').value,
                content: document.getElementById('announcementContent').value,
                category: document.getElementById('announcementCategory').value,
                status: document.getElementById('announcementStatus').value
            };

            try {
                const url = announcementId ? `${API_URL}/announcements/${announcementId}` : `${API_URL}/announcements`;
                const method = announcementId ? 'PUT' : 'POST';

                const response = await fetch(url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(formData)
                });

                const data = await response.json();

                if (data.success) {
                    alert(announcementId ? 'Announcement updated successfully!' : 'Announcement created successfully!');
                    announcementModal.classList.remove('active');
                    loadAnnouncementsAdmin();
                } else {
                    alert(data.message || 'Failed to save announcement');
                }
            } catch (error) {
                console.error('Error saving announcement:', error);
                alert('An error occurred');
            }
        });
    }

    // Edit Announcement function
    window.editAnnouncement = async function(announcementId) {
        try {
            const response = await fetch(`${API_URL}/announcements/${announcementId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();

            if (data.success) {
                const announcement = data.announcement;
                document.getElementById('announcementModalTitle').textContent = 'Edit Announcement';
                document.getElementById('announcementTitle').value = announcement.title || '';
                document.getElementById('announcementContent').value = announcement.content || '';
                document.getElementById('announcementCategory').value = announcement.category || '';
                document.getElementById('announcementStatus').value = announcement.status || '';
                
                announcementModal.classList.add('active');
                
                // Store announcementId for update
                announcementForm.dataset.announcementId = announcementId;
            } else {
                alert(data.message || 'Failed to load announcement');
            }
        } catch (error) {
            console.error('Error loading announcement:', error);
            alert('An error occurred');
        }
    };

    // Delete Announcement function
    window.deleteAnnouncement = async function(announcementId) {
        if (!confirm('Are you sure you want to delete this announcement?')) {
            return;
        }

        try {
            const response = await fetch(`${API_URL}/announcements/${announcementId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();

            if (data.success) {
                alert('Announcement deleted successfully!');
                loadAnnouncementsAdmin();
            } else {
                alert(data.message || 'Failed to delete announcement');
            }
        } catch (error) {
            console.error('Error deleting announcement:', error);
            alert('An error occurred');
        }
    };

    // Update user info on page load
    updateUserInfo();
}

// ========================================
// Utility Functions
// ========================================

// Format date function
function formatDate(dateString) {
    if (!dateString) return '-';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '-';
    
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}
