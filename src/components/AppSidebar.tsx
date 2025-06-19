import { BarChart3, Package, ShoppingCart, DollarSign, Settings, User, FileText, Ruler, LogOut, TrendingUp, ShoppingBag } from 'lucide-react';
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

interface AppSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const AppSidebar = ({ activeSection, onSectionChange }: AppSidebarProps) => {
  const { setOpenMobile } = useSidebar();

  const handleItemClick = (sectionId: string) => {
    onSectionChange(sectionId);
    // Close sidebar on mobile after item selection
    setOpenMobile(false);
  };

  const mainMenuItems = [
    {
      id: 'dashboard',
      title: 'لوحة التحكم',
      icon: BarChart3,
    },
    {
      id: 'products',
      title: 'إدارة المنتجات',
      icon: Package,
    },
    {
      id: 'sales',
      title: 'عمليات البيع',
      icon: TrendingUp,
    },
    {
      id: 'purchase',
      title: 'عمليات الشراء',
      icon: ShoppingBag,
    },
    {
      id: 'shortage',
      title: 'سلة النواقص',
      icon: ShoppingCart,
    },
    {
      id: 'exchange-rate',
      title: 'سعر الصرف',
      icon: DollarSign,
    },
  ];

  const managementItems = [
    {
      id: 'units',
      title: 'إدارة الوحدات',
      icon: Ruler,
    },
    {
      id: 'reports',
      title: 'التقارير',
      icon: FileText,
    },
  ];

  const settingsItems = [
    {
      id: 'settings',
      title: 'إعدادات التطبيق',
      icon: Settings,
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
          <div className="bg-white/20 p-2 rounded-lg flex-shrink-0">
            <ShoppingCart className="h-5 w-5 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-sm font-bold text-white truncate">
              نظام إدارة البقالة الذكية
            </h1>
            <p className="text-xs text-white/80 truncate">
              إدارة شاملة للمخزون والمبيعات
            </p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="p-2 overflow-y-auto flex-1">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[#388E3C] font-semibold text-xs px-3 py-2">القوائم الرئيسية</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map((item) => (
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
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3 border-t bg-muted/30">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-9 text-sm">
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
