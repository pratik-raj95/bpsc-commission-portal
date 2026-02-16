// ========================================
// BPSC Government Commission Portal
// JavaScript Application
// ========================================

// API Base URL
const API_URL = 'http://localhost:3000/api';

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
    loginBtn.addEventListener('click', () => {
        loginModal.classList.add('active');
    });

    // Close modal
    closeModal.addEventListener('click', () => {
        loginModal.classList.remove('active');
    });

    // Close modal on outside click
    loginModal.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            loginModal.classList.remove('active');
        }
    });

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

                const data = await response.json();

                if (data.success) {
                    // Store token
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    
                    loginModal.classList.remove('active');
                    
                    // Redirect based on role
                    if (data.user.role === 'superadmin' || data.user.role === 'admin') {
                        window.location.href = '/admin';
                    } else if (data.user.role === 'employee') {
                        window.location.href = '/employee';
                    } else {
                        alert('Login successful!');
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
    // Sidebar Navigation
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

    // User Profile Dropdown
    const userProfile = document.getElementById('userProfile');
    const logoutModal = document.getElementById('logoutModal');
    const cancelLogout = document.getElementById('cancelLogout');
    const confirmLogout = document.getElementById('confirmLogout');

    if (userProfile) {
        userProfile.addEventListener('click', () => {
            if (logoutModal) {
                logoutModal.classList.add('active');
            }
        });
    }

    if (cancelLogout) {
        cancelLogout.addEventListener('click', () => {
            logoutModal.classList.remove('active');
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

    // Close modal on outside click
    if (logoutModal) {
        logoutModal.addEventListener('click', (e) => {
            if (e.target === logoutModal) {
                logoutModal.classList.remove('active');
            }
        });
    }

    // Check authentication
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (!token) {
        // Redirect to home if not logged in
        window.location.href = '/';
    } else {
        // Update user info in UI
        const userNameElements = document.querySelectorAll('.user-name');
        userNameElements.forEach(el => {
            el.textContent = user.fullName || 'User';
        });
    }

    // Form submissions
    const settingsForms = document.querySelectorAll('.settings-form, .profile-form, .password-form');
    settingsForms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Settings saved successfully!');
        });
    });

    // Task Update Form
    const taskUpdateForm = document.querySelector('.task-update-form');
    if (taskUpdateForm) {
        taskUpdateForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const taskSelect = taskUpdateForm.querySelector('select');
            const statusSelect = taskUpdateForm.querySelectorAll('select')[1];
            const comments = taskUpdateForm.querySelector('textarea');

            if (taskSelect && statusSelect) {
                alert('Task status updated successfully!');
                taskUpdateForm.reset();
            }
        });
    }

    // Filter functionality
    const filterSelects = document.querySelectorAll('.filter-select');
    filterSelects.forEach(select => {
        select.addEventListener('change', () => {
            // In a real application, this would filter the data
            console.log('Filter changed:', select.value);
        });
    });

    // Action buttons
    const actionButtons = document.querySelectorAll('.action-btn');
    actionButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const action = btn.textContent.trim().toLowerCase();
            
            if (action === 'edit' || action === 'update') {
                // Open edit modal or handle edit
                console.log('Edit action');
            } else if (action === 'delete') {
                if (confirm('Are you sure you want to delete this item?')) {
                    console.log('Delete confirmed');
                }
            } else if (action === 'download') {
                console.log('Download action');
            }
        });
    });

    // Load dashboard data
    async function loadDashboardData() {
        if (!token) return;

        try {
            // Fetch announcements
            const announcementsResponse = await fetch(`${API_URL}/announcements`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const announcementsData = await announcementsResponse.json();
            
            if (announcementsData.success) {
                // Update announcements UI
                console.log('Announcements loaded:', announcementsData.announcements.length);
            }

            // Fetch tasks (for employee dashboard)
            if (user.role === 'employee') {
                const tasksResponse = await fetch(`${API_URL}/tasks`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const tasksData = await tasksResponse.json();
                
                if (tasksData.success) {
                    console.log('Tasks loaded:', tasksData.tasks.length);
                }
            }

        } catch (error) {
            console.error('Error loading dashboard data:', error);
        }
    }

    // Load data on page load
    loadDashboardData();
}

// ========================================
// Utility Functions
// ========================================

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('en-IN', options);
}

// Format date with time
function formatDateTime(dateString) {
    const date = new Date(dateString);
    const options = { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return date.toLocaleDateString('en-IN', options);
}

// Show notification
function showNotification(message, type = 'info') {
    // In a real application, this would show a toast notification
    alert(message);
}

// Check API connection
async function checkAPIConnection() {
    try {
        const response = await fetch(`${API_URL}/auth/me`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
            }
        });
        return response.ok;
    } catch (error) {
        console.error('API connection failed:', error);
        return false;
    }
}

// ========================================
// Initialize Application
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('BPSC Portal loaded');
    
    // Check API connection
    checkAPIConnection().then(connected => {
        if (!connected) {
            console.warn('API server not connected. Some features may not work.');
        }
    });
});
