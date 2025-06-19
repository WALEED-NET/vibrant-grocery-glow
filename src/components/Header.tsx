
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Menu, Bell } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';
import AppVersion from './AppVersion';

interface HeaderProps {
  activeSection: string;
}

const Header = ({ activeSection }: HeaderProps) => {
  const isMobile = useIsMobile();
  
  const getSectionTitle = (section: string) => {
    switch (section) {
      case 'dashboard':
        return 'لوحة التحكم';
      case 'products':
        return 'إدارة المنتجات';
      case 'sales':
        return 'المبيعات';
      case 'purchase':
        return 'المشتريات';
      case 'shortage':
        return 'سلة النقص';
      case 'exchange-rate':
        return 'أسعار الصرف';
      case 'units':
        return 'إدارة الوحدات';
      case 'shortcuts':
        return 'اختصارات المنتجات';
      case 'reports':
        return 'التقارير';
      case 'settings':
        return 'الإعدادات';
      case 'profile':
        return 'بيانات الحساب';
      default:
        return 'البقالة الذكية';
    }
  };

  const sectionTitle = getSectionTitle(activeSection);
  const appTitle = 'البقالة الذكية';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-primary/20 bg-primary text-primary-foreground shadow-md">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="p-2 rounded-md text-primary-foreground transition-colors hover:bg-white/10">
            <Menu className="h-6 w-6" />
          </SidebarTrigger>
          
          <div className="hidden sm:block">
            <h1 className="text-lg font-semibold text-right">
              {sectionTitle !== appTitle ? `${appTitle} - ${sectionTitle}` : appTitle}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* معلومات الإصدار */}
          <AppVersion />
          
          {/* أيقونة الإشعارات */}
          <Button variant="ghost" size="icon" className="relative text-primary-foreground hover:bg-white/10">
            <Bell className="h-5 w-5" />
            <Badge 
              className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs bg-red-500 text-white border-2 border-primary"
            >
              3
            </Badge>
          </Button>
        </div>
      </div>
      
      {/* عنوان القسم للموبايل */}
      {isMobile && (
        <div className="px-4 pb-2">
          <h1 className="text-base font-medium text-right text-primary-foreground/90">
            {sectionTitle}
          </h1>
        </div>
      )}
    </header>
  );
};

export default Header;
