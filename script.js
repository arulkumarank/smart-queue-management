// Common functions that can be used across pages

/**
 * Format time difference in a human-readable format
 * @param {number} timestamp - Timestamp in milliseconds
 * @returns {string} - Formatted time difference
 */
// localStorage.removeItem('users');
function formatTimeDiff(timestamp) {
    const now = Date.now();
    const diffMs = now - timestamp;
    
    // Convert to seconds
    const diffSec = Math.floor(diffMs / 1000);
    
    if (diffSec < 60) {
        return `${diffSec} seconds ago`;
    }
    
    // Convert to minutes
    const diffMin = Math.floor(diffSec / 60);
    
    if (diffMin < 60) {
        return `${diffMin} minute${diffMin !== 1 ? 's' : ''} ago`;
    }
    
    // Convert to hours
    const diffHour = Math.floor(diffMin / 60);
    
    if (diffHour < 24) {
        return `${diffHour} hour${diffHour !== 1 ? 's' : ''} ago`;
    }
    
    // Convert to days
    const diffDay = Math.floor(diffHour / 24);
    return `${diffDay} day${diffDay !== 1 ? 's' : ''} ago`;
}

/**
 * Check if a user session has expired (30 minutes)
 * @returns {boolean} - True if session has expired
 */
function isSessionExpired() {
    const lastActivity = localStorage.getItem('lastActivity');
    if (!lastActivity) return true;
    
    const now = Date.now();
    const diff = now - parseInt(lastActivity);
    
    // 30 minutes in milliseconds
    return diff > 30 * 60 * 1000;
}

/**
 * Update last activity timestamp
 */
function updateLastActivity() {
    localStorage.setItem('lastActivity', Date.now().toString());
}

/**
 * Show a notification using the browser's Notification API if available
 * @param {string} title - Notification title
 * @param {string} body - Notification body
 */
function showBrowserNotification(title, body) {
    if (!("Notification" in window)) {
        console.log("This browser does not support notifications");
        return;
    }
    
    if (Notification.permission === "granted") {
        new Notification(title, { body: body });
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                new Notification(title, { body: body });
            }
        });
    }
}

/**
 * Calculate the average service time for queue statistics
 * @returns {number} - Average service time in minutes
 */
function calculateAverageServiceTime() {
    // In a real application, this would be calculated based on historical data
    // For now, return a fixed value (3 minutes)
    return 3;
}

/**
 * Generate a unique ID for queue items
 * @returns {string} - Unique ID
 */
function generateId() {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

// Initialize common data on page load
document.addEventListener('DOMContentLoaded', function() {
    // Update last activity
    updateLastActivity();
    
    // Check for session expiry every minute
    setInterval(function() {
        if (isSessionExpired()) {
            // Log out user if session has expired
            localStorage.removeItem('currentUser');
            if (window.location.pathname !== '/index.html') {
                alert('Your session has expired. Please log in again.');
                window.location.href = 'index.html';
            }
        }
    }, 60000); // Check every minute
});