
export interface Unit {
  id: string;
  name: string;
  hasCustomQuantity: boolean; // تخصيص حسب المنتج
  baseQuantity?: number; // الكمية الأساسية (مثل: كرتون = 24 علبة)
  baseUnit?: string; // الوحدة الأساسية (مثل: علبة)
  createdAt: Date;
}

export type Currency = 'SAR' | 'YER';

export type ProfitType = 'percentage' | 'fixed';

export interface Product {
  id: string;
  name: string;
  purchasePrice: number; // سعر الشراء
  purchaseCurrency: Currency; // عملة الشراء
  profitType: ProfitType; // نوع هامش الربح
  profitValue: number; // قيمة هامش الربح (نسبة أو مبلغ ثابت)
  profitCurrency?: Currency; // عملة هامش الربح (للمبلغ الثابت)
  currentSellingPrice: number; // سعر البيع الحالي بالريال اليمني
  unit: string; // الوحدة القياسية
  currentQuantity: number; // الكمية الحالية
  minimumQuantity: number; // الحد الأدنى
  expiryDate?: Date; // تاريخ انتهاء الصلاحية
  isLowStock: boolean; // تحديد المنتجات الناقصة
  category?: string;
  description?: string;
  shortcutNumber?: number; // رقم الاختصار للبحث السريع
  createdAt: Date;
  updatedAt: Date;
  // إبقاء الحقول القديمة للتوافق مع البيانات الموجودة
  originalPurchasePriceSAR?: number;
  profitMargin?: number;
}

export interface ProductShortcut {
  id: string;
  productId: string;
  productName: string;
  shortcutNumber: number;
  createdAt: Date;
}

export interface ExchangeRate {
  id: string;
  rate: number; // 1 ريال سعودي = X ريال يمني
  date: Date;
  createdBy?: string;
}

export interface PriceUpdateLog {
  id: string;
  productId: string;
  oldPrice: number;
  newPrice: number;
  exchangeRateId: string;
  date: Date;
}

export interface ShortageItem {
  id: string;
  productId: string;
  productName: string;
  currentQuantity: number;
  minimumQuantity: number;
  requestedQuantity: number;
  unit: string;
  addedManually: boolean;
  createdAt: Date;
}

export interface SaleTransactionItem {
  productId: string;
  productName: string;
  quantity: number;
  unit: string;
}

export interface SaleTransaction {
  id: string;
  items: SaleTransactionItem[];
  date: Date;
  notes?: string;
}

export interface PurchaseTransactionItem {
  productId: string;
  productName: string;
  quantity: number;
  unit: string;
}

export interface PurchaseTransaction {
  id: string;
  items: PurchaseTransactionItem[];
  date: Date;
  supplier?: string;
  notes?: string;
}
