import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, UserRole, Permission, DEFAULT_PERMISSIONS } from '@/types/user';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  permissions: Permission | null;
  login: (phone: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  hasPermission: (action: string) => boolean;
}

// Sample users for testing
const SAMPLE_USERS: Array<User & { password: string }> = [
  {
    id: '1',
    name: 'محمد أحمد',
    phone: '123456789',
    password: 'owner123',
    role: 'ShopOwner',
  },
  {
    id: '2',
    name: 'علي محمود',
    phone: '987654321',
    password: 'worker123',
    role: 'Worker',
  },
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      permissions: null,

      login: async (phone: string, password: string) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const user = SAMPLE_USERS.find(
          u => u.phone === phone && u.password === password
        );

        if (user) {
          const { password: _, ...userWithoutPassword } = user;
          const permissions = DEFAULT_PERMISSIONS[user.role];
          
          set({
            user: userWithoutPassword,
            isAuthenticated: true,
            permissions,
          });
          return true;
        }
        return false;
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          permissions: null,
        });
      },

      updateProfile: (data: Partial<User>) => {
        const { user } = get();
        if (user) {
          set({
            user: { ...user, ...data },
          });
        }
      },

      hasPermission: (action: string) => {
        const { permissions } = get();
        if (!permissions) return false;

        const keys = action.split('.');
        let current: any = permissions;
        
        for (const key of keys) {
          if (current[key] === undefined) return false;
          current = current[key];
        }
        
        return Boolean(current);
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);