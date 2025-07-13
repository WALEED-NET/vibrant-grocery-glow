export type UserRole = 'ShopOwner' | 'Worker';

export interface User {
  id: string;
  name: string;
  phone: string;
  role: UserRole;
  avatar?: string;
}

export interface Permission {
  dashboard: boolean;
  products: {
    view: boolean;
    add: boolean;
    edit: boolean;
    delete: boolean;
  };
  sales: {
    view: boolean;
    create: boolean;
  };
  purchases: {
    view: boolean;
    create: boolean;
  };
  inventory: {
    view: boolean;
    manage: boolean;
  };
  reports: boolean;
  settings: boolean;
  exchangeRates: boolean;
  units: boolean;
}

export const DEFAULT_PERMISSIONS: Record<UserRole, Permission> = {
  ShopOwner: {
    dashboard: true,
    products: {
      view: true,
      add: true,
      edit: true,
      delete: true,
    },
    sales: {
      view: true,
      create: true,
    },
    purchases: {
      view: true,
      create: true,
    },
    inventory: {
      view: true,
      manage: true,
    },
    reports: true,
    settings: true,
    exchangeRates: true,
    units: true,
  },
  Worker: {
    dashboard: false, // Workers get their own dashboard
    products: {
      view: true,
      add: false,
      edit: true,
      delete: false,
    },
    sales: {
      view: true,
      create: true,
    },
    purchases: {
      view: false,
      create: false,
    },
    inventory: {
      view: true,
      manage: false,
    },
    reports: false,
    settings: false,
    exchangeRates: false,
    units: false,
  },
};