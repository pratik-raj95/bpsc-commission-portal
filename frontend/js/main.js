// ========================================
// BPSC Government Commission Portal - Main Module
// Common utilities and shared functions
// ========================================

// ========================================
// Global Variables
// ========================================

let currentUser = null;
let token = null;

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

// Get token from localStorage
function getToken() {
    return localStorage.getItem('token');
}

// Get current user from localStorage
function getCurrentUser() {
    return JSON.parse(localStorage.getItem('user') || '{}');
}

// Store user data in localStorage
function setUserData(token, user) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
}

// Clear user data from localStorage (logout)
function clearUserData() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
}

// Check if user is logged in
function isLoggedIn() {
    return !!getToken();
}

// Get user role
function getUserRole() {
    const user = getCurrentUser();
    return user.role || null;
}

// Check if user has specific role
function hasRole(role) {
    const userRole = getUserRole();
    return userRole === role;
}

// Check if user is admin
function isAdmin() {
    const role = getUserRole();
    return role === 'admin' || role === 'superadmin';
}

// Check if user is employee
function isEmployee() {
    return getUserRole() === 'employee';
}

// Redirect to login
function redirectToLogin() {
    window.location.href = '/';
}

// Redirect based on role
function redirectBasedOnRole(user) {
    const role = user.role;
    
    if (role === 'admin' || role === 'superadmin') {
        window.location.href = '/admin';
    } else if (role === 'employee') {
        window.location.href = '/employee';
    } else {
        window.location.href = '/';
    }
}

// ========================================
// Common UI Functions
// ========================================

// Update user info in header
function updateUserInfo() {
    const user = getCurrentUser();
    
    const userNameElements = document.querySelectorAll('#headerUserName, #dropdownUserName, #dashboardUserName');
    userNameElements.forEach(el => {
        if (el) el.textContent = user.fullName || 'User';
    });

    const designationElements = document.querySelectorAll('#dropdownUserDesignation');
    designationElements.forEach(el => {
        if (el) el.textContent = user.designation || 'User';
    });

    // Update profile images
    const profileImages = document.querySelectorAll('#headerProfileImage, #dropdownProfileImage, #profileImage');
    profileImages.forEach(img => {
        if (img && user.profileImage) {
            img.src = user.profileImage;
        }
    });
}

// Show alert message
function showAlert(message, type = 'info') {
    alert(message);
}

// Confirm dialog
function confirmAction(message) {
    return confirm(message);
}

// ========================================
// Common Event Listeners
// ========================================

// Initialize common functionality
function initCommon() {
    // Get token and user from localStorage
    token = getToken();
    currentUser = getCurrentUser();
    
    // Update user info if logged in
    if (isLoggedIn()) {
        updateUserInfo();
    }
}

// ========================================
// Public Website Functions
// ========================================

// Update login/logout button visibility based on auth state
function updateAuthUI() {
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const headerLoginBtn = document.getElementById('headerLoginBtn');
    
    if (isLoggedIn()) {
        // User is logged in - show logout, hide login
        if (loginBtn) {
            loginBtn.style.display = 'none';
        }
        if (headerLoginBtn) {
            headerLoginBtn.style.display = 'none';
        }
        if (logoutBtn) {
            logoutBtn.style.display = 'inline-block';
        }
    } else {
        // User is not logged in - show login, hide logout
        if (loginBtn) {
            loginBtn.style.display = 'inline-block';
        }
        if (headerLoginBtn) {
            headerLoginBtn.style.display = 'inline-flex';
        }
        if (logoutBtn) {
            logoutBtn.style.display = 'none';
        }
    }
}

// Handle logout from public website
function handlePublicLogout() {
    clearUserData();
    updateAuthUI();
    window.location.href = '/';
}

// Initialize public website
function initPublicWebsite() {
    // Check if we're on the public website
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (!loginBtn && !logoutBtn) return;
    
    // Check login state and update UI on page load
    updateAuthUI();
    
    // Login Modal Functionality
    const loginModal = document.getElementById('loginModal');
    const closeModal = document.getElementById('closeModal');
    const loginForm = document.getElementById('loginForm');

    // Open modal - only if login button exists and user is not logged in
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            loginModal.classList.add('active');
        });
    }

    // Header Login Button - Open modal
    const headerLoginBtn = document.getElementById('headerLoginBtn');
    if (headerLoginBtn) {
        headerLoginBtn.addEventListener('click', () => {
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

    // Handle logout button click on public website
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm('Are you sure you want to logout?')) {
                handlePublicLogout();
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
                // Use login function from api.js
                const data = await login(email, password);

                if (data.success) {
                    // Step 1: Store token in localStorage FIRST
                    setUserData(data.token, data.user);
                    
                    // Step 2: Verify token is stored
                    const storedToken = localStorage.getItem('token');
                    if (!storedToken) {
                        console.error('Failed to store token');
                        alert('Login failed: Could not store authentication token');
                        return;
                    }
                    
                    // Step 3: Show success message
                    alert('Login Successful!');
                    
                    // Step 4: Close login modal (with null check)
                    const loginModal = document.getElementById('loginModal');
                    if (loginModal) {
                        loginModal.classList.remove('active');
                    }
                    
                    // Step 5: Clear the form
                    loginForm.reset();
                    
                    // Step 6: Update UI to show logout button
                    updateAuthUI();
                    
                    // Step 7: Role-based redirect - use explicit window.location.href
                    // Use /admin not admin.html
                    const userRole = data.user.role;
                    if (userRole === 'admin' || userRole === 'superadmin') {
                        // Redirect to admin dashboard
                        window.location.href = '/admin';
                    } else if (userRole === 'employee') {
                        // Redirect to employee dashboard
                        window.location.href = '/employee';
                    } else {
                        // Default redirect to home
                        window.location.href = '/';
                    }
                } else {
                    alert(data.message || 'Login failed');
                }
            } catch (error) {
                console.error('Login error:', error);
                alert('An error occurred during login. Please try again.');
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

    // Load announcements
    loadAnnouncements();
}

// Load announcements for public website
async function loadAnnouncements() {
    try {
        const response = await fetch(`${window.API_URL || 'http://localhost:3000/api'}/announcements`);
        const data = await response.json();
        
        if (data.success) {
            updateAnnouncementsList(data.announcements);
        }
    } catch (error) {
        console.error('Error loading announcements:', error);
    }
}

// Update announcements list in DOM
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

// ========================================
// Dashboard Common Functions
// ========================================

// Initialize dashboard (common for admin and employee)
function initDashboard() {
    const dashboardBody = document.querySelector('.dashboard-body');
    
    if (!dashboardBody) return false;
    
    // Get token and user from localStorage
    token = getToken();
    currentUser = getCurrentUser();

    // Check authentication
    if (!token) {
        redirectToLogin();
        return false;
    }

    // Initialize sidebar navigation
    initSidebarNavigation();
    
    // Initialize profile dropdown
    initProfileDropdown();
    
    // Initialize logout
    initLogout();

    // Update user info
    updateUserInfo();
    
    return true;
}

// Initialize sidebar navigation
function initSidebarNavigation() {
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
            if (window.innerWidth < 992 && sidebar) {
                sidebar.classList.remove('active');
            }

            // Load section data if callback exists
            if (typeof loadSectionData === 'function') {
                loadSectionData(targetId);
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
}

// Initialize profile dropdown
function initProfileDropdown() {
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
}

// Initialize logout functionality
function initLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    const logoutModal = document.getElementById('logoutModal');
    const cancelLogout = document.getElementById('cancelLogout');
    const confirmLogout = document.getElementById('confirmLogout');

    if (logoutBtn && logoutModal) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logoutModal.classList.add('active');
            
            const profileDropdown = document.getElementById('profileDropdown');
            if (profileDropdown) {
                profileDropdown.classList.remove('active');
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
            clearUserData();
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
}

// ========================================
// Modal Helper Functions
// ========================================

// Close modal helper
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

// Open modal helper
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
    }
}







// Sticky Header Shadow Effect

window.addEventListener("scroll", function () {
    const header = document.querySelector(".government-header");
    if (!header) return;

    if (window.scrollY > 20) {
        header.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
    } else {
        header.style.boxShadow = "none";
    }
});



// ========================================
// Initialize on DOM Ready
// ========================================

// Run when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initCommon();
    initPublicWebsite();

    /* ===== SAFE BPSC Slider Script ===== */
    const slides = document.querySelectorAll('.bpsc-slider .slide');
    const nextBtn = document.querySelector('.slider-btn.next');
    const prevBtn = document.querySelector('.slider-btn.prev');

    if (slides.length > 0) {
        let currentIndex = 0;

        function showSlide(index) {
            slides.forEach(slide => slide.classList.remove('active'));
            slides[index].classList.add('active');
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % slides.length;
                showSlide(currentIndex);
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + slides.length) % slides.length;
                showSlide(currentIndex);
            });
        }

        setInterval(() => {
            currentIndex = (currentIndex + 1) % slides.length;
            showSlide(currentIndex);
        }, 4000);
    }
});


