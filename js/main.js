// Main JavaScript file - Core functionality

class GroceryApp {
    constructor() {
        this.currentSection = 'dashboard';
        this.sidebarOpen = false;
        this.moreMenuOpen = false;
        this.data = {
            products: [],
            exchangeRate: 680,
            stats: {
                totalProducts: 20,
                inventoryValueYER: 2450000,
                shortageCount: 4,
                dailyProfitYER: 125000
            }
        };
        
        this.init();
    }

    init() {
        this.showSplashScreen();
        this.setupEventListeners();
        this.loadData();
        this.initializeLucideIcons();
    }

    showSplashScreen() {
        const splashScreen = document.getElementById('splashScreen');
        const mainApp = document.getElementById('mainApp');
        
        // Show splash for 2.5 seconds
        setTimeout(() => {
            splashScreen.style.opacity = '0';
            setTimeout(() => {
                splashScreen.classList.add('hidden');
                mainApp.classList.remove('hidden');
                this.updatePageContent();
            }, 500);
        }, 2500);
    }

    setupEventListeners() {
        // Sidebar toggle
        const sidebarToggle = document.getElementById('sidebarToggle');
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => this.toggleSidebar());
        }

        // Navigation items
        document.addEventListener('click', (e) => {
            const navItem = e.target.closest('[data-section]');
            if (navItem) {
                e.preventDefault();
                const section = navItem.dataset.section;
                this.navigateToSection(section);
            }
        });

        // More menu toggle (mobile)
        const moreMenuBtn = document.getElementById('moreMenuBtn');
        if (moreMenuBtn) {
            moreMenuBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleMoreMenu();
            });
        }

        // Close more menu when clicking outside
        document.addEventListener('click', (e) => {
            const moreMenuModal = document.getElementById('moreMenuModal');
            if (moreMenuModal && this.moreMenuOpen && !e.target.closest('.more-menu-modal') && !e.target.closest('.more-btn')) {
                this.toggleMoreMenu();
            }
        });

        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', (e) => {
            const sidebar = document.getElementById('sidebar');
            if (window.innerWidth <= 768 && this.sidebarOpen && 
                !e.target.closest('.sidebar') && !e.target.closest('.sidebar-toggle')) {
                this.toggleSidebar();
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && this.sidebarOpen) {
                this.sidebarOpen = false;
                document.getElementById('sidebar').classList.remove('open');
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (this.moreMenuOpen) {
                    this.toggleMoreMenu();
                } else if (this.sidebarOpen && window.innerWidth <= 768) {
                    this.toggleSidebar();
                }
            }
        });
    }

    toggleSidebar() {
        this.sidebarOpen = !this.sidebarOpen;
        const sidebar = document.getElementById('sidebar');
        sidebar.classList.toggle('open', this.sidebarOpen);
    }

    toggleMoreMenu() {
        this.moreMenuOpen = !this.moreMenuOpen;
        const moreMenuModal = document.getElementById('moreMenuModal');
        moreMenuModal.classList.toggle('active', this.moreMenuOpen);
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = this.moreMenuOpen ? 'hidden' : '';
    }

    navigateToSection(section) {
        if (this.currentSection === section) return;
        
        this.currentSection = section;
        this.updateActiveNavigation();
        this.updatePageContent();
        this.updatePageTitle();
        
        // Close mobile menus
        if (this.sidebarOpen && window.innerWidth <= 768) {
            this.toggleSidebar();
        }
        if (this.moreMenuOpen) {
            this.toggleMoreMenu();
        }
    }

    updateActiveNavigation() {
        // Update sidebar navigation
        document.querySelectorAll('.sidebar .nav-item').forEach(item => {
            item.classList.toggle('active', item.dataset.section === this.currentSection);
        });

        // Update bottom navigation
        document.querySelectorAll('.bottom-nav-item').forEach(item => {
            item.classList.toggle('active', item.dataset.section === this.currentSection);
        });

        // Update more menu items
        document.querySelectorAll('.more-menu-item').forEach(item => {
            item.classList.toggle('active', item.dataset.section === this.currentSection);
        });
    }

    updatePageContent() {
        // Hide all content sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });

        // Show current section
        const currentContent = document.getElementById(`${this.currentSection}Content`);
        if (currentContent) {
            currentContent.classList.add('active');
        }

        // Update dashboard data if on dashboard
        if (this.currentSection === 'dashboard') {
            this.updateDashboardData();
        }
    }

    updatePageTitle() {
        const titles = {
            dashboard: 'لوحة التحكم',
            products: 'إدارة المنتجات',
            sales: 'عمليات البيع',
            purchase: 'عمليات الشراء',
            shortage: 'سلة النواقص',
            'exchange-rate': 'سعر الصرف',
            units: 'إدارة الوحدات',
            reports: 'التقارير',
            settings: 'الإعدادات',
            profile: 'بيانات الحساب'
        };

        const pageTitle = document.getElementById('pageTitle');
        if (pageTitle) {
            pageTitle.textContent = titles[this.currentSection] || 'البقالة الذكية';
        }
    }

    updateDashboardData() {
        // Update stats
        const totalProductsEl = document.getElementById('totalProducts');
        if (totalProductsEl) {
            totalProductsEl.textContent = this.data.stats.totalProducts;
        }

        const inventoryValueEl = document.getElementById('inventoryValueYER');
        if (inventoryValueEl) {
            inventoryValueEl.textContent = this.formatNumber(this.data.stats.inventoryValueYER);
        }

        const shortageCountEl = document.getElementById('shortageCount');
        if (shortageCountEl) {
            shortageCountEl.textContent = this.data.stats.shortageCount;
        }

        const dailyProfitEl = document.getElementById('dailyProfitYER');
        if (dailyProfitEl) {
            dailyProfitEl.textContent = this.formatNumber(this.data.stats.dailyProfitYER);
        }

        const exchangeRateEl = document.getElementById('currentExchangeRate');
        if (exchangeRateEl) {
            exchangeRateEl.textContent = this.formatNumber(this.data.exchangeRate);
        }

        // Update calculated values
        this.updateCalculatedValues();
    }

    updateCalculatedValues() {
        // Calculate SAR values
        const inventoryValueSAR = Math.round(this.data.stats.inventoryValueYER / this.data.exchangeRate);
        const dailyProfitSAR = Math.round(this.data.stats.dailyProfitYER / this.data.exchangeRate);

        // Update secondary values
        const secondaryValues = document.querySelectorAll('.secondary-value span:first-child');
        if (secondaryValues.length >= 2) {
            secondaryValues[0].textContent = `≈ ${this.formatNumber(inventoryValueSAR)}`;
            secondaryValues[1].textContent = `≈ ${this.formatNumber(dailyProfitSAR)}`;
        }

        // Update exchange rate examples
        const examples = document.querySelectorAll('.example-value');
        if (examples.length >= 3) {
            examples[0].textContent = this.formatNumber(this.data.exchangeRate * 10);
            examples[1].textContent = this.formatNumber(this.data.exchangeRate * 50);
            examples[2].textContent = this.formatNumber(this.data.exchangeRate * 100);
        }
    }

    loadData() {
        // Load data from localStorage or initialize with default values
        const savedData = localStorage.getItem('groceryAppData');
        if (savedData) {
            try {
                this.data = { ...this.data, ...JSON.parse(savedData) };
            } catch (e) {
                console.warn('Failed to load saved data:', e);
            }
        }

        // Initialize with sample data if no data exists
        if (this.data.products.length === 0) {
            this.initializeSampleData();
        }
    }

    saveData() {
        try {
            localStorage.setItem('groceryAppData', JSON.stringify(this.data));
        } catch (e) {
            console.warn('Failed to save data:', e);
        }
    }

    initializeSampleData() {
        // This would be replaced with actual data loading logic
        this.data.products = [
            { id: 1, name: 'سكر أبيض', quantity: 50, price: 6280 },
            { id: 2, name: 'أرز بسمتي', quantity: 30, price: 8960 },
            { id: 3, name: 'زيت دوار الشمس', quantity: 25, price: 11540 }
        ];
    }

    formatNumber(number) {
        return new Intl.NumberFormat('ar-YE').format(number);
    }

    initializeLucideIcons() {
        // Initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    // Utility methods
    showNotification(message, type = 'info') {
        // Simple notification system
        const notification = document.createElement('div');
        notification.className = `alert alert-${type}`;
        notification.innerHTML = `
            <div class="alert-content">
                <div class="alert-message">${message}</div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // API simulation methods
    async simulateApiCall(data, delay = 1000) {
        return new Promise(resolve => {
            setTimeout(() => resolve(data), delay);
        });
    }
}

// Global functions for external access
window.navigateToShortage = function() {
    if (window.groceryApp) {
        window.groceryApp.navigateToSection('shortage');
    }
};

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.groceryApp = new GroceryApp();
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (!document.hidden && window.groceryApp) {
        // Refresh data when page becomes visible
        window.groceryApp.updateDashboardData();
    }
});

// Handle online/offline status
window.addEventListener('online', () => {
    if (window.groceryApp) {
        window.groceryApp.showNotification('تم استعادة الاتصال بالإنترنت', 'success');
    }
});

window.addEventListener('offline', () => {
    if (window.groceryApp) {
        window.groceryApp.showNotification('لا يوجد اتصال بالإنترنت - يعمل التطبيق في وضع عدم الاتصال', 'warning');
    }
});