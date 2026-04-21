// auth.js - Centralized Authentication System

// Check if user is logged in
function checkAuth() {
    const savedUser = localStorage.getItem('lunoUser') || sessionStorage.getItem('lunoUser');
    const currentPage = window.location.pathname.split('/').pop();
    
    // Pages that don't require login
    const publicPages = ['index.html', 'register.html'];
    
    if (!savedUser && !publicPages.includes(currentPage)) {
        console.log(`[${currentPage}] No session found, redirecting to login`);
        window.location.href = 'index.html';
        return false;
    }
    
    if (savedUser) {
        try {
            const user = JSON.parse(savedUser);
            console.log(`[${currentPage}] Welcome back, ${user.email}`);
            return user;
        } catch(e) {
            console.error('Error parsing user data');
            return null;
        }
    }
    return null;
}

// Get current user data
function getCurrentUser() {
    const savedUser = localStorage.getItem('lunoUser') || sessionStorage.getItem('lunoUser');
    if (savedUser) {
        try {
            return JSON.parse(savedUser);
        } catch(e) {}
    }
    return null;
}

// Save user session after login
function saveUserSession(userData, rememberMe) {
    const sessionData = {
        email: userData.email,
        fullName: userData.fullName || userData.email.split('@')[0],
        loggedIn: true,
        loginTime: new Date().toISOString()
    };
    
    if (rememberMe) {
        localStorage.setItem('lunoUser', JSON.stringify(sessionData));
        console.log('✅ Session saved to localStorage (remember me)');
    } else {
        sessionStorage.setItem('lunoUser', JSON.stringify(sessionData));
        console.log('✅ Session saved to sessionStorage');
    }
    
    // Verify save worked
    const verify = localStorage.getItem('lunoUser') || sessionStorage.getItem('lunoUser');
    if (verify) {
        console.log('✅ Session verification passed');
        return true;
    } else {
        console.error('❌ Session verification failed');
        return false;
    }
}

// Logout user
function logoutUser() {
    localStorage.removeItem('lunoUser');
    sessionStorage.removeItem('lunoUser');
    console.log('👋 User logged out');
    window.location.href = 'index.html';
}

// Update user display name on all pages
function updateUserDisplay() {
    const user = getCurrentUser();
    const displayElements = document.querySelectorAll('.username');
    
    if (user && displayElements.length > 0) {
        const displayName = user.fullName ? user.fullName.split(' ')[0] : user.email.split('@')[0];
        displayElements.forEach(el => {
            el.textContent = displayName;
        });
    }
}

// Run auth check when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Skip auth check for public pages
    const currentPage = window.location.pathname.split('/').pop();
    const publicPages = ['index.html', 'register.html'];
    
    if (!publicPages.includes(currentPage)) {
        checkAuth();
        updateUserDisplay();
    }
});
