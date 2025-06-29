// Products page specific JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize products page functionality
    initializeProductsPage();
});

function initializeProductsPage() {
    // Initialize view toggle
    initializeViewToggle();
    
    // Initialize search functionality
    initializeSearch();
    
    // Initialize voice search
    initializeVoiceSearch();
    
    // Initialize product modal
    initializeProductModal();
    
    // Initialize form calculations
    initializeFormCalculations();
}

function initializeViewToggle() {
    const toggleBtns = document.querySelectorAll('.toggle-btn');
    const gridView = document.getElementById('gridView');
    const listView = document.getElementById('listView');
    
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const viewType = this.dataset.view;
            
            // Update button states
            toggleBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Update view display
            if (viewType === 'grid') {
                if (gridView) {
                    gridView.classList.add('active');
                    gridView.style.display = 'grid';
                }
                if (listView) {
                    listView.classList.remove('active');
                    listView.style.display = 'none';
                }
            } else {
                if (listView) {
                    listView.classList.add('active');
                    listView.style.display = 'block';
                }
                if (gridView) {
                    gridView.classList.remove('active');
                    gridView.style.display = 'none';
                }
            }
        });
    });
}

function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    
    if (searchInput) {
        // Debounced search function
        const debouncedSearch = window.SmartShopUtils?.debounce(function(query) {
            performSearch(query);
        }, 300);
        
        searchInput.addEventListener('input', function() {
            const query = this.value.trim();
            debouncedSearch(query);
        });
    }
}

function performSearch(query) {
    // This would be handled by Blazor component
    // Just trigger a custom event that Blazor can listen to
    const event = new CustomEvent('searchProducts', {
        detail: { query: query }
    });
    document.dispatchEvent(event);
}

function initializeVoiceSearch() {
    const voiceSearchBtn = document.getElementById('voiceSearchBtn');
    
    if (voiceSearchBtn && 'webkitSpeechRecognition' in window) {
        const recognition = new webkitSpeechRecognition();
        recognition.lang = 'ar-SA';
        recognition.continuous = false;
        recognition.interimResults = false;
        
        voiceSearchBtn.addEventListener('click', function() {
            if (this.classList.contains('recording')) {
                recognition.stop();
                this.classList.remove('recording');
            } else {
                recognition.start();
                this.classList.add('recording');
            }
        });
        
        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.value = transcript;
                performSearch(transcript);
            }
            voiceSearchBtn.classList.remove('recording');
        };
        
        recognition.onerror = function(event) {
            console.error('Speech recognition error:', event.error);
            voiceSearchBtn.classList.remove('recording');
        };
        
        recognition.onend = function() {
            voiceSearchBtn.classList.remove('recording');
        };
    } else {
        // Hide voice search button if not supported
        if (voiceSearchBtn) {
            voiceSearchBtn.style.display = 'none';
        }
    }
}

function initializeProductModal() {
    const modal = document.getElementById('productModal');
    const closeBtn = document.querySelector('.modal-close');
    
    if (modal) {
        // Close modal when clicking outside
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeProductModal();
            }
        });
        
        // Close modal with close button
        if (closeBtn) {
            closeBtn.addEventListener('click', closeProductModal);
        }
        
        // Close modal with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeProductModal();
            }
        });
    }
}

function openProductModal() {
    const modal = document.getElementById('productModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Focus on first input
        const firstInput = modal.querySelector('input[type="text"]');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }
    }
}

function closeProductModal() {
    const modal = document.getElementById('productModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function initializeFormCalculations() {
    const purchasePriceInput = document.getElementById('purchasePrice');
    const profitMarginInput = document.getElementById('profitMargin');
    const calculatedPriceDisplay = document.getElementById('calculatedPrice');
    
    function calculateSellingPrice() {
        const purchasePrice = parseFloat(purchasePriceInput?.value || 0);
        const profitMargin = parseFloat(profitMarginInput?.value || 0);
        
        if (purchasePrice > 0 && profitMargin > 0) {
            const sellingPrice = (purchasePrice * 680) + profitMargin;
            if (calculatedPriceDisplay) {
                calculatedPriceDisplay.textContent = sellingPrice.toLocaleString('ar-YE');
            }
        } else {
            if (calculatedPriceDisplay) {
                calculatedPriceDisplay.textContent = '0';
            }
        }
    }
    
    if (purchasePriceInput) {
        purchasePriceInput.addEventListener('input', calculateSellingPrice);
    }
    
    if (profitMarginInput) {
        profitMarginInput.addEventListener('input', calculateSellingPrice);
    }
}

// Global functions for Blazor interop
window.ProductsPageUtils = {
    openModal: openProductModal,
    closeModal: closeProductModal,
    
    calculateSellingPrice: function(purchasePrice, profitMargin, exchangeRate = 680) {
        return (purchasePrice * exchangeRate) + profitMargin;
    },
    
    formatPrice: function(price, currency = 'YER') {
        return new Intl.NumberFormat('ar-YE', {
            style: 'decimal',
            minimumFractionDigits: currency === 'SAR' ? 2 : 0,
            maximumFractionDigits: currency === 'SAR' ? 2 : 0
        }).format(price) + (currency === 'YER' ? ' ر.ي' : ' ر.س');
    },
    
    showNotification: function(message, type = 'success') {
        // Create a simple notification
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#198754' : type === 'error' ? '#dc3545' : '#0dcaf0'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            font-size: 14px;
            font-weight: 500;
            max-width: 300px;
            word-wrap: break-word;
            animation: slideInRight 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
};

// Add CSS for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
`;
document.head.appendChild(style);