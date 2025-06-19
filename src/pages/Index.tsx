
import { useState } from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import Header from '@/components/Header';
import Dashboard from '@/components/Dashboard';
import ProductsPage from '@/components/ProductsPage';
import ShortageBasket from '@/components/ShortageBasket';
import ExchangeRateManager from '@/components/ExchangeRateManager';
import UnitsManagerPage from '@/components/UnitsManagerPage';
import SalesPage from '@/components/SalesPage';
import PurchasePage from '@/components/PurchasePage';
import ProductShortcuts from '@/components/ProductShortcuts';
import AppSidebar from '@/components/AppSidebar';
import BottomNavigation from '@/components/BottomNavigation';
import { useIsMobile } from '@/hooks/use-mobile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, User, FileText } from 'lucide-react';

const Index = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const isMobile = useIsMobile();

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard onSectionChange={setActiveSection} />;
      case 'products':
        return <ProductsPage onSectionChange={setActiveSection} />;
      case 'sales':
        return <SalesPage />;
      case 'purchase':
        return <PurchasePage />;
      case 'shortage':
        return <ShortageBasket />;
      case 'exchange-rate':
        return <ExchangeRateManager />;
      case 'units':
        return <UnitsManagerPage />;
      case 'shortcuts':
        return <ProductShortcuts />;
      case 'reports':
        return (
          <Card className="shadow-lg border-border/40">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-3 text-right text-2xl">
                <FileText className="h-7 w-7 text-[#388E3C]" />
                <span>التقارير</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="px-8 py-12">
              <div className="text-center py-16 text-muted-foreground">
                <FileText className="h-20 w-20 mx-auto mb-6 text-muted-foreground/40" />
                <h3 className="text-2xl font-medium mb-4">قسم التقارير</h3>
                <p className="text-lg">سيتم إضافة التقارير المختلفة قريباً</p>
              </div>
            </CardContent>
          </Card>
        );
      case 'settings':
        return (
          <Card className="shadow-lg border-border/40">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-3 text-right text-2xl">
                <Settings className="h-7 w-7 text-[#388E3C]" />
                <span>إعدادات التطبيق</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="px-8 py-12">
              <div className="text-center py-16 text-muted-foreground">
                <Settings className="h-20 w-20 mx-auto mb-6 text-muted-foreground/40" />
                <h3 className="text-2xl font-medium mb-4">إعدادات التطبيق</h3>
                <p className="text-lg">سيتم إضافة إعدادات التطبيق قريباً</p>
              </div>
            </CardContent>
          </Card>
        );
      case 'profile':
        return (
          <Card className="shadow-lg border-border/40">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-3 text-right text-2xl">
                <User className="h-7 w-7 text-[#388E3C]" />
                <span>بيانات الحساب</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="px-8 py-12">
              <div className="text-center py-16 text-muted-foreground">
                <User className="h-20 w-20 mx-auto mb-6 text-muted-foreground/40" />
                <h3 className="text-2xl font-medium mb-4">بيانات الحساب</h3>
                <p className="text-lg">سيتم إضافة إدارة بيانات الحساب قريباً</p>
              </div>
            </CardContent>
          </Card>
        );
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
            
            <main className={`flex-1 w-full ${isMobile ? 'px-3 py-3 pb-20' : 'px-6 py-6'}`}>
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
