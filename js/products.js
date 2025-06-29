// Products Page JavaScript functionality

class ProductsManager {
    constructor() {
        this.products = [];
        this.filteredProducts = [];
        this.currentView = 'grid';
        this.searchTerm = '';
        this.isVoiceSearching = false;
        this.currentExchangeRate = 680; // 1 SAR = 680 YER
        this.editingProduct = null;
        this.recognition = null;
        
        this.init();
    }

    init() {
        this.loadSampleData();
        this.setupEventListeners();
        this.setupVoiceRecognition();
        this.renderProducts();
        this.updateProductsCount();
        this.loadViewPreference();
    }

    loadViewPreference() {
        const savedView = localStorage.getItem('productViewMode');
        if (savedView && ['grid', 'list'].includes(savedView)) {
            this.switchView(savedView);
        }
    }

    saveViewPreference() {
        localStorage.setItem('productViewMode', this.currentView);
    }

    setupEventListeners() {
        // View toggle
        document.querySelectorAll('.toggle-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchView(e.target.closest('.toggle-btn').dataset.view);
            });
        });

        // Search functionality
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
        }

        // Voice search
        const voiceSearchBtn = document.getElementById('voiceSearchBtn');
        if (voiceSearchBtn) {
            voiceSearchBtn.addEventListener('click', () => {
                this.toggleVoiceSearch();
            });
        }

        // Product form
        const productForm = document.getElementById('productForm');
        if (productForm) {
            productForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleProductSubmit();
            });
        }

        // Price calculation
        const purchasePriceInput = document.getElementById('purchasePrice');
        const profitMarginInput = document.getElementById('profitMargin');
        
        if (purchasePriceInput && profitMarginInput) {
            [purchasePriceInput, profitMarginInput].forEach(input => {
                input.addEventListener('input', () => {
                    this.calculateSellingPrice();
                });
            });
        }

        // Modal close on overlay click
        const modalOverlay = document.getElementById('productModal');
        if (modalOverlay) {
            modalOverlay.addEventListener('click', (e) => {
                if (e.target === modalOverlay) {
                    this.closeProductModal();
                }
            });
        }

        // Sidebar toggle for mobile
        const sidebarToggle = document.getElementById('sidebarToggle');
        const sidebar = document.getElementById('sidebar');
        if (sidebarToggle && sidebar) {
            sidebarToggle.addEventListener('click', () => {
                sidebar.classList.toggle('open');
            });
        }

        // More menu modal for mobile
        const moreMenuBtn = document.getElementById('moreMenuBtn');
        const moreMenuModal = document.getElementById('moreMenuModal');
        if (moreMenuBtn && moreMenuModal) {
            moreMenuBtn.addEventListener('click', () => {
                moreMenuModal.classList.add('active');
            });

            moreMenuModal.addEventListener('click', (e) => {
                if (e.target === moreMenuModal) {
                    moreMenuModal.classList.remove('active');
                }
            });
        }
    }

    setupVoiceRecognition() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = 'ar-SA';

            this.recognition.onstart = () => {
                this.isVoiceSearching = true;
                this.updateVoiceSearchButton();
            };

            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                document.getElementById('searchInput').value = transcript;
                this.handleSearch(transcript);
            };

            this.recognition.onend = () => {
                this.isVoiceSearching = false;
                this.updateVoiceSearchButton();
            };

            this.recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                this.isVoiceSearching = false;
                this.updateVoiceSearchButton();
            };
        }
    }

    loadSampleData() {
        this.products = [
            {
                id: '1',
                name: 'سكر أبيض',
                category: 'مواد غذائية',
                unit: 'كيلو',
                purchasePriceSAR: 8.5,
                profitMarginYER: 500,
                sellingPriceYER: (8.5 * this.currentExchangeRate) + 500,
                currentQuantity: 50,
                minimumQuantity: 10,
                shortcutNumber: 1,
                description: 'سكر أبيض نقي عالي الجودة',
                expiryDate: null,
                isLowStock: false,
                isExpiringSoon: false
            },
            {
                id: '2',
                name: 'أرز بسمتي',
                category: 'مواد غذائية',
                unit: 'كيلو',
                purchasePriceSAR: 12.0,
                profitMarginYER: 800,
                sellingPriceYER: (12.0 * this.currentExchangeRate) + 800,
                currentQuantity: 30,
                minimumQuantity: 15,
                shortcutNumber: 2,
                description: 'أرز بسمتي هندي فاخر',
                expiryDate: null,
                isLowStock: false,
                isExpiringSoon: false
            },
            {
                id: '3',
                name: 'زيت دوار الشمس',
                category: 'مواد غذائية',
                unit: 'لتر',
                purchasePriceSAR: 15.5,
                profitMarginYER: 1000,
                sellingPriceYER: (15.5 * this.currentExchangeRate) + 1000,
                currentQuantity: 25,
                minimumQuantity: 8,
                shortcutNumber: 3,
                description: 'زيت دوار الشمس للطبخ',
                expiryDate: null,
                isLowStock: false,
                isExpiringSoon: false
            },
            {
                id: '4',
                name: 'شاي أحمر',
                category: 'مشروبات',
                unit: 'علبة',
                purchasePriceSAR: 18.0,
                profitMarginYER: 1200,
                sellingPriceYER: (18.0 * this.currentExchangeRate) + 1200,
                currentQuantity: 5,
                minimumQuantity: 10,
                shortcutNumber: 5,
                description: 'شاي أحمر سيلاني فاخر',
                expiryDate: null,
                isLowStock: true,
                isExpiringSoon: false
            },
            {
                id: '5',
                name: 'تونة معلبة',
                category: 'معلبات',
                unit: 'علبة',
                purchasePriceSAR: 8.0,
                profitMarginYER: 600,
                sellingPriceYER: (8.0 * this.currentExchangeRate) + 600,
                currentQuantity: 8,
                minimumQuantity: 20,
                shortcutNumber: 10,
                description: 'تونة في الزيت عالية الجودة',
                expiryDate: '2024-08-15',
                isLowStock: true,
                isExpiringSoon: true
            },
            {
                id: '6',
                name: 'عسل طبيعي',
                category: 'مواد غذائية',
                unit: 'كيلو',
                purchasePriceSAR: 35.0,
                profitMarginYER: 2000,
                sellingPriceYER: (35.0 * this.currentExchangeRate) + 2000,
                currentQuantity: 10,
                minimumQuantity: 5,
                shortcutNumber: 14,
                description: 'عسل طبيعي جبلي أصلي',
                expiryDate: '2025-12-31',
                isLowStock: false,
                isExpiringSoon: false
            },
            {
                id: '7',
                name: 'دقيق أبيض',
                category: 'مواد غذائية',
                unit: 'كيلو',
                purchasePriceSAR: 6.0,
                profitMarginYER: 400,
                sellingPriceYER: (6.0 * this.currentExchangeRate) + 400,
                currentQuantity: 40,
                minimumQuantity: 20,
                shortcutNumber: 4,
                description: 'دقيق أبيض للخبز والطبخ',
                expiryDate: null,
                isLowStock: false,
                isExpiringSoon: false
            },
            {
                id: '8',
                name: 'قهوة عربية',
                category: 'مشروبات',
                unit: 'علبة',
                purchasePriceSAR: 25.0,
                profitMarginYER: 1500,
                sellingPriceYER: (25.0 * this.currentExchangeRate) + 1500,
                currentQuantity: 15,
                minimumQuantity: 8,
                shortcutNumber: 6,
                description: 'قهوة عربية أصيلة محمصة',
                expiryDate: null,
                isLowStock: false,
                isExpiringSoon: false
            }
        ];

        this.filteredProducts = [...this.products];
    }

    switchView(view) {
        this.currentView = view;
        this.saveViewPreference();
        
        // Update toggle buttons
        document.querySelectorAll('.toggle-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === view);
        });

        // Update view containers
        const gridView = document.getElementById('gridView');
        const listView = document.getElementById('listView');
        
        if (view === 'grid') {
            gridView.classList.add('active');
            listView.classList.remove('active');
        } else {
            gridView.classList.remove('active');
            listView.classList.add('active');
        }

        this.renderProducts();
    }

    handleSearch(searchTerm) {
        this.searchTerm = searchTerm.trim();
        this.filterProducts();
        this.renderProducts();
        this.updateProductsCount();
    }

    filterProducts() {
        if (!this.searchTerm) {
            this.filteredProducts = [...this.products];
            return;
        }

        // Check if search term is a number (shortcut search)
        const isNumber = /^\d+$/.test(this.searchTerm);
        
        if (isNumber) {
            const shortcutNum = parseInt(this.searchTerm);
            this.filteredProducts = this.products.filter(product => 
                product.shortcutNumber === shortcutNum
            );
        } else {
            // Text search
            const lowerSearchTerm = this.searchTerm.toLowerCase();
            this.filteredProducts = this.products.filter(product =>
                product.name.toLowerCase().includes(lowerSearchTerm) ||
                (product.category && product.category.toLowerCase().includes(lowerSearchTerm))
            );
        }
    }

    toggleVoiceSearch() {
        if (!this.recognition) {
            alert('البحث الصوتي غير مدعوم في هذا المتصفح');
            return;
        }

        if (this.isVoiceSearching) {
            this.recognition.stop();
        } else {
            this.recognition.start();
        }
    }

    updateVoiceSearchButton() {
        const voiceBtn = document.getElementById('voiceSearchBtn');
        if (voiceBtn) {
            if (this.isVoiceSearching) {
                voiceBtn.classList.add('recording');
                voiceBtn.innerHTML = '<i data-lucide="mic-off"></i><span>إيقاف</span>';
            } else {
                voiceBtn.classList.remove('recording');
                voiceBtn.innerHTML = '<i data-lucide="mic"></i><span>بحث صوتي</span>';
            }
            // Re-initialize lucide icons
            if (window.lucide) {
                window.lucide.createIcons();
            }
        }
    }

    renderProducts() {
        const gridView = document.getElementById('gridView');
        const listView = document.getElementById('listView');
        const emptyState = document.getElementById('emptyState');

        if (this.filteredProducts.length === 0) {
            gridView.innerHTML = '';
            listView.innerHTML = '';
            emptyState.classList.remove('hidden');
            return;
        }

        emptyState.classList.add('hidden');

        if (this.currentView === 'grid') {
            gridView.innerHTML = this.filteredProducts.map(product => this.createProductCard(product)).join('');
            listView.innerHTML = '';
        } else {
            listView.innerHTML = this.filteredProducts.map(product => this.createProductRow(product)).join('');
            gridView.innerHTML = '';
        }

        // Re-initialize lucide icons
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }

    createProductCard(product) {
        const profitPercentage = ((product.sellingPriceYER - (product.purchasePriceSAR * this.currentExchangeRate)) / (product.purchasePriceSAR * this.currentExchangeRate) * 100).toFixed(1);
        const cardClasses = ['product-card'];
        
        if (product.isLowStock) cardClasses.push('low-stock');
        if (product.isExpiringSoon) cardClasses.push('expiring-soon');

        return `
            <div class="${cardClasses.join(' ')}">
                <div class="product-header">
                    <div class="product-title-row">
                        <h3 class="product-name">${product.name}</h3>
                        <div class="product-menu">
                            <button class="menu-btn" onclick="productsManager.showProductMenu('${product.id}', event)">
                                <i data-lucide="more-vertical"></i>
                            </button>
                        </div>
                    </div>
                    <div class="product-badges">
                        ${product.category ? `<span class="badge badge-category">${product.category}</span>` : ''}
                        ${product.isLowStock ? `<span class="badge badge-low-stock"><i data-lucide="alert-triangle"></i>كمية ناقصة</span>` : ''}
                        ${product.isExpiringSoon ? `<span class="badge badge-expiring"><i data-lucide="calendar"></i>ينتهي قريباً</span>` : ''}
                        ${product.shortcutNumber ? `<span class="badge badge-shortcut"><i data-lucide="hash"></i>${product.shortcutNumber}</span>` : ''}
                    </div>
                </div>
                <div class="product-info">
                    <div class="info-grid">
                        <div class="info-item quantity">
                            <div class="info-label">
                                <i data-lucide="package"></i>
                                <span>الكمية</span>
                            </div>
                            <div class="info-value ${product.isLowStock ? 'low-stock' : ''}">${product.currentQuantity}</div>
                            <div class="info-unit">${product.unit}</div>
                        </div>
                        <div class="info-item purchase-price">
                            <div class="info-label">سعر الشراء</div>
                            <div class="price-breakdown">
                                <div class="price-primary">${product.purchasePriceSAR.toFixed(2)} ر.س</div>
                                <div class="price-secondary">${(product.purchasePriceSAR * this.currentExchangeRate).toLocaleString()} ر.ي</div>
                            </div>
                        </div>
                        <div class="info-item selling-price">
                            <div class="info-label">سعر البيع</div>
                            <div class="price-breakdown">
                                <div class="price-primary">${(product.sellingPriceYER / this.currentExchangeRate).toFixed(2)} ر.س</div>
                                <div class="price-secondary">${product.sellingPriceYER.toLocaleString()} ر.ي</div>
                            </div>
                        </div>
                        <div class="info-item profit">
                            <div class="info-label">هامش الربح</div>
                            <div class="info-value ${profitPercentage > 0 ? 'profit-positive' : 'profit-negative'}">
                                <i data-lucide="${profitPercentage > 0 ? 'trending-up' : 'trending-down'}"></i>
                                ${profitPercentage}%
                            </div>
                        </div>
                    </div>
                    ${product.description ? `<div class="product-description">${product.description}</div>` : ''}
                </div>
            </div>
        `;
    }

    createProductRow(product) {
        const profitPercentage = ((product.sellingPriceYER - (product.purchasePriceSAR * this.currentExchangeRate)) / (product.purchasePriceSAR * this.currentExchangeRate) * 100).toFixed(1);

        return `
            <div class="product-row">
                <div class="row-name">
                    <div class="product-name">${product.name}</div>
                    <div class="product-badges">
                        ${product.category ? `<span class="badge badge-category">${product.category}</span>` : ''}
                        ${product.isLowStock ? `<span class="badge badge-low-stock">ناقص</span>` : ''}
                        ${product.isExpiringSoon ? `<span class="badge badge-expiring">ينتهي قريباً</span>` : ''}
                        ${product.shortcutNumber ? `<span class="badge badge-shortcut">#${product.shortcutNumber}</span>` : ''}
                    </div>
                </div>
                <div class="row-quantity">
                    <div class="info-value ${product.isLowStock ? 'low-stock' : ''}">${product.currentQuantity} ${product.unit}</div>
                </div>
                <div class="row-prices">
                    <div class="price-primary">${product.purchasePriceSAR.toFixed(2)} ر.س</div>
                    <div class="price-secondary">${(product.purchasePriceSAR * this.currentExchangeRate).toLocaleString()} ر.ي</div>
                </div>
                <div class="row-prices">
                    <div class="price-primary">${(product.sellingPriceYER / this.currentExchangeRate).toFixed(2)} ر.س</div>
                    <div class="price-secondary">${product.sellingPriceYER.toLocaleString()} ر.ي</div>
                </div>
                <div class="row-actions">
                    <button class="action-btn" onclick="productsManager.editProduct('${product.id}')" title="تعديل">
                        <i data-lucide="edit"></i>
                    </button>
                    <button class="action-btn delete" onclick="productsManager.deleteProduct('${product.id}')" title="حذف">
                        <i data-lucide="trash-2"></i>
                    </button>
                </div>
            </div>
        `;
    }

    showProductMenu(productId, event) {
        // Simple implementation - could be enhanced with a proper dropdown
        const product = this.products.find(p => p.id === productId);
        if (product) {
            const action = confirm(`إدارة المنتج: ${product.name}\n\nاختر:\nموافق = تعديل\nإلغاء = حذف`);
            if (action) {
                this.editProduct(productId);
            } else {
                this.deleteProduct(productId);
            }
        }
    }

    editProduct(productId) {
        const product = this.products.find(p => p.id === productId);
        if (product) {
            this.editingProduct = product;
            this.populateForm(product);
            this.openProductModal();
        }
    }

    deleteProduct(productId) {
        const product = this.products.find(p => p.id === productId);
        if (product && confirm(`هل أنت متأكد من حذف المنتج "${product.name}"؟`)) {
            this.products = this.products.filter(p => p.id !== productId);
            this.filterProducts();
            this.renderProducts();
            this.updateProductsCount();
        }
    }

    populateForm(product) {
        document.getElementById('modalTitle').textContent = 'تعديل المنتج';
        document.getElementById('productName').value = product.name;
        document.getElementById('productCategory').value = product.category || '';
        document.getElementById('productUnit').value = product.unit;
        document.getElementById('shortcutNumber').value = product.shortcutNumber || '';
        document.getElementById('purchasePrice').value = product.purchasePriceSAR;
        document.getElementById('profitMargin').value = product.profitMarginYER;
        document.getElementById('currentQuantity').value = product.currentQuantity;
        document.getElementById('minimumQuantity').value = product.minimumQuantity;
        document.getElementById('description').value = product.description || '';
        
        if (product.expiryDate) {
            document.getElementById('expiryDate').value = product.expiryDate;
        }

        this.calculateSellingPrice();
    }

    clearForm() {
        document.getElementById('modalTitle').textContent = 'إضافة منتج جديد';
        document.getElementById('productForm').reset();
        document.getElementById('calculatedPrice').textContent = '0';
    }

    calculateSellingPrice() {
        const purchasePrice = parseFloat(document.getElementById('purchasePrice').value) || 0;
        const profitMargin = parseFloat(document.getElementById('profitMargin').value) || 0;
        
        const sellingPrice = (purchasePrice * this.currentExchangeRate) + profitMargin;
        document.getElementById('calculatedPrice').textContent = sellingPrice.toLocaleString();
    }

    handleProductSubmit() {
        const formData = new FormData(document.getElementById('productForm'));
        const productData = {
            name: formData.get('productName'),
            category: formData.get('productCategory'),
            unit: formData.get('productUnit'),
            shortcutNumber: formData.get('shortcutNumber') ? parseInt(formData.get('shortcutNumber')) : null,
            purchasePriceSAR: parseFloat(formData.get('purchasePrice')),
            profitMarginYER: parseFloat(formData.get('profitMargin')),
            currentQuantity: parseInt(formData.get('currentQuantity')) || 0,
            minimumQuantity: parseInt(formData.get('minimumQuantity')) || 0,
            description: formData.get('description'),
            expiryDate: formData.get('expiryDate') || null
        };

        // Validation
        if (!productData.name || !productData.unit || !productData.purchasePriceSAR || !productData.profitMarginYER) {
            alert('يرجى ملء جميع الحقول المطلوبة');
            return;
        }

        // Check for duplicate shortcut number
        if (productData.shortcutNumber) {
            const existingProduct = this.products.find(p => 
                p.shortcutNumber === productData.shortcutNumber && 
                (!this.editingProduct || p.id !== this.editingProduct.id)
            );
            if (existingProduct) {
                alert(`رقم الاختصار ${productData.shortcutNumber} مستخدم بالفعل للمنتج "${existingProduct.name}"`);
                return;
            }
        }

        productData.sellingPriceYER = (productData.purchasePriceSAR * this.currentExchangeRate) + productData.profitMarginYER;
        productData.isLowStock = productData.currentQuantity <= productData.minimumQuantity;
        productData.isExpiringSoon = productData.expiryDate ? this.checkIfExpiringSoon(productData.expiryDate) : false;

        if (this.editingProduct) {
            // Update existing product
            const index = this.products.findIndex(p => p.id === this.editingProduct.id);
            if (index !== -1) {
                this.products[index] = { ...this.editingProduct, ...productData };
            }
        } else {
            // Add new product
            productData.id = Date.now().toString();
            this.products.push(productData);
        }

        this.filterProducts();
        this.renderProducts();
        this.updateProductsCount();
        this.closeProductModal();
    }

    checkIfExpiringSoon(expiryDate) {
        if (!expiryDate) return false;
        const expiry = new Date(expiryDate);
        const today = new Date();
        const diffTime = expiry - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 7 && diffDays >= 0;
    }

    openProductModal() {
        document.getElementById('productModal').classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeProductModal() {
        document.getElementById('productModal').classList.remove('active');
        document.body.style.overflow = '';
        this.editingProduct = null;
        this.clearForm();
    }

    updateProductsCount() {
        const countElement = document.getElementById('productsCount');
        if (countElement) {
            countElement.textContent = this.filteredProducts.length;
        }
    }
}

// Global functions for HTML onclick handlers
function openProductModal() {
    productsManager.openProductModal();
}

function closeProductModal() {
    productsManager.closeProductModal();
}

function handleSalesRedirect() {
    alert('سيتم توجيهك إلى صفحة المبيعات');
    // In a real app, this would navigate to the sales page
}

function handlePurchaseRedirect() {
    alert('سيتم توجيهك إلى صفحة المشتريات');
    // In a real app, this would navigate to the purchase page
}

// Initialize the products manager when the page loads
let productsManager;

document.addEventListener('DOMContentLoaded', function() {
    productsManager = new ProductsManager();
    
    // Initialize lucide icons
    if (window.lucide) {
        window.lucide.createIcons();
    }
});

// Handle window resize for responsive behavior
window.addEventListener('resize', function() {
    // Close mobile menu on resize to desktop
    if (window.innerWidth >= 768) {
        const sidebar = document.getElementById('sidebar');
        const moreMenuModal = document.getElementById('moreMenuModal');
        
        if (sidebar) sidebar.classList.remove('open');
        if (moreMenuModal) moreMenuModal.classList.remove('active');
    }
});