// Main JavaScript functionality for Blazor app

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Initialize sidebar toggle
    initializeSidebarToggle();
    
    // Initialize bottom navigation
    initializeBottomNavigation();
    
    // Initialize more menu modal
    initializeMoreMenuModal();
    
    // Initialize responsive behavior
    initializeResponsiveBehavior();
});

function initializeSidebarToggle() {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('open');
        });
        
        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
                    sidebar.classList.remove('open');
                }
            }
        });
    }
}

function initializeBottomNavigation() {
    const bottomNavItems = document.querySelectorAll('.bottom-nav-item:not(.more-btn)');
    
    bottomNavItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            bottomNavItems.forEach(navItem => navItem.classList.remove('active'));
            // Add active class to clicked item
            this.classList.add('active');
        });
    });
}

function initializeMoreMenuModal() {
    const moreMenuBtn = document.getElementById('moreMenuBtn');
    const moreMenuModal = document.getElementById('moreMenuModal');
    
    if (moreMenuBtn && moreMenuModal) {
        moreMenuBtn.addEventListener('click', function() {
            moreMenuModal.classList.add('active');
        });
        
        // Close modal when clicking outside
        moreMenuModal.addEventListener('click', function(e) {
            if (e.target === moreMenuModal) {
                moreMenuModal.classList.remove('active');
            }
        });
        
        // Close modal when clicking on menu items
        const menuItems = moreMenuModal.querySelectorAll('.more-menu-item');
        menuItems.forEach(item => {
            item.addEventListener('click', function() {
                moreMenuModal.classList.remove('active');
            });
        });
    }
}

function initializeResponsiveBehavior() {
    // Handle window resize
    window.addEventListener('resize', function() {
        const sidebar = document.getElementById('sidebar');
        if (window.innerWidth > 768 && sidebar) {
            sidebar.classList.remove('open');
        }
    });
    
    // Update icons when DOM changes (for Blazor navigation)
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                // Re-initialize Lucide icons for new content
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
            }
        });
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

// Utility functions for components
window.SmartShopUtils = {
    // Format currency
    formatCurrency: function(amount, currency = 'YER') {
        return new Intl.NumberFormat('ar-YE', {
            style: 'decimal',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount) + (currency === 'YER' ? ' ر.ي' : ' ر.س');
    },
    
    // Calculate selling price
    calculateSellingPrice: function(purchasePrice, profitMargin, exchangeRate = 680) {
        return (purchasePrice * exchangeRate) + profitMargin;
    },
    
    // Check if product is low stock
    isLowStock: function(currentQuantity, minimumQuantity) {
        return currentQuantity <= minimumQuantity;
    },
    
    // Check if product is expiring soon
    isExpiringSoon: function(expiryDate, daysThreshold = 30) {
        if (!expiryDate) return false;
        const today = new Date();
        const expiry = new Date(expiryDate);
        const diffTime = expiry - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= daysThreshold && diffDays >= 0;
    },
    
    // Show notification
    showNotification: function(message, type = 'info') {
        // Implementation for showing notifications
        console.log(`${type.toUpperCase()}: ${message}`);
    },
    
    // Debounce function for search
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};

// Export for use in Blazor components
window.blazorCulture = {
    get: () => 'ar-YE',
    set: (culture) => {
        // Implementation for culture setting
    }
};