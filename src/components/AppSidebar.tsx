import { BarChart3, Package, ShoppingCart, DollarSign, Settings, User, FileText, Ruler, LogOut, TrendingUp, ShoppingBag, Shield } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { useSidebar } from '@/components/ui/sidebar';
import { useAuthStore } from '@/stores/useAuthStore';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import RoleGuard from '@/components/RoleGuard';

interface AppSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const AppSidebar = ({ activeSection, onSectionChange }: AppSidebarProps) => {
  const { setOpenMobile } = useSidebar();
  const { user, logout } = useAuthStore();

  const handleItemClick = (sectionId: string) => {
    onSectionChange(sectionId);
    // Close sidebar on mobile after item selection
    setOpenMobile(false);
  };

  const getRoleDisplayName = (role: string) => {
    return role === 'ShopOwner' ? 'صاحب المتجر' : 'عامل';
  };

  const getRoleBadgeVariant = (role: string) => {
    return role === 'ShopOwner' ? 'default' : 'secondary';
  };

  const handleLogout = () => {
    logout();
  };

  const mainMenuItems = [
    {
      id: 'dashboard',
      title: 'لوحة التحكم',
      icon: BarChart3,
      permission: 'dashboard',
    },
    {
      id: 'products',
      title: 'إدارة المنتجات',
      icon: Package,
      permission: 'products.view',
    },
    {
      id: 'sales',
      title: 'عمليات البيع',
      icon: TrendingUp,
      permission: 'sales.view',
    },
    {
      id: 'purchase',
      title: 'عمليات الشراء',
      icon: ShoppingBag,
      permission: 'purchases.view',
    },
    {
      id: 'shortage',
      title: 'سلة النواقص',
      icon: ShoppingCart,
      permission: 'inventory.view',
    },
    {
      id: 'exchange-rate',
      title: 'سعر الصرف',
      icon: DollarSign,
      permission: 'exchangeRates',
    },
  ];

  const managementItems = [
    {
      id: 'units',
      title: 'إدارة الوحدات',
      icon: Ruler,
      permission: 'units',
    },
    {
      id: 'reports',
      title: 'التقارير',
      icon: FileText,
      permission: 'reports',
    },
  ];

  const settingsItems = [
    {
      id: 'user-management',
      title: 'إدارة المستخدمين',
      icon: Shield,
      permission: 'settings',
    },
    {
      id: 'settings',
      title: 'إعدادات التطبيق',
      icon: Settings,
      permission: 'settings',
    },
    {
      id: 'profile',
      title: 'بيانات الحساب',
      icon: User,
    },
  ];

  return (
    <Sidebar className="w-64 border-l bg-gradient-to-b from-background to-muted/30" side="right">
      <SidebarHeader className="p-4 bg-gradient-to-r from-[#388E3C] to-[#2E7D32] h-16">
        <div className="flex items-center space-x-3">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-white text-[#388E3C] text-xs font-semibold">
              {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <h1 className="text-sm font-medium text-white truncate">
              {user?.name}
            </h1>
            <div className="flex items-center gap-1">
              <Badge variant={getRoleBadgeVariant(user?.role || '')} className="text-xs bg-white/20 text-white border-white/30">
                <Shield className="w-3 h-3 mr-1" />
                {getRoleDisplayName(user?.role || '')}
              </Badge>
            </div>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="p-2 overflow-y-auto flex-1">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[#388E3C] font-semibold text-xs px-3 py-2">القوائم الرئيسية</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map((item) => (
                <RoleGuard key={item.id} permission={item.permission}>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={activeSection === item.id}
                      onClick={() => handleItemClick(item.id)}
                      className={`w-full justify-start h-10 rounded-lg transition-all duration-200 text-sm ${
                        activeSection === item.id 
                          ? 'bg-[#388E3C] text-white shadow-md hover:bg-[#2E7D32]' 
                          : 'hover:bg-[#388E3C]/10 hover:text-[#388E3C]'
                      }`}
                    >
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      <span className="font-medium truncate">{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </RoleGuard>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="my-3" />

        <SidebarGroup>
          <SidebarGroupLabel className="text-[#388E3C] font-semibold text-xs px-3 py-2">الإدارة والتقارير</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {managementItems.map((item) => (
                <RoleGuard key={item.id} permission={item.permission}>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={activeSection === item.id}
                      onClick={() => handleItemClick(item.id)}
                      className={`w-full justify-start h-10 rounded-lg transition-all duration-200 text-sm ${
                        activeSection === item.id 
                          ? 'bg-[#388E3C] text-white shadow-md hover:bg-[#2E7D32]' 
                          : 'hover:bg-[#388E3C]/10 hover:text-[#388E3C]'
                      }`}
                    >
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      <span className="font-medium truncate">{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </RoleGuard>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="my-3" />

        <SidebarGroup>
          <SidebarGroupLabel className="text-[#388E3C] font-semibold text-xs px-3 py-2">الإعدادات</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => (
                item.permission ? (
                  <RoleGuard key={item.id} permission={item.permission}>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        isActive={activeSection === item.id}
                        onClick={() => handleItemClick(item.id)}
                        className={`w-full justify-start h-10 rounded-lg transition-all duration-200 text-sm ${
                          activeSection === item.id 
                            ? 'bg-[#388E3C] text-white shadow-md hover:bg-[#2E7D32]' 
                            : 'hover:bg-[#388E3C]/10 hover:text-[#388E3C]'
                        }`}
                      >
                        <item.icon className="h-4 w-4 flex-shrink-0" />
                        <span className="font-medium truncate">{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </RoleGuard>
                ) : (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      isActive={activeSection === item.id}
                      onClick={() => handleItemClick(item.id)}
                      className={`w-full justify-start h-10 rounded-lg transition-all duration-200 text-sm ${
                        activeSection === item.id 
                          ? 'bg-[#388E3C] text-white shadow-md hover:bg-[#2E7D32]' 
                          : 'hover:bg-[#388E3C]/10 hover:text-[#388E3C]'
                      }`}
                    >
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      <span className="font-medium truncate">{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3 border-t bg-muted/30">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={handleLogout}
              className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-9 text-sm"
            >
              <LogOut className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">تسجيل الخروج</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
