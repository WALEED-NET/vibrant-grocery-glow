
// Sales Page JavaScript

class SalesManager {
    constructor() {
        this.products = this.loadProducts();
        this.sales = this.loadSales();
        this.currentInvoice = {
            items: [],
            customer: '',
            total: 0
        };
        this.selectedSearchIndex = -1;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateStats();
        this.renderRecentSales();
        this.updateInvoiceDisplay();
    }

    setupEventListeners() {
        // Product search
        const searchInput = document.getElementById('productSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleProductSearch(e.target.value);
            });

            searchInput.addEventListener('keydown', (e) => {
                this.handleSearchKeydown(e);
            });
        }

        // Customer name
        const customerInput = document.getElementById('customerName');
        if (customerInput) {
            customerInput.addEventListener('input', (e) => {
                this.currentInvoice.customer = e.target.value;
            });
        }

        // Hide search results when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-container')) {
                this.hideSearchResults();
            }
        });
    }

    loadProducts() {
        const saved = localStorage.getItem('groceryProducts');
        return saved ? JSON.parse(saved) : [];
    }

    loadSales() {
        const saved = localStorage.getItem('grocerySales');
        return saved ? JSON.parse(saved) : [];
    }

    saveSales() {
        localStorage.setItem('grocerySales', JSON.stringify(this.sales));
    }

    handleProductSearch(query) {
        const resultsContainer = document.getElementById('searchResults');
        if (!resultsContainer) return;

        if (!query.trim()) {
            this.hideSearchResults();
            return;
        }

        const filteredProducts = this.products.filter(product =>
            product.name.toLowerCase().includes(query.toLowerCase()) &&
            product.currentQuantity > 0
        );

        if (filteredProducts.length === 0) {
            resultsContainer.innerHTML = '<div class="search-result-item">لا توجد منتجات متطابقة</div>';
            resultsContainer.classList.add('show');
            return;
        }

        resultsContainer.innerHTML = filteredProducts.map((product, index) => `
            <div class="search-result-item" data-product-id="${product.id}" data-index="${index}">
                <div class="result-info">
                    <div class="result-name">${product.name}</div>
                    <div class="result-details">
                        <span>المتوفر: ${product.currentQuantity} ${product.unit}</span>
                        <span>الفئة: ${this.getCategoryName(product.category)}</span>
                    </div>
                </div>
                <div class="result-price">${this.formatNumber(product.sellingPrice)} ر.ي</div>
            </div>
        `).join('');

        resultsContainer.classList.add('show');
        this.selectedSearchIndex = -1;

        // Add click handlers
        resultsContainer.querySelectorAll('.search-result-item').forEach((item, index) => {
            item.addEventListener('click', () => {
                const productId = item.dataset.productId;
                this.addProductToInvoice(productId);
            });
        });
    }

    handleSearchKeydown(e) {
        const resultsContainer = document.getElementById('searchResults');
        const items = resultsContainer.querySelectorAll('.search-result-item');

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            this.selectedSearchIndex = Math.min(this.selectedSearchIndex + 1, items.length - 1);
            this.updateSearchSelection(items);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            this.selectedSearchIndex = Math.max(this.selectedSearchIndex - 1, -1);
            this.updateSearchSelection(items);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (this.selectedSearchIndex >= 0 && items[this.selectedSearchIndex]) {
                const productId = items[this.selectedSearchIndex].dataset.productId;
                this.addProductToInvoice(productId);
            }
        } else if (e.key === 'Escape') {
            this.hideSearchResults();
        }
    }

    updateSearchSelection(items) {
        items.forEach((item, index) => {
            if (index === this.selectedSearchIndex) {
                item.classList.add('selected');
            } else {
                item.classList.remove('selected');
            }
        });
    }

    hideSearchResults() {
        const resultsContainer = document.getElementById('searchResults');
        if (resultsContainer) {
            resultsContainer.classList.remove('show');
        }
        this.selectedSearchIndex = -1;
    }

    addProductToInvoice(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product || product.currentQuantity <= 0) return;

        // Check if product already exists in invoice
        const existingItem = this.currentInvoice.items.find(item => item.productId === productId);
        
        if (existingItem) {
            if (existingItem.quantity < product.currentQuantity) {
                existingItem.quantity += 1;
            } else {
                this.showNotification('لا يمكن إضافة كمية أكبر من المتوفر', 'warning');
                return;
            }
        } else {
            this.currentInvoice.items.push({
                productId: productId,
                name: product.name,
                price: product.sellingPrice,
                quantity: 1,
                unit: product.unit,
                total: product.sellingPrice
            });
        }

        this.updateInvoiceDisplay();
        this.clearProductSearch();
        this.hideSearchResults();
    }

    removeProductFromInvoice(productId) {
        this.currentInvoice.items = this.currentInvoice.items.filter(item => item.productId !== productId);
        this.updateInvoiceDisplay();
    }

    updateItemQuantity(productId, newQuantity) {
        const product = this.products.find(p => p.id === productId);
        const item = this.currentInvoice.items.find(item => item.productId === productId);
        
        if (!product || !item) return;

        if (newQuantity <= 0) {
            this.removeProductFromInvoice(productId);
            return;
        }

        if (newQuantity > product.currentQuantity) {
            this.showNotification('لا يمكن تجاوز الكمية المتوفرة', 'warning');
            return;
        }

        item.quantity = newQuantity;
        item.total = item.price * newQuantity;
        this.updateInvoiceDisplay();
    }

    updateInvoiceDisplay() {
        const itemsList = document.getElementById('itemsList');
        const emptyInvoice = document.getElementById('emptyInvoice');
        const invoiceSummary = document.getElementById('invoiceSummary');
        const invoiceActions = document.getElementById('invoiceActions');

        if (this.currentInvoice.items.length === 0) {
            if (itemsList) itemsList.innerHTML = '';
            if (emptyInvoice) emptyInvoice.style.display = 'flex';
            if (invoiceSummary) invoiceSummary.style.display = 'none';
            if (invoiceActions) invoiceActions.style.display = 'none';
            return;
        }

        if (emptyInvoice) emptyInvoice.style.display = 'none';
        if (invoiceSummary) invoiceSummary.style.display = 'block';
        if (invoiceActions) invoiceActions.style.display = 'flex';

        if (itemsList) {
            itemsList.innerHTML = this.currentInvoice.items.map(item => `
                <div class="invoice-item">
                    <div class="item-name">${item.name}</div>
                    <div class="item-price">${this.formatNumber(item.price)} ر.ي</div>
                    <div class="item-quantity">
                        <button class="quantity-btn" onclick="salesManager.updateItemQuantity('${item.productId}', ${item.quantity - 1})">
                            <i data-lucide="minus"></i>
                        </button>
                        <input type="number" class="quantity-input" value="${item.quantity}" 
                               onchange="salesManager.updateItemQuantity('${item.productId}', parseInt(this.value) || 0)">
                        <button class="quantity-btn" onclick="salesManager.updateItemQuantity('${item.productId}', ${item.quantity + 1})">
                            <i data-lucide="plus"></i>
                        </button>
                    </div>
                    <div class="item-total">${this.formatNumber(item.total)} ر.ي</div>
                    <div class="item-actions">
                        <button class="remove-item-btn" onclick="salesManager.removeProductFromInvoice('${item.productId}')">
                            <i data-lucide="x"></i>
                        </button>
                    </div>
                </div>
            `).join('');
        }

        // Update summary
        const subtotal = this.currentInvoice.items.reduce((sum, item) => sum + item.total, 0);
        this.currentInvoice.total = subtotal;

        const subtotalElement = document.getElementById('subtotal');
        const totalElement = document.getElementById('total');
        
        if (subtotalElement) subtotalElement.textContent = this.formatNumber(subtotal) + ' ر.ي';
        if (totalElement) totalElement.textContent = this.formatNumber(subtotal) + ' ر.ي';

        // Re-initialize Lucide icons
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }

    clearProductSearch() {
        const searchInput = document.getElementById('productSearch');
        if (searchInput) {
            searchInput.value = '';
        }
    }

    clearInvoice() {
        this.currentInvoice = {
            items: [],
            customer: '',
            total: 0
        };
        
        const customerInput = document.getElementById('customerName');
        if (customerInput) customerInput.value = '';
        
        this.clearProductSearch();
        this.updateInvoiceDisplay();
    }

    completeInvoice() {
        if (this.currentInvoice.items.length === 0) {
            this.showNotification('لا يمكن إتمام فاتورة فارغة', 'warning');
            return;
        }

        // Create sale record
        const sale = {
            id: Date.now().toString(),
            customer: this.currentInvoice.customer || 'عميل مجهول',
            items: [...this.currentInvoice.items],
            total: this.currentInvoice.total,
            date: new Date().toISOString(),
            itemsCount: this.currentInvoice.items.reduce((sum, item) => sum + item.quantity, 0)
        };

        this.sales.unshift(sale); // Add to beginning of array
        this.saveSales();

        // Update product quantities
        this.currentInvoice.items.forEach(item => {
            const product = this.products.find(p => p.id === item.productId);
            if (product) {
                product.currentQuantity -= item.quantity;
            }
        });
        localStorage.setItem('groceryProducts', JSON.stringify(this.products));

        this.showNotification(`تم إتمام البيع بنجاح - المبلغ: ${this.formatNumber(sale.total)} ر.ي`, 'success');
        
        this.clearInvoice();
        this.updateStats();
        this.renderRecentSales();
    }

    updateStats() {
        const today = new Date().toDateString();
        const todaySales = this.sales.filter(sale => 
            new Date(sale.date).toDateString() === today
        );

        const todayTotal = todaySales.reduce((sum, sale) => sum + sale.total, 0);
        const todayCount = todaySales.length;
        const averageInvoice = todayCount > 0 ? todayTotal / todayCount : 0;

        const todaySalesElement = document.getElementById('todaySales');
        const invoiceCountElement = document.getElementById('invoiceCount');
        const averageInvoiceElement = document.getElementById('averageInvoice');

        if (todaySalesElement) {
            todaySalesElement.textContent = this.formatNumber(todayTotal) + ' ر.ي';
        }
        if (invoiceCountElement) {
            invoiceCountElement.textContent = todayCount.toString();
        }
        if (averageInvoiceElement) {
            averageInvoiceElement.textContent = this.formatNumber(Math.round(averageInvoice)) + ' ر.ي';
        }
    }

    renderRecentSales() {
        const salesList = document.getElementById('salesList');
        if (!salesList) return;

        if (this.sales.length === 0) {
            salesList.innerHTML = `
                <div class="no-sales">
                    <i data-lucide="receipt"></i>
                    <h3>لا توجد مبيعات بعد</h3>
                    <p>ابدأ بإنشاء فواتير جديدة</p>
                </div>
            `;
            return;
        }

        const recentSales = this.sales.slice(0, 10); // Show last 10 sales
        
        salesList.innerHTML = recentSales.map(sale => `
            <div class="sale-item">
                <div class="sale-info">
                    <div class="sale-id">فاتورة #${sale.id.substr(-6)}</div>
                    <div class="sale-customer">${sale.customer}</div>
                    <div class="sale-time">${this.formatDateTime(sale.date)}</div>
                </div>
                <div class="sale-amount">
                    ${this.formatNumber(sale.total)} ر.ي
                    <div class="sale-items-count">${sale.itemsCount} عنصر</div>
                </div>
            </div>
        `).join('');

        // Re-initialize Lucide icons
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }

    getCategoryName(category) {
        const categories = {
            'grocery': 'بقالة',
            'dairy': 'منتجات الألبان',
            'meat': 'اللحوم',
            'vegetables': 'خضروات'
        };
        return categories[category] || category;
    }

    formatNumber(number) {
        return new Intl.NumberFormat('ar-YE').format(number);
    }

    formatDateTime(dateString) {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return 'اليوم ' + date.toLocaleTimeString('ar-YE', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'أمس ' + date.toLocaleTimeString('ar-YE', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
        } else {
            return date.toLocaleDateString('ar-YE') + ' ' + 
                   date.toLocaleTimeString('ar-YE', { 
                       hour: '2-digit', 
                       minute: '2-digit' 
                   });
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type}`;
        notification.textContent = message;
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.zIndex = '9999';
        notification.style.minWidth = '300px';
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Global functions for onclick handlers
window.clearInvoice = () => {
    if (window.salesManager) {
        window.salesManager.clearInvoice();
    }
};

window.completeInvoice = () => {
    if (window.salesManager) {
        window.salesManager.completeInvoice();
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.salesManager = new SalesManager();
});
