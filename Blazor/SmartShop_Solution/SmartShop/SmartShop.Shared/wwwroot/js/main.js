// Minimal JavaScript for Blazor app - Only essential UI interactions

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Initialize sidebar toggle for mobile
    initializeSidebarToggle();
    
    // Initialize bottom navigation
    initializeBottomNavigation();
    
    // Initialize more menu modal
    initializeMoreMenuModal();
    
    // Re-initialize icons when Blazor navigates
    initializeMutationObserver();
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
    const moreMenuBtn = document.getElementById('moreMenuBtn');
    const moreMenuModal = document.getElementById('moreMenuModal');
    
    if (moreMenuBtn && moreMenuModal) {
        moreMenuBtn.addEventListener('click', function() {
            moreMenuModal.classList.add('active');
        });
    }
}

function initializeMoreMenuModal() {
    const moreMenuModal = document.getElementById('moreMenuModal');
    
    if (moreMenuModal) {
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

function initializeMutationObserver() {
    // Re-initialize icons when DOM changes (for Blazor navigation)
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

// Handle window resize for responsive behavior
window.addEventListener('resize', function() {
    const sidebar = document.getElementById('sidebar');
    if (window.innerWidth > 768 && sidebar) {
        sidebar.classList.remove('open');
    }
});