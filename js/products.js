
// Products Page JavaScript

class ProductsManager {
    constructor() {
        this.products = this.loadProducts();
        this.currentEditingId = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderProducts();
        this.updatePageTitle();
    }

    setupEventListeners() {
        // Add product button
        document.getElementById('addProductBtn')?.addEventListener('click', () => {
            this.openAddProductModal();
        });

        // Search functionality
        document.getElementById('productSearch')?.addEventListener('input', (e) => {
            this.filterProducts();
        });

        // Filter functionality
        document.getElementById('categoryFilter')?.addEventListener('change', () => {
            this.filterProducts();
        });

        document.getElementById('stockFilter')?.addEventListener('change', () => {
            this.filterProducts();
        });

        // Product form submission
        document.getElementById('productForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveProduct();
        });

        // Modal close events
        document.addEventListener('click', (e) => {
            if (e.target.id === 'productModal') {
                this.closeProductModal();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeProductModal();
            }
        });
    }

    loadProducts() {
        const saved = localStorage.getItem('groceryProducts');
        if (saved) {
            return JSON.parse(saved);
        }
        
        // Default sample products
        return [
            {
                id: '1',
                name: 'سكر أبيض',
                category: 'grocery',
                purchasePrice: 9.25,
                sellingPrice: 6280,
                currentQuantity: 25,
                minimumQuantity: 5,
                unit: 'كيلو',
                createdAt: new Date().toISOString()
            },
            {
                id: '2',
                name: 'أرز بسمتي',
                category: 'grocery',
                purchasePrice: 13.18,
                sellingPrice: 8960,
                currentQuantity: 2,
                minimumQuantity: 10,
                unit: 'كيلو',
                createdAt: new Date().toISOString()
            },
            {
                id: '3',
                name: 'زيت دوار الشمس',
                category: 'grocery',
                purchasePrice: 16.97,
                sellingPrice: 11540,
                currentQuantity: 0,
                minimumQuantity: 3,
                unit: 'علبة',
                createdAt: new Date().toISOString()
            }
        ];
    }

    saveProducts() {
        localStorage.setItem('groceryProducts', JSON.stringify(this.products));
    }

    updatePageTitle() {
        const titleElement = document.getElementById('pageTitle');
        if (titleElement) {
            titleElement.textContent = `إدارة المنتجات (${this.products.length})`;
        }
    }

    renderProducts() {
        const container = document.getElementById('productsGrid');
        const emptyState = document.getElementById('emptyState');
        
        if (!container) return;

        const filteredProducts = this.getFilteredProducts();

        if (filteredProducts.length === 0) {
            container.style.display = 'none';
            if (emptyState) emptyState.style.display = 'block';
            return;
        }

        container.style.display = 'grid';
        if (emptyState) emptyState.style.display = 'none';

        container.innerHTML = filteredProducts.map(product => this.createProductCard(product)).join('');
        
        // Re-initialize Lucide icons
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }

    createProductCard(product) {
        const stockStatus = this.getStockStatus(product);
        const exchangeRate = 680; // This should come from global state

        return `
            <div class="product-card ${stockStatus.class}" data-product-id="${product.id}">
                <div class="product-header">
                    <div>
                        <div class="product-name">${product.name}</div>
                        <div class="product-category">${this.getCategoryName(product.category)}</div>
                    </div>
                    <div class="product-actions">
                        <button class="action-btn" onclick="productsManager.editProduct('${product.id}')" title="تعديل">
                            <i data-lucide="edit"></i>
                        </button>
                        <button class="action-btn delete" onclick="productsManager.deleteProduct('${product.id}')" title="حذف">
                            <i data-lucide="trash"></i>
                        </button>
                    </div>
                </div>
                
                <div class="product-details">
                    <div class="detail-item">
                        <div class="detail-label">سعر الشراء</div>
                        <div class="detail-value">${product.purchasePrice} ر.س</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">سعر البيع</div>
                        <div class="detail-value price">${this.formatNumber(product.sellingPrice)} ر.ي</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">الكمية الحالية</div>
                        <div class="detail-value ${stockStatus.valueClass}">${product.currentQuantity} ${product.unit}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">الحد الأدنى</div>
                        <div class="detail-value">${product.minimumQuantity} ${product.unit}</div>
                    </div>
                </div>
                
                <div class="product-footer">
                    <div class="stock-status">
                        <div class="stock-indicator ${stockStatus.class}"></div>
                        <span>${stockStatus.text}</span>
                    </div>
                    <div class="detail-value">
                        ربح: ${this.formatNumber(product.sellingPrice - (product.purchasePrice * exchangeRate))} ر.ي
                    </div>
                </div>
            </div>
        `;
    }

    getStockStatus(product) {
        if (product.currentQuantity === 0) {
            return {
                class: 'out-of-stock',
                valueClass: 'critical',
                text: 'نفد المخزون'
            };
        } else if (product.currentQuantity <= product.minimumQuantity) {
            return {
                class: 'low-stock',
                valueClass: 'low',
                text: 'مخزون منخفض'
            };
        } else {
            return {
                class: 'in-stock',
                valueClass: '',
                text: 'متوفر'
            };
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

    getFilteredProducts() {
        const searchTerm = document.getElementById('productSearch')?.value.toLowerCase() || '';
        const categoryFilter = document.getElementById('categoryFilter')?.value || '';
        const stockFilter = document.getElementById('stockFilter')?.value || '';

        return this.products.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchTerm);
            const matchesCategory = !categoryFilter || product.category === categoryFilter;
            
            let matchesStock = true;
            if (stockFilter) {
                const stockStatus = this.getStockStatus(product);
                matchesStock = stockStatus.class === stockFilter.replace('-', '-');
            }

            return matchesSearch && matchesCategory && matchesStock;
        });
    }

    filterProducts() {
        this.renderProducts();
    }

    openAddProductModal() {
        this.currentEditingId = null;
        document.getElementById('modalTitle').textContent = 'إضافة منتج جديد';
        this.clearForm();
        this.showModal();
    }

    editProduct(id) {
        const product = this.products.find(p => p.id === id);
        if (!product) return;

        this.currentEditingId = id;
        document.getElementById('modalTitle').textContent = 'تعديل المنتج';
        this.populateForm(product);
        this.showModal();
    }

    deleteProduct(id) {
        if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
            this.products = this.products.filter(p => p.id !== id);
            this.saveProducts();
            this.renderProducts();
            this.updatePageTitle();
            this.showNotification('تم حذف المنتج بنجاح', 'success');
        }
    }

    populateForm(product) {
        document.getElementById('productName').value = product.name;
        document.getElementById('productCategory').value = product.category;
        document.getElementById('purchasePrice').value = product.purchasePrice;
        document.getElementById('sellingPrice').value = product.sellingPrice;
        document.getElementById('currentQuantity').value = product.currentQuantity;
        document.getElementById('minimumQuantity').value = product.minimumQuantity;
        document.getElementById('productUnit').value = product.unit;
    }

    clearForm() {
        document.getElementById('productForm').reset();
    }

    saveProduct() {
        const formData = {
            name: document.getElementById('productName').value,
            category: document.getElementById('productCategory').value,
            purchasePrice: parseFloat(document.getElementById('purchasePrice').value),
            sellingPrice: parseFloat(document.getElementById('sellingPrice').value),
            currentQuantity: parseFloat(document.getElementById('currentQuantity').value),
            minimumQuantity: parseFloat(document.getElementById('minimumQuantity').value),
            unit: document.getElementById('productUnit').value
        };

        // Validation
        if (!formData.name || !formData.category || !formData.unit) {
            this.showNotification('يرجى ملء جميع الحقول المطلوبة', 'error');
            return;
        }

        if (this.currentEditingId) {
            // Update existing product
            const index = this.products.findIndex(p => p.id === this.currentEditingId);
            if (index !== -1) {
                this.products[index] = {
                    ...this.products[index],
                    ...formData,
                    updatedAt: new Date().toISOString()
                };
                this.showNotification('تم تحديث المنتج بنجاح', 'success');
            }
        } else {
            // Add new product
            const newProduct = {
                id: Date.now().toString(),
                ...formData,
                createdAt: new Date().toISOString()
            };
            this.products.push(newProduct);
            this.showNotification('تم إضافة المنتج بنجاح', 'success');
        }

        this.saveProducts();
        this.renderProducts();
        this.updatePageTitle();
        this.closeProductModal();
    }

    showModal() {
        document.getElementById('productModal').classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    closeProductModal() {
        document.getElementById('productModal').classList.remove('show');
        document.body.style.overflow = '';
        this.currentEditingId = null;
    }

    formatNumber(number) {
        return new Intl.NumberFormat('ar-YE').format(number);
    }

    showNotification(message, type = 'info') {
        // This should integrate with the main notification system
        console.log(`${type}: ${message}`);
        
        // Simple notification implementation
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
window.openAddProductModal = () => {
    if (window.productsManager) {
        window.productsManager.openAddProductModal();
    }
};

window.closeProductModal = () => {
    if (window.productsManager) {
        window.productsManager.closeProductModal();
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.productsManager = new ProductsManager();
});
