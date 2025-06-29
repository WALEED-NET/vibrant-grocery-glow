// Dashboard specific JavaScript functionality

class DashboardManager {
    constructor(app) {
        this.app = app;
        this.charts = {};
        this.refreshInterval = null;
        this.init();
    }

    init() {
        this.setupDashboardEvents();
        this.startAutoRefresh();
    }

    setupDashboardEvents() {
        // Stat card click handlers
        document.addEventListener('click', (e) => {
            const statCard = e.target.closest('.stat-card');
            if (statCard) {
                this.handleStatCardClick(statCard);
            }
        });

        // Exchange rate card interactions
        const exchangeRateCard = document.querySelector('.exchange-rate-card');
        if (exchangeRateCard) {
            exchangeRateCard.addEventListener('click', () => {
                this.app.navigateToSection('exchange-rate');
            });
        }

        // Recent updates interactions
        document.addEventListener('click', (e) => {
            const updateItem = e.target.closest('.update-item');
            if (updateItem) {
                this.handleUpdateItemClick(updateItem);
            }
        });

        // Feature card interactions
        document.addEventListener('click', (e) => {
            const featureCard = e.target.closest('.feature-card');
            if (featureCard) {
                this.handleFeatureCardClick(featureCard);
            }
        });
    }

    handleStatCardClick(statCard) {
        const statIcon = statCard.querySelector('.stat-icon i');
        if (!statIcon) return;

        // Add click animation
        statCard.style.transform = 'scale(0.98)';
        setTimeout(() => {
            statCard.style.transform = '';
        }, 150);

        // Navigate based on stat type
        const iconClass = statIcon.getAttribute('data-lucide');
        switch (iconClass) {
            case 'package':
                this.app.navigateToSection('products');
                break;
            case 'alert-triangle':
                this.app.navigateToSection('shortage');
                break;
            case 'trending-up':
                this.app.navigateToSection('sales');
                break;
            case 'wallet':
                this.showInventoryDetails();
                break;
        }
    }

    handleUpdateItemClick(updateItem) {
        const productName = updateItem.querySelector('.product-name')?.textContent;
        if (productName) {
            this.app.showNotification(`عرض تفاصيل المنتج: ${productName}`, 'info');
            // In a real app, this would navigate to product details
            this.app.navigateToSection('products');
        }
    }

    handleFeatureCardClick(featureCard) {
        const featureTitle = featureCard.querySelector('h3')?.textContent;
        if (featureTitle) {
            this.app.showNotification(`${featureTitle} - ستكون متاحة في الإصدار القادم`, 'info');
        }
    }

    showInventoryDetails() {
        // Create a simple modal or notification with inventory breakdown
        const inventoryData = this.calculateInventoryBreakdown();
        const message = `
            <strong>تفاصيل المخزون:</strong><br>
            • المنتجات المتوفرة: ${inventoryData.available}<br>
            • المنتجات الناقصة: ${inventoryData.shortage}<br>
            • إجمالي الأصناف: ${inventoryData.total}
        `;
        this.app.showNotification(message, 'info');
    }

    calculateInventoryBreakdown() {
        const total = this.app.data.stats.totalProducts;
        const shortage = this.app.data.stats.shortageCount;
        const available = total - shortage;

        return { total, available, shortage };
    }

    updateDashboardStats() {
        // Simulate real-time data updates
        const stats = this.app.data.stats;
        
        // Add some random variation to simulate real data
        const variation = () => Math.random() * 0.02 - 0.01; // ±1% variation
        
        stats.inventoryValueYER = Math.round(stats.inventoryValueYER * (1 + variation()));
        stats.dailyProfitYER = Math.round(stats.dailyProfitYER * (1 + variation()));
        
        // Update the display
        this.app.updateDashboardData();
    }

    animateStatCards() {
        const statCards = document.querySelectorAll('.stat-card');
        statCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    card.style.transition = 'all 0.6s ease-out';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 50);
            }, index * 100);
        });
    }

    updateRecentUpdates() {
        const updatesContainer = document.getElementById('recentUpdates');
        if (!updatesContainer) return;

        // Simulate new updates
        const sampleUpdates = [
            {
                productName: 'سكر أبيض',
                date: new Date().toISOString().split('T')[0],
                newPrice: 6280,
                change: 500
            },
            {
                productName: 'أرز بسمتي',
                date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
                newPrice: 8960,
                change: 800
            },
            {
                productName: 'زيت دوار الشمس',
                date: new Date(Date.now() - 172800000).toISOString().split('T')[0],
                newPrice: 11540,
                change: 1000
            }
        ];

        updatesContainer.innerHTML = sampleUpdates.map(update => `
            <div class="update-item">
                <div class="update-info">
                    <div class="product-name">${update.productName}</div>
                    <div class="update-date">${update.date}</div>
                </div>
                <div class="update-price">
                    <div class="new-price">${this.app.formatNumber(update.newPrice)} ر.ي</div>
                    <div class="price-change positive">+${this.app.formatNumber(update.change)} ر.ي</div>
                </div>
            </div>
        `).join('');
    }

    startAutoRefresh() {
        // Refresh dashboard data every 30 seconds
        this.refreshInterval = setInterval(() => {
            if (this.app.currentSection === 'dashboard') {
                this.updateDashboardStats();
                this.updateRecentUpdates();
            }
        }, 30000);
    }

    stopAutoRefresh() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
            this.refreshInterval = null;
        }
    }

    // Chart functionality (placeholder for future implementation)
    initializeCharts() {
        // This would initialize charts using a library like Chart.js
        console.log('Charts would be initialized here');
    }

    updateCharts() {
        // This would update existing charts with new data
        console.log('Charts would be updated here');
    }

    // Export functionality
    exportDashboardData() {
        const data = {
            stats: this.app.data.stats,
            exchangeRate: this.app.data.exchangeRate,
            timestamp: new Date().toISOString(),
            breakdown: this.calculateInventoryBreakdown()
        };

        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `dashboard-data-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
        this.app.showNotification('تم تصدير بيانات لوحة التحكم', 'success');
    }

    // Print functionality
    printDashboard() {
        const printContent = document.getElementById('dashboardContent');
        if (!printContent) return;

        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html dir="rtl">
            <head>
                <title>لوحة التحكم - البقالة الذكية</title>
                <style>
                    body { font-family: 'Cairo', Arial, sans-serif; direction: rtl; }
                    .stats-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
                    .stat-card { border: 1px solid #ccc; padding: 1rem; border-radius: 8px; }
                    .no-print { display: none; }
                    @media print {
                        .stats-grid { grid-template-columns: repeat(4, 1fr); }
                    }
                </style>
            </head>
            <body>
                <h1>لوحة التحكم - البقالة الذكية</h1>
                <p>تاريخ الطباعة: ${new Date().toLocaleDateString('ar-YE')}</p>
                ${printContent.innerHTML}
            </body>
            </html>
        `);
        
        printWindow.document.close();
        printWindow.print();
        printWindow.close();
    }

    destroy() {
        this.stopAutoRefresh();
        // Clean up any other resources
    }
}

// Initialize dashboard manager when app is ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait for main app to initialize
    setTimeout(() => {
        if (window.groceryApp) {
            window.dashboardManager = new DashboardManager(window.groceryApp);
        }
    }, 100);
});

// Export functions for global access
window.exportDashboardData = function() {
    if (window.dashboardManager) {
        window.dashboardManager.exportDashboardData();
    }
};

window.printDashboard = function() {
    if (window.dashboardManager) {
        window.dashboardManager.printDashboard();
    }
};