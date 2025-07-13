
import { useState, useEffect } from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import Header from '@/components/Header';
import Dashboard from '@/components/Dashboard';
import WorkerDashboard from '@/components/WorkerDashboard';
import UserManagementPage from '@/components/UserManagementPage';
import ProductsPage from '@/components/ProductsPage';
import ShortageBasket from '@/components/ShortageBasket';
import ExchangeRateManager from '@/components/ExchangeRateManager';
import UnitsManagerPage from '@/components/UnitsManagerPage';
import SalesPage from '@/components/SalesPage';
import PurchasePage from '@/components/PurchasePage';
import ProductShortcuts from '@/components/ProductShortcuts';
import AppSidebar from '@/components/AppSidebar';
import BottomNavigation from '@/components/BottomNavigation';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, User, FileText } from 'lucide-react';
import ProfilePage from '@/components/ProfilePage';
import RoleGuard from '@/components/RoleGuard';
import { useAuthStore } from '@/stores/useAuthStore';

const Index = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isMobile, setIsMobile] = useState(false);
  const { user, hasPermission } = useAuthStore();

  // Enhanced mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return user?.role === 'Worker' && !hasPermission('dashboard') ? 
          <WorkerDashboard onSectionChange={setActiveSection} /> : 
          <Dashboard onSectionChange={setActiveSection} />;
      case 'products':
        return (
          <RoleGuard permission="products.view">
            <ProductsPage onSectionChange={setActiveSection} />
          </RoleGuard>
        );
      case 'sales':
        return (
          <RoleGuard permission="sales.view">
            <SalesPage />
          </RoleGuard>
        );
      case 'purchase':
        return (
          <RoleGuard permission="purchases.view">
            <PurchasePage />
          </RoleGuard>
        );
      case 'shortage':
        return (
          <RoleGuard permission="inventory.view">
            <ShortageBasket />
          </RoleGuard>
        );
      case 'exchange-rate':
        return (
          <RoleGuard permission="exchangeRates">
            <ExchangeRateManager />
          </RoleGuard>
        );
      case 'units':
        return (
          <RoleGuard permission="units">
            <UnitsManagerPage />
          </RoleGuard>
        );
      case 'shortcuts':
        return (
          <RoleGuard permission="products.add">
            <ProductShortcuts />
          </RoleGuard>
        );
      case 'reports':
        return (
          <RoleGuard permission="reports">
            <Card className="shadow-lg border-border/40 animate-fade-in">
              <CardHeader className="pb-4 bg-gradient-to-r from-[#388E3C]/5 to-[#2E7D32]/5">
                <CardTitle className="flex items-center space-x-3 text-right text-2xl">
                  <FileText className="h-7 w-7 text-[#388E3C]" />
                  <span>التقارير والإحصائيات</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="px-8 py-12">
                <div className="text-center py-16 text-muted-foreground">
                  <div className="relative">
                    <FileText className="h-24 w-24 mx-auto mb-6 text-muted-foreground/30" />
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#388E3C] rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">قريباً</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-foreground">قسم التقارير</h3>
                  <p className="text-lg mb-6">سيتم إضافة التقارير المختلفة والإحصائيات التفصيلية قريباً</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto text-sm">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <span className="font-medium">• تقارير المبيعات</span>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <span className="font-medium">• تقارير المخزون</span>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <span className="font-medium">• التحليلات المالية</span>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <span className="font-medium">• الإحصائيات الشهرية</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </RoleGuard>
        );
      case 'user-management':
        return (
          <RoleGuard permission="settings">
            <UserManagementPage />
          </RoleGuard>
        );
      case 'settings':
        return (
          <RoleGuard permission="settings">
            <Card className="shadow-lg border-border/40 animate-fade-in">
              <CardHeader className="pb-4 bg-gradient-to-r from-[#388E3C]/5 to-[#2E7D32]/5">
                <CardTitle className="flex items-center space-x-3 text-right text-2xl">
                  <Settings className="h-7 w-7 text-[#388E3C]" />
                  <span>إعدادات التطبيق</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="px-8 py-12">
                <div className="text-center py-16 text-muted-foreground">
                  <div className="relative">
                    <Settings className="h-24 w-24 mx-auto mb-6 text-muted-foreground/30 animate-pulse" />
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#388E3C] rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">قريباً</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-foreground">إعدادات النظام</h3>
                  <p className="text-lg mb-6">سيتم إضافة إعدادات التطبيق المتقدمة قريباً</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto text-sm">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <span className="font-medium">• إعدادات الطباعة</span>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <span className="font-medium">• إعدادات النظام</span>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <span className="font-medium">• إعدادات النسخ الاحتياطي</span>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <span className="font-medium">• إعدادات الأمان</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </RoleGuard>
        );
      case 'profile':
        return <ProfilePage />;
      default:
        return <Dashboard onSectionChange={setActiveSection} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10 w-full overflow-x-hidden">
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar 
            activeSection={activeSection} 
            onSectionChange={setActiveSection} 
          />
          
          <SidebarInset className="flex flex-col min-h-screen flex-1 w-full">
            <Header activeSection={activeSection} />
            
            <main className={`flex-1 w-full transition-all duration-300 ${isMobile ? 'px-3 py-3 pb-20' : 'px-6 py-6'}`}>
              <div className="w-full max-w-full">
                {renderContent()}
              </div>
            </main>
            
            {isMobile && (
              <BottomNavigation 
                activeSection={activeSection} 
                onSectionChange={setActiveSection} 
              />
            )}
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Index;
