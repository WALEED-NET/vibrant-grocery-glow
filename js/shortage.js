
// Shortage Page JavaScript

class ShortageManager {
    constructor() {
        this.products = this.loadProducts();
        this.shortageItems = [];
        this.shoppingList = [];
        this.exchangeRate = 680; // This should come from global state
        this.init();
    }

    init() {
        this.updateShortageItems();
        this.setupEventListeners();
        this.updateStats();
        this.renderShortageItems();
    }

    setupEventListeners() {
        // Sort filter
        const sortFilter = document.getElementById('sortFilter');
        if (sortFilter) {
            sortFilter.addEventListener('change', () => {
                this.renderShortageItems();
            });
        }

        // Generate shopping list button
        const generateBtn = document.getElementById('generateShoppingListBtn');
        if (generateBtn) {
            generateBtn.addEventListener('click', () => {
                this.generateShoppingList();
            });
        }
    }

    loadProducts() {
        const saved = localStorage.getItem('groceryProducts');
        return saved ? JSON.parse(saved) : [];
    }

    updateShortageItems() {
        this.shortageItems = this.products.filter(product => {
            return product.currentQuantity <= product.minimumQuantity;
        }).map(product => ({
            ...product,
            urgency: this.calculateUrgency(product),
            suggestedQuantity: this.calculateSuggestedQuantity(product),
            estimatedCost: this.calculateEstimatedCost(product)
        }));
    }

    calculateUrgency(product) {
        if (product.currentQuantity === 0) return 'critical';
        if (product.currentQuantity <= product.minimumQuantity * 0.5) return 'high';
        return 'medium';
    }

    calculateSuggestedQuantity(product) {
        // Suggest quantity to reach 2x minimum quantity
        const targetQuantity = product.minimumQuantity * 2;
        return Math.max(targetQuantity - product.currentQuantity, product.minimumQuantity);
    }

    calculateEstimatedCost(product) {
        const suggestedQuantity = this.calculateSuggestedQuantity(product);
        return suggestedQuantity * product.purchasePrice;
    }

    updateStats() {
        const outOfStock = this.shortageItems.filter(item => item.currentQuantity === 0).length;
        const lowStock = this.shortageItems.filter(item => item.currentQuantity > 0).length;
        const total = this.shortageItems.length;

        const outOfStockElement = document.getElementById('outOfStockCount');
        const lowStockElement = document.getElementById('lowStockCount');
        const totalElement = document.getElementById('totalShortageCount');

        if (outOfStockElement) outOfStockElement.textContent = outOfStock;
        if (lowStockElement) lowStockElement.textContent = lowStock;
        if (totalElement) totalElement.textContent = total;

        // Update page title
        const titleElement = document.getElementById('pageTitle');
        if (titleElement) {
            titleElement.textContent = `سلة النواقص (${total})`;
        }
    }

    renderShortageItems() {
        const shortageList = document.getElementById('shortageList');
        const emptyShortage = document.getElementById('emptyShortage');
        
        if (!shortageList) return;

        if (this.shortageItems.length === 0) {
            shortageList.style.display = 'none';
            if (emptyShortage) emptyShortage.style.display = 'flex';
            return;
        }

        shortageList.style.display = 'flex';
        if (emptyShortage) emptyShortage.style.display = 'none';

        const sortedItems = this.getSortedItems();
        
        shortageList.innerHTML = sortedItems.map(item => this.createShortageItemHTML(item)).join('');

        // Re-initialize Lucide icons
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }

    getSortedItems() {
        const sortFilter = document.getElementById('sortFilter')?.value || 'urgency';
        const items = [...this.shortageItems];

        switch (sortFilter) {
            case 'urgency':
                return items.sort((a, b) => {
                    const urgencyOrder = { critical: 3, high: 2, medium: 1 };
                    return urgencyOrder[b.urgency] - urgencyOrder[a.urgency];
                });
            case 'name':
                return items.sort((a, b) => a.name.localeCompare(b.name, 'ar'));
            case 'category':
                return items.sort((a, b) => a.category.localeCompare(b.category));
            default:
                return items;
        }
    }

    createShortageItemHTML(item) {
        const statusClass = item.currentQuantity === 0 ? 'critical' : 'warning';
        const statusIcon = item.currentQuantity === 0 ? 'x-circle' : 'alert-triangle';

        return `
            <div class="shortage-item ${statusClass}" data-product-id="${item.id}">
                <div class="item-info">
                    <div class="item-status ${statusClass}">
                        <i data-lucide="${statusIcon}"></i>
                    </div>
                    <div class="item-details">
                        <div class="item-name">${item.name}</div>
                        <div class="item-category">${this.getCategoryName(item.category)}</div>
                        <div class="item-stock-info">
                            <div class="stock-detail">
                                <div class="stock-label">الكمية الحالية</div>
                                <div class="stock-value ${statusClass}">${item.currentQuantity} ${item.unit}</div>
                            </div>
                            <div class="stock-detail">
                                <div class="stock-label">الحد الأدنى</div>
                                <div class="stock-value">${item.minimumQuantity} ${item.unit}</div>
                            </div>
                            <div class="stock-detail">
                                <div class="stock-label">سعر الشراء</div>
                                <div class="stock-value">${item.purchasePrice} ر.س</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="item-actions">
                    <div class="suggested-quantity">
                        <div class="stock-label">الكمية المقترحة</div>
                        <div class="suggested-value">${item.suggestedQuantity} ${item.unit}</div>
                    </div>
                    <div class="estimated-cost">
                        التكلفة المقدرة: ${this.formatNumber(item.estimatedCost)} ر.س
                    </div>
                </div>
            </div>
        `;
    }

    generateShoppingList() {
        if (this.shortageItems.length === 0) {
            this.showNotification('لا توجد نواقص لإنشاء قائمة تسوق', 'warning');
            return;
        }

        this.shoppingList = this.shortageItems.map(item => ({
            id: item.id,
            name: item.name,
            category: item.category,
            quantity: item.suggestedQuantity,
            unit: item.unit,
            cost: item.estimatedCost,
            urgency: item.urgency
        }));

        this.renderShoppingList();
        this.showShoppingListSection();
        this.showNotification('تم إنشاء قائمة التسوق بنجاح', 'success');
    }

    renderShoppingList() {
        const shoppingItems = document.getElementById('shoppingItems');
        const itemsCountElement = document.getElementById('shoppingItemsCount');
        const estimatedCostElement = document.getElementById('estimatedCost');

        if (!shoppingItems) return;

        const totalCost = this.shoppingList.reduce((sum, item) => sum + item.cost, 0);
        const totalItems = this.shoppingList.length;

        if (itemsCountElement) itemsCountElement.textContent = totalItems;
        if (estimatedCostElement) estimatedCostElement.textContent = this.formatNumber(totalCost) + ' ر.س';

        shoppingItems.innerHTML = this.shoppingList.map(item => `
            <div class="shopping-item">
                <div class="shopping-item-info">
                    <div class="shopping-item-name">${item.name}</div>
                    <div class="shopping-item-quantity">${item.quantity} ${item.unit}</div>
                </div>
                <div class="shopping-item-cost">${this.formatNumber(item.cost)} ر.س</div>
            </div>
        `).join('');
    }

    showShoppingListSection() {
        const section = document.getElementById('shoppingListSection');
        if (section) {
            section.style.display = 'block';
            section.scrollIntoView({ behavior: 'smooth' });
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
        return new Intl.NumberFormat('ar-YE').format(Math.round(number));
    }

    printShoppingList() {
        if (this.shoppingList.length === 0) {
            this.showNotification('لا توجد قائمة تسوق للطباعة', 'warning');
            return;
        }

        const printContent = `
            <!DOCTYPE html>
            <html dir="rtl">
            <head>
                <title>قائمة التسوق - البقالة الذكية</title>
                <style>
                    body { font-family: 'Cairo', Arial, sans-serif; direction: rtl; padding: 20px; }
                    .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
                    .summary { display: flex; justify-content: space-between; margin-bottom: 30px; }
                    .items { list-style: none; padding: 0; }
                    .item { display: flex; justify-content: space-between; padding: 10px; border-bottom: 1px solid #eee; }
                    .item:nth-child(odd) { background: #f9f9f9; }
                    .total { font-weight: bold; font-size: 18px; text-align: right; margin-top: 20px; }
                    .footer { margin-top: 40px; text-align: center; color: #666; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>قائمة التسوق</h1>
                    <p>البقالة الذكية - ${new Date().toLocaleDateString('ar-YE')}</p>
                </div>
                <div class="summary">
                    <div>عدد المنتجات: ${this.shoppingList.length}</div>
                    <div>التكلفة المقدرة: ${this.formatNumber(this.shoppingList.reduce((sum, item) => sum + item.cost, 0))} ر.س</div>
                </div>
                <ul class="items">
                    ${this.shoppingList.map(item => `
                        <li class="item">
                            <span>${item.name} - ${item.quantity} ${item.unit}</span>
                            <span>${this.formatNumber(item.cost)} ر.س</span>
                        </li>
                    `).join('')}
                </ul>
                <div class="total">
                    الإجمالي: ${this.formatNumber(this.shoppingList.reduce((sum, item) => sum + item.cost, 0))} ر.س
                </div>
                <div class="footer">
                    <p>تم إنشاء هذه القائمة بواسطة نظام البقالة الذكية</p>
                </div>
            </body>
            </html>
        `;

        const printWindow = window.open('', '_blank');
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.print();
        printWindow.close();
    }

    shareShoppingList() {
        if (this.shoppingList.length === 0) {
            this.showNotification('لا توجد قائمة تسوق للمشاركة', 'warning');
            return;
        }

        const shareText = `قائمة التسوق - البقالة الذكية\n\n` +
            this.shoppingList.map(item => `• ${item.name} - ${item.quantity} ${item.unit} (${this.formatNumber(item.cost)} ر.س)`).join('\n') +
            `\n\nالإجمالي: ${this.formatNumber(this.shoppingList.reduce((sum, item) => sum + item.cost, 0))} ر.س`;

        if (navigator.share) {
            navigator.share({
                title: 'قائمة التسوق - البقالة الذكية',
                text: shareText
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(shareText).then(() => {
                this.showNotification('تم نسخ قائمة التسوق للحافظة', 'success');
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
window.printShoppingList = () => {
    if (window.shortageManager) {
        window.shortageManager.printShoppingList();
    }
};

window.shareShoppingList = () => {
    if (window.shortageManager) {
        window.shortageManager.shareShoppingList();
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.shortageManager = new ShortageManager();
});
