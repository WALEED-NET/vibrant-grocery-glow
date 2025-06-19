import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, ExchangeRate, PriceUpdateLog, Unit, ShortageItem, SaleTransaction, PurchaseTransaction, SaleTransactionItem, PurchaseTransactionItem } from '@/types';

interface GroceryStore {
  products: Product[];
  exchangeRates: ExchangeRate[];
  priceUpdateLogs: PriceUpdateLog[];
  units: Unit[];
  shortageItems: ShortageItem[];
  salesTransactions: SaleTransaction[];
  purchaseTransactions: PurchaseTransaction[];
  currentExchangeRate: number;
  
  // Product actions
  addProduct: (product: Omit<Product, 'id' | 'currentSellingPrice' | 'isLowStock' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateProductQuantity: (id: string, quantity: number) => void;
  
  // Exchange rate actions
  updateExchangeRate: (rate: number) => void;
  
  // Units actions
  addUnit: (name: string, hasCustomQuantity?: boolean, baseQuantity?: number, baseUnit?: string) => void;
  updateUnit: (id: string, updates: Partial<Unit>) => void;
  deleteUnit: (id: string) => boolean;
  
  // Shortage actions
  addToShortage: (productId: string, requestedQuantity?: number, manual?: boolean) => void;
  removeFromShortage: (shortageId: string) => void;
  markAsSupplied: (shortageId: string, newQuantity: number) => void;
  
  // Sales actions
  processSale: (items: SaleTransactionItem[], notes?: string) => void;
  
  // Purchase actions
  processPurchase: (items: PurchaseTransactionItem[], supplier?: string, notes?: string) => void;
  
  // Shortcuts actions
  getProductByShortcut: (shortcutNumber: number) => Product | undefined;
  
  // Utility functions
  calculateSellingPrice: (productData: any) => number;
  updateAllPrices: (newRate: number) => void;
  checkLowStock: () => void;
  getLowStockProducts: () => Product[];
  clearOldData: () => void;
  initializeTestData: () => void;
}

const createTestProducts = (currentExchangeRate: number): Product[] => [
  {
    id: 'test-1',
    name: 'سكر أبيض',
    originalPurchasePriceSAR: 8.5,
    profitMargin: 500,
    currentSellingPrice: (8.5 * currentExchangeRate) + 500,
    unit: 'كيلو',
    currentQuantity: 50,
    minimumQuantity: 10,
    isLowStock: false,
    category: 'مواد غذائية',
    description: 'سكر أبيض نقي عالي الجودة',
    shortcutNumber: 1,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    purchasePrice: 8.5,
    purchaseCurrency: 'SAR',
    profitType: 'fixed',
    profitValue: 500,
  },
  {
    id: 'test-2',
    name: 'أرز بسمتي',
    originalPurchasePriceSAR: 12.0,
    profitMargin: 800,
    currentSellingPrice: (12.0 * currentExchangeRate) + 800,
    unit: 'كيلو',
    currentQuantity: 30,
    minimumQuantity: 15,
    isLowStock: false,
    category: 'مواد غذائية',
    description: 'أرز بسمتي هندي فاخر',
    shortcutNumber: 2,
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
    purchasePrice: 12.0,
    purchaseCurrency: 'SAR',
    profitType: 'fixed',
    profitValue: 800,
  },
  {
    id: 'test-3',
    name: 'زيت دوار الشمس',
    originalPurchasePriceSAR: 15.5,
    profitMargin: 1000,
    currentSellingPrice: (15.5 * currentExchangeRate) + 1000,
    unit: 'لتر',
    currentQuantity: 25,
    minimumQuantity: 8,
    isLowStock: false,
    category: 'مواد غذائية',
    description: 'زيت دوار الشمس للطبخ',
    shortcutNumber: 3,
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-03'),
    purchasePrice: 15.5,
    purchaseCurrency: 'SAR',
    profitType: 'fixed',
    profitValue: 1000,
  },
  {
    id: 'test-4',
    name: 'دقيق أبيض',
    originalPurchasePriceSAR: 6.0,
    profitMargin: 400,
    currentSellingPrice: (6.0 * currentExchangeRate) + 400,
    unit: 'كيلو',
    currentQuantity: 40,
    minimumQuantity: 20,
    isLowStock: false,
    category: 'مواد غذائية',
    description: 'دقيق أبيض للخبز والطبخ',
    shortcutNumber: 4,
    createdAt: new Date('2024-01-04'),
    updatedAt: new Date('2024-01-04'),
    purchasePrice: 6.0,
    purchaseCurrency: 'SAR',
    profitType: 'fixed',
    profitValue: 400,
  },
  {
    id: 'test-5',
    name: 'شاي أحمر',
    originalPurchasePriceSAR: 18.0,
    profitMargin: 1200,
    currentSellingPrice: (18.0 * currentExchangeRate) + 1200,
    unit: 'علبة',
    currentQuantity: 5,
    minimumQuantity: 10,
    isLowStock: true,
    category: 'مشروبات',
    description: 'شاي أحمر سيلاني فاخر',
    shortcutNumber: 5,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05'),
    purchasePrice: 18.0,
    purchaseCurrency: 'SAR',
    profitType: 'fixed',
    profitValue: 1200,
  },
  {
    id: 'test-6',
    name: 'قهوة عربية',
    originalPurchasePriceSAR: 25.0,
    profitMargin: 1500,
    currentSellingPrice: (25.0 * currentExchangeRate) + 1500,
    unit: 'علبة',
    currentQuantity: 15,
    minimumQuantity: 8,
    isLowStock: false,
    category: 'مشروبات',
    description: 'قهوة عربية أصيلة محمصة',
    shortcutNumber: 6,
    createdAt: new Date('2024-01-06'),
    updatedAt: new Date('2024-01-06'),
    purchasePrice: 25.0,
    purchaseCurrency: 'SAR',
    profitType: 'fixed',
    profitValue: 1500,
  },
  {
    id: 'test-7',
    name: 'حليب مجفف',
    originalPurchasePriceSAR: 22.0,
    profitMargin: 1300,
    currentSellingPrice: (22.0 * currentExchangeRate) + 1300,
    unit: 'علبة',
    currentQuantity: 20,
    minimumQuantity: 12,
    isLowStock: false,
    category: 'ألبان',
    description: 'حليب مجفف كامل الدسم',
    shortcutNumber: 7,
    createdAt: new Date('2024-01-07'),
    updatedAt: new Date('2024-01-07'),
    purchasePrice: 22.0,
    purchaseCurrency: 'SAR',
    profitType: 'fixed',
    profitValue: 1300,
  },
  {
    id: 'test-8',
    name: 'معكرونة اسباجيتي',
    originalPurchasePriceSAR: 4.5,
    profitMargin: 300,
    currentSellingPrice: (4.5 * currentExchangeRate) + 300,
    unit: 'علبة',
    currentQuantity: 60,
    minimumQuantity: 25,
    isLowStock: false,
    category: 'مواد غذائية',
    description: 'معكرونة اسباجيتي إيطالي',
    shortcutNumber: 8,
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-08'),
    purchasePrice: 4.5,
    purchaseCurrency: 'SAR',
    profitType: 'fixed',
    profitValue: 300,
  },
  {
    id: 'test-9',
    name: 'صلصة طماطم',
    originalPurchasePriceSAR: 3.0,
    profitMargin: 200,
    currentSellingPrice: (3.0 * currentExchangeRate) + 200,
    unit: 'علبة',
    currentQuantity: 35,
    minimumQuantity: 15,
    isLowStock: false,
    category: 'معلبات',
    description: 'صلصة طماطم مركزة',
    shortcutNumber: 9,
    createdAt: new Date('2024-01-09'),
    updatedAt: new Date('2024-01-09'),
    purchasePrice: 3.0,
    purchaseCurrency: 'SAR',
    profitType: 'fixed',
    profitValue: 200,
  },
  {
    id: 'test-10',
    name: 'تونة معلبة',
    originalPurchasePriceSAR: 8.0,
    profitMargin: 600,
    currentSellingPrice: (8.0 * currentExchangeRate) + 600,
    unit: 'علبة',
    currentQuantity: 8,
    minimumQuantity: 20,
    isLowStock: true,
    category: 'معلبات',
    description: 'تونة في الزيت عالية الجودة',
    shortcutNumber: 10,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
    purchasePrice: 8.0,
    purchaseCurrency: 'SAR',
    profitType: 'fixed',
    profitValue: 600,
  },
  {
    id: 'test-11',
    name: 'صابون غسيل',
    originalPurchasePriceSAR: 12.0,
    profitMargin: 800,
    currentSellingPrice: (12.0 * currentExchangeRate) + 800,
    unit: 'حبة',
    currentQuantity: 25,
    minimumQuantity: 10,
    isLowStock: false,
    category: 'منظفات',
    description: 'صابون غسيل للملابس',
    shortcutNumber: 11,
    createdAt: new Date('2024-01-11'),
    updatedAt: new Date('2024-01-11'),
    purchasePrice: 12.0,
    purchaseCurrency: 'SAR',
    profitType: 'fixed',
    profitValue: 800,
  },
  {
    id: 'test-12',
    name: 'شامبو للشعر',
    originalPurchasePriceSAR: 18.5,
    profitMargin: 1100,
    currentSellingPrice: (18.5 * currentExchangeRate) + 1100,
    unit: 'حبة',
    currentQuantity: 12,
    minimumQuantity: 8,
    isLowStock: false,
    category: 'عناية شخصية',
    description: 'شامبو للشعر الجاف والدهني',
    shortcutNumber: 12,
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12'),
    purchasePrice: 18.5,
    purchaseCurrency: 'SAR',
    profitType: 'fixed',
    profitValue: 1100,
  },
  {
    id: 'test-13',
    name: 'فول مدمس',
    originalPurchasePriceSAR: 5.5,
    profitMargin: 400,
    currentSellingPrice: (5.5 * currentExchangeRate) + 400,
    unit: 'علبة',
    currentQuantity: 30,
    minimumQuantity: 15,
    isLowStock: false,
    category: 'معلبات',
    description: 'فول مدمس جاهز للأكل',
    shortcutNumber: 13,
    createdAt: new Date('2024-01-13'),
    updatedAt: new Date('2024-01-13'),
    purchasePrice: 5.5,
    purchaseCurrency: 'SAR',
    profitType: 'fixed',
    profitValue: 400,
  },
  {
    id: 'test-14',
    name: 'عسل طبيعي',
    originalPurchasePriceSAR: 35.0,
    profitMargin: 2000,
    currentSellingPrice: (35.0 * currentExchangeRate) + 2000,
    unit: 'كيلو',
    currentQuantity: 10,
    minimumQuantity: 5,
    isLowStock: false,
    category: 'مواد غذائية',
    description: 'عسل طبيعي جبلي أصلي',
    shortcutNumber: 14,
    expiryDate: new Date('2025-12-31'),
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-14'),
    purchasePrice: 35.0,
    purchaseCurrency: 'SAR',
    profitType: 'fixed',
    profitValue: 2000,
  },
  {
    id: 'test-15',
    name: 'بسكويت شاي',
    originalPurchasePriceSAR: 4.0,
    profitMargin: 250,
    currentSellingPrice: (4.0 * currentExchangeRate) + 250,
    unit: 'علبة',
    currentQuantity: 45,
    minimumQuantity: 20,
    isLowStock: false,
    category: 'حلويات',
    description: 'بسكويت للشاي بالسمسم',
    shortcutNumber: 15,
    expiryDate: new Date('2024-08-15'),
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    purchasePrice: 4.0,
    purchaseCurrency: 'SAR',
    profitType: 'fixed',
    profitValue: 250,
  },
  {
    id: 'test-16',
    name: 'ملح طعام',
    originalPurchasePriceSAR: 2.0,
    profitMargin: 150,
    currentSellingPrice: (2.0 * currentExchangeRate) + 150,
    unit: 'كيلو',
    currentQuantity: 80,
    minimumQuantity: 30,
    isLowStock: false,
    category: 'مواد غذائية',
    description: 'ملح طعام مكرر ونقي',
    shortcutNumber: 16,
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-16'),
    purchasePrice: 2.0,
    purchaseCurrency: 'SAR',
    profitType: 'fixed',
    profitValue: 150,
  },
  {
    id: 'test-17',
    name: 'مناديل ورقية',
    originalPurchasePriceSAR: 8.0,
    profitMargin: 500,
    currentSellingPrice: (8.0 * currentExchangeRate) + 500,
    unit: 'علبة',
    currentQuantity: 3,
    minimumQuantity: 12,
    isLowStock: true,
    category: 'مناديل',
    description: 'مناديل ورقية ناعمة',
    shortcutNumber: 17,
    createdAt: new Date('2024-01-17'),
    updatedAt: new Date('2024-01-17'),
    purchasePrice: 8.0,
    purchaseCurrency: 'SAR',
    profitType: 'fixed',
    profitValue: 500,
  },
  {
    id: 'test-18',
    name: 'خل أبيض',
    originalPurchasePriceSAR: 4.5,
    profitMargin: 300,
    currentSellingPrice: (4.5 * currentExchangeRate) + 300,
    unit: 'لتر',
    currentQuantity: 22,
    minimumQuantity: 10,
    isLowStock: false,
    category: 'مواد غذائية',
    description: 'خل أبيض للطبخ والسلطات',
    shortcutNumber: 18,
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18'),
    purchasePrice: 4.5,
    purchaseCurrency: 'SAR',
    profitType: 'fixed',
    profitValue: 300,
  },
  {
    id: 'test-19',
    name: 'مسحوق غسيل',
    originalPurchasePriceSAR: 16.0,
    profitMargin: 1000,
    currentSellingPrice: (16.0 * currentExchangeRate) + 1000,
    unit: 'كيلو',
    currentQuantity: 18,
    minimumQuantity: 12,
    isLowStock: false,
    category: 'منظفات',
    description: 'مسحوق غسيل للغسالات',
    shortcutNumber: 19,
    createdAt: new Date('2024-01-19'),
    updatedAt: new Date('2024-01-19'),
    purchasePrice: 16.0,
    purchaseCurrency: 'SAR',
    profitType: 'fixed',
    profitValue: 1000,
  },
  {
    id: 'test-20',
    name: 'جبن أبيض',
    originalPurchasePriceSAR: 20.0,
    profitMargin: 1200,
    currentSellingPrice: (20.0 * currentExchangeRate) + 1200,
    unit: 'كيلو',
    currentQuantity: 6,
    minimumQuantity: 8,
    isLowStock: true,
    category: 'ألبان',
    description: 'جبن أبيض طازج للفطار',
    shortcutNumber: 20,
    expiryDate: new Date('2024-07-30'),
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
    purchasePrice: 20.0,
    purchaseCurrency: 'SAR',
    profitType: 'fixed',
    profitValue: 1200,
  },
];

export const useGroceryStore = create<GroceryStore>()(
  persist(
    (set, get) => ({
      products: [],
      exchangeRates: [
        {
          id: '1',
          rate: 680, // 1 ريال سعودي = 680 ريال يمني
          date: new Date(),
        }
      ],
      priceUpdateLogs: [],
      units: [
        { id: '1', name: 'كيلو', hasCustomQuantity: false, createdAt: new Date() },
        { id: '2', name: 'جرام', hasCustomQuantity: false, createdAt: new Date() },
        { id: '3', name: 'لتر', hasCustomQuantity: false, createdAt: new Date() },
        { id: '4', name: 'ملليلتر', hasCustomQuantity: false, createdAt: new Date() },
        { id: '5', name: 'علبة', hasCustomQuantity: false, createdAt: new Date() },
        { id: '6', name: 'حبة', hasCustomQuantity: false, createdAt: new Date() },
        { id: '7', name: 'كرتون', hasCustomQuantity: true, baseQuantity: 24, baseUnit: 'علبة', createdAt: new Date() },
        { id: '8', name: 'كيس', hasCustomQuantity: false, createdAt: new Date() },
      ],
      shortageItems: [],
      salesTransactions: [],
      purchaseTransactions: [],
      currentExchangeRate: 680,

      initializeTestData: () => {
        const { currentExchangeRate } = get();
        const testProducts = createTestProducts(currentExchangeRate);
        
        set((state) => ({
          products: [...testProducts, ...state.products.filter(p => !p.id.startsWith('test-'))],
        }));

        // Add low stock items to shortage list
        testProducts.forEach(product => {
          if (product.isLowStock) {
            get().addToShortage(product.id);
          }
        });
      },

      addProduct: (productData) => {
        const newProduct: Product = {
          ...productData,
          id: crypto.randomUUID(),
          currentSellingPrice: get().calculateSellingPrice(productData),
          isLowStock: productData.currentQuantity <= productData.minimumQuantity,
          createdAt: new Date(),
          updatedAt: new Date(),
          originalPurchasePriceSAR: productData.purchasePrice,
          profitMargin: productData.profitValue,
        };
        
        set((state) => ({
          products: [...state.products, newProduct],
        }));

        if (newProduct.isLowStock) {
          get().addToShortage(newProduct.id);
        }
      },

      updateProduct: (id, updates) => {
        set((state) => ({
          products: state.products.map((product) =>
            product.id === id
              ? {
                  ...product,
                  ...updates,
                  updatedAt: new Date(),
                  currentSellingPrice: updates.purchasePrice || updates.profitValue || updates.profitType
                    ? get().calculateSellingPrice({
                        purchasePrice: updates.purchasePrice ?? product.purchasePrice ?? product.originalPurchasePriceSAR ?? 0,
                        purchaseCurrency: updates.purchaseCurrency ?? product.purchaseCurrency ?? 'SAR',
                        profitType: updates.profitType ?? product.profitType ?? 'percentage',
                        profitValue: updates.profitValue ?? product.profitValue ?? product.profitMargin ?? 0,
                        profitCurrency: updates.profitCurrency ?? product.profitCurrency ?? 'YER',
                      })
                    : product.currentSellingPrice,
                  isLowStock: (updates.currentQuantity ?? product.currentQuantity) <= (updates.minimumQuantity ?? product.minimumQuantity),
                  originalPurchasePriceSAR: updates.purchasePrice ?? product.purchasePrice,
                  profitMargin: updates.profitValue ?? product.profitValue,
                }
              : product
          ),
        }));
        
        get().checkLowStock();
      },

      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter((product) => product.id !== id),
          shortageItems: state.shortageItems.filter((item) => item.productId !== id),
        }));
      },

      updateProductQuantity: (id, quantity) => {
        get().updateProduct(id, { currentQuantity: quantity });
      },

      updateExchangeRate: (rate) => {
        const newExchangeRate: ExchangeRate = {
          id: crypto.randomUUID(),
          rate,
          date: new Date(),
        };

        set((state) => ({
          currentExchangeRate: rate,
          exchangeRates: [...state.exchangeRates, newExchangeRate],
        }));

        get().updateAllPrices(rate);
      },

      addUnit: (name, hasCustomQuantity = false, baseQuantity, baseUnit) => {
        const newUnit: Unit = {
          id: crypto.randomUUID(),
          name,
          hasCustomQuantity,
          baseQuantity,
          baseUnit,
          createdAt: new Date(),
        };
        
        set((state) => ({
          units: [...state.units, newUnit],
        }));
      },

      updateUnit: (id, updates) => {
        set((state) => ({
          units: state.units.map((unit) =>
            unit.id === id ? { ...unit, ...updates } : unit
          ),
        }));
      },

      deleteUnit: (id) => {
        const { products } = get();
        const unit = get().units.find(u => u.id === id);
        const unitInUse = products.some(product => product.unit === unit?.name);
        
        if (unitInUse) {
          return false;
        }
        
        set((state) => ({
          units: state.units.filter((unit) => unit.id !== id),
        }));
        
        return true;
      },

      addToShortage: (productId, requestedQuantity, manual = false) => {
        const { products, shortageItems } = get();
        const product = products.find(p => p.id === productId);
        
        if (!product || shortageItems.some(item => item.productId === productId)) {
          return;
        }

        const newShortageItem: ShortageItem = {
          id: crypto.randomUUID(),
          productId: product.id,
          productName: product.name,
          currentQuantity: product.currentQuantity,
          minimumQuantity: product.minimumQuantity,
          requestedQuantity: requestedQuantity || (product.minimumQuantity * 2),
          unit: product.unit,
          addedManually: manual,
          createdAt: new Date(),
        };

        set((state) => ({
          shortageItems: [...state.shortageItems, newShortageItem],
        }));
      },

      removeFromShortage: (shortageId) => {
        set((state) => ({
          shortageItems: state.shortageItems.filter((item) => item.id !== shortageId),
        }));
      },

      markAsSupplied: (shortageId, newQuantity) => {
        const { shortageItems } = get();
        const shortageItem = shortageItems.find(item => item.id === shortageId);
        
        if (shortageItem) {
          get().updateProductQuantity(shortageItem.productId, newQuantity);
          get().removeFromShortage(shortageId);
        }
      },

      processSale: (items, notes) => {
        const saleTransaction: SaleTransaction = {
          id: crypto.randomUUID(),
          items,
          date: new Date(),
          notes,
        };

        // تحديث كميات المنتجات
        items.forEach(item => {
          const product = get().products.find(p => p.id === item.productId);
          if (product) {
            get().updateProductQuantity(item.productId, product.currentQuantity - item.quantity);
          }
        });

        set((state) => ({
          salesTransactions: [...state.salesTransactions, saleTransaction],
        }));
      },

      processPurchase: (items, supplier, notes) => {
        const purchaseTransaction: PurchaseTransaction = {
          id: crypto.randomUUID(),
          items,
          date: new Date(),
          supplier,
          notes,
        };

        // تحديث كميات المنتجات
        items.forEach(item => {
          const product = get().products.find(p => p.id === item.productId);
          if (product) {
            get().updateProductQuantity(item.productId, product.currentQuantity + item.quantity);
          }
        });

        set((state) => ({
          purchaseTransactions: [...state.purchaseTransactions, purchaseTransaction],
        }));
      },

      getProductByShortcut: (shortcutNumber) => {
        return get().products.find(product => product.shortcutNumber === shortcutNumber);
      },

      calculateSellingPrice: (productData: any) => {
        if (typeof productData === 'number') {
          // التوافق مع الطريقة القديمة
          const { currentExchangeRate } = get();
          return productData * currentExchangeRate;
        }

        const { currentExchangeRate } = get();
        const { purchasePrice, purchaseCurrency, profitType, profitValue, profitCurrency } = productData;
        
        // تحويل سعر الشراء إلى ريال يمني
        let purchasePriceYER = purchasePrice;
        if (purchaseCurrency === 'SAR') {
          purchasePriceYER = purchasePrice * currentExchangeRate;
        }

        // حساب هامش الربح
        let profitYER = profitValue;
        if (profitType === 'percentage') {
          profitYER = (purchasePriceYER * profitValue) / 100;
        } else if (profitCurrency === 'SAR') {
          profitYER = profitValue * currentExchangeRate;
        }

        return purchasePriceYER + profitYER;
      },

      updateAllPrices: (newRate) => {
        const { products } = get();
        const newLogs: PriceUpdateLog[] = [];

        set((state) => ({
          products: state.products.map((product) => {
            const oldPrice = product.currentSellingPrice;
            
            // استخدام البيانات الجديدة إذا كانت متوفرة، وإلا استخدام البيانات القديمة
            const productData = {
              purchasePrice: product.purchasePrice ?? product.originalPurchasePriceSAR ?? 0,
              purchaseCurrency: product.purchaseCurrency ?? 'SAR',
              profitType: product.profitType ?? 'percentage',
              profitValue: product.profitValue ?? product.profitMargin ?? 0,
              profitCurrency: product.profitCurrency ?? 'YER',
            };

            const newPrice = get().calculateSellingPrice(productData);
            
            newLogs.push({
              id: crypto.randomUUID(),
              productId: product.id,
              oldPrice,
              newPrice,
              exchangeRateId: state.exchangeRates[state.exchangeRates.length - 1]?.id || '',
              date: new Date(),
            });

            return {
              ...product,
              currentSellingPrice: newPrice,
              updatedAt: new Date(),
            };
          }),
          priceUpdateLogs: [...state.priceUpdateLogs, ...newLogs],
        }));
      },

      checkLowStock: () => {
        const { products } = get();
        
        products.forEach(product => {
          if (product.isLowStock && !get().shortageItems.some(item => item.productId === product.id)) {
            get().addToShortage(product.id);
          }
        });
      },

      getLowStockProducts: () => {
        return get().products.filter(product => product.isLowStock);
      },

      clearOldData: () => {
        set({
          products: [],
          exchangeRates: [
            {
              id: '1',
              rate: 680,
              date: new Date(),
            }
          ],
          priceUpdateLogs: [],
          shortageItems: [],
          salesTransactions: [],
          purchaseTransactions: [],
          currentExchangeRate: 680,
        });
      },
    }),
    {
      name: 'grocery-store',
      version: 4, // زيادة رقم الإصدار للتوافق مع التحديثات
      onRehydrateStorage: () => (state) => {
        // تهيئة البيانات التجريبية عند تحميل التطبيق
        if (state && state.products.length === 0) {
          state.initializeTestData();
        }
      },
    }
  )
);
