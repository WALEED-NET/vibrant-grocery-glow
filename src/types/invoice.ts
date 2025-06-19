
export interface InvoiceItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Invoice {
  id: string;
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  total: number;
  customerId?: string;
  customerName?: string;
  createdAt: Date;
  status: 'draft' | 'completed' | 'cancelled';
}

export interface Customer {
  id: string;
  name: string;
  phone?: string;
  loyaltyPoints: number;
  totalPurchases: number;
  createdAt: Date;
}
