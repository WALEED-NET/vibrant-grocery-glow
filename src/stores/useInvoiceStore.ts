
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Invoice, InvoiceItem, Customer } from '@/types/invoice';
import { Product } from '@/types';

interface InvoiceStore {
  // Current invoice being created
  currentInvoice: Invoice | null;
  invoices: Invoice[];
  customers: Customer[];
  
  // Invoice actions
  createInvoice: () => void;
  addItemToInvoice: (product: Product, quantity: number) => void;
  removeItemFromInvoice: (itemId: string) => void;
  updateItemQuantity: (itemId: string, quantity: number) => void;
  applyDiscount: (discount: number) => void;
  completeInvoice: (customerId?: string) => void;
  cancelInvoice: () => void;
  
  // Customer actions
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt'>) => void;
  updateCustomerPoints: (customerId: string, points: number) => void;
  
  // Utility functions
  calculateInvoiceTotal: () => void;
  findProductByName: (name: string, products: Product[]) => Product | null;
}

export const useInvoiceStore = create<InvoiceStore>()(
  persist(
    (set, get) => ({
      currentInvoice: null,
      invoices: [],
      customers: [],

      createInvoice: () => {
        const newInvoice: Invoice = {
          id: crypto.randomUUID(),
          items: [],
          subtotal: 0,
          discount: 0,
          total: 0,
          createdAt: new Date(),
          status: 'draft',
        };
        set({ currentInvoice: newInvoice });
      },

      addItemToInvoice: (product, quantity) => {
        const { currentInvoice } = get();
        if (!currentInvoice) return;

        const existingItem = currentInvoice.items.find(item => item.productId === product.id);
        
        if (existingItem) {
          get().updateItemQuantity(existingItem.id, existingItem.quantity + quantity);
        } else {
          const newItem: InvoiceItem = {
            id: crypto.randomUUID(),
            productId: product.id,
            productName: product.name,
            quantity,
            unitPrice: product.currentSellingPrice,
            totalPrice: product.currentSellingPrice * quantity,
          };

          set((state) => ({
            currentInvoice: state.currentInvoice ? {
              ...state.currentInvoice,
              items: [...state.currentInvoice.items, newItem],
            } : null,
          }));
        }
        
        get().calculateInvoiceTotal();
      },

      removeItemFromInvoice: (itemId) => {
        set((state) => ({
          currentInvoice: state.currentInvoice ? {
            ...state.currentInvoice,
            items: state.currentInvoice.items.filter(item => item.id !== itemId),
          } : null,
        }));
        get().calculateInvoiceTotal();
      },

      updateItemQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItemFromInvoice(itemId);
          return;
        }

        set((state) => ({
          currentInvoice: state.currentInvoice ? {
            ...state.currentInvoice,
            items: state.currentInvoice.items.map(item =>
              item.id === itemId
                ? { ...item, quantity, totalPrice: item.unitPrice * quantity }
                : item
            ),
          } : null,
        }));
        get().calculateInvoiceTotal();
      },

      applyDiscount: (discount) => {
        set((state) => ({
          currentInvoice: state.currentInvoice ? {
            ...state.currentInvoice,
            discount,
          } : null,
        }));
        get().calculateInvoiceTotal();
      },

      completeInvoice: (customerId) => {
        const { currentInvoice } = get();
        if (!currentInvoice || currentInvoice.items.length === 0) return;

        const completedInvoice = {
          ...currentInvoice,
          status: 'completed' as const,
          customerId,
        };

        // Add loyalty points if customer is provided
        if (customerId) {
          const pointsToAdd = Math.floor(completedInvoice.total / 1000); // 1 point per 1000 SYP
          get().updateCustomerPoints(customerId, pointsToAdd);
        }

        set((state) => ({
          invoices: [...state.invoices, completedInvoice],
          currentInvoice: null,
        }));
      },

      cancelInvoice: () => {
        set({ currentInvoice: null });
      },

      calculateInvoiceTotal: () => {
        set((state) => {
          if (!state.currentInvoice) return state;

          const subtotal = state.currentInvoice.items.reduce(
            (sum, item) => sum + item.totalPrice,
            0
          );
          const total = subtotal - state.currentInvoice.discount;

          return {
            currentInvoice: {
              ...state.currentInvoice,
              subtotal,
              total: Math.max(0, total),
            },
          };
        });
      },

      addCustomer: (customerData) => {
        const newCustomer: Customer = {
          ...customerData,
          id: crypto.randomUUID(),
          createdAt: new Date(),
        };
        
        set((state) => ({
          customers: [...state.customers, newCustomer],
        }));
      },

      updateCustomerPoints: (customerId, pointsToAdd) => {
        set((state) => ({
          customers: state.customers.map(customer =>
            customer.id === customerId
              ? { 
                  ...customer, 
                  loyaltyPoints: customer.loyaltyPoints + pointsToAdd,
                  totalPurchases: customer.totalPurchases + 1,
                }
              : customer
          ),
        }));
      },

      findProductByName: (name, products) => {
        const searchTerm = name.toLowerCase().trim();
        
        // Exact match first
        let product = products.find(p => 
          p.name.toLowerCase() === searchTerm
        );
        
        // Partial match if no exact match
        if (!product) {
          product = products.find(p => 
            p.name.toLowerCase().includes(searchTerm) ||
            searchTerm.includes(p.name.toLowerCase())
          );
        }
        
        return product || null;
      },
    }),
    {
      name: 'invoice-store',
    }
  )
);
