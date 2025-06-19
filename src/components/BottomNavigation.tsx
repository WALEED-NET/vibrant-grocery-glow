
import { BarChart3, Package, ShoppingCart, DollarSign, TrendingUp, ShoppingBag, MoreHorizontal, FileText, User, Settings, Ruler, Hash } from 'lucide-react';
import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface BottomNavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const BottomNavigation = ({ activeSection, onSectionChange }: BottomNavigationProps) => {
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  const mainMenuItems = [
    {
      id: 'dashboard',
      title: 'الرئيسية',
      icon: BarChart3,
    },
    {
      id: 'products',
      title: 'المنتجات',
      icon: Package,
    },
    {
      id: 'sales',
      title: 'البيع',
      icon: TrendingUp,
    },
    {
      id: 'purchase',
      title: 'الشراء',
      icon: ShoppingBag,
    },
  ];

  const moreMenuItems = [
    {
      id: 'shortage',
      title: 'سلة النواقص',
      icon: ShoppingCart,
      description: 'إدارة المنتجات الناقصة'
    },
    {
      id: 'shortcuts',
      title: 'اختصارات المنتجات',
      icon: Hash,
      description: 'إدارة الاختصارات الرقمية للبحث السريع'
    },
    {
      id: 'exchange-rate',
      title: 'سعر الصرف',
      icon: DollarSign,
      description: 'تحديث أسعار الصرف'
    },
    {
      id: 'units',
      title: 'إدارة الوحدات',
      icon: Ruler,
      description: 'إضافة وتعديل وحدات القياس'
    },
    {
      id: 'reports',
      title: 'التقارير',
      icon: FileText,
      description: 'تقارير المبيعات والمخزون'
    },
    {
      id: 'settings',
      title: 'الإعدادات',
      icon: Settings,
      description: 'إعدادات التطبيق العامة'
    },
    {
      id: 'profile',
      title: 'بيانات الحساب',
      icon: User,
      description: 'إدارة بيانات المستخدم'
    },
  ];

  const handleMoreItemClick = (sectionId: string) => {
    onSectionChange(sectionId);
    setMoreMenuOpen(false);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-border md:hidden z-[999] shadow-2xl">
      <div className="grid grid-cols-5 px-2 py-1">
        {mainMenuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            className={`flex flex-col items-center py-3 px-2 min-h-[70px] transition-all duration-200 rounded-lg mx-1 ${
              activeSection === item.id
                ? 'text-white bg-[#388E3C] shadow-lg scale-105'
                : 'text-muted-foreground hover:text-[#388E3C] hover:bg-[#388E3C]/5'
            }`}
          >
            <item.icon className={`h-6 w-6 mb-1 ${
              activeSection === item.id ? 'text-white' : ''
            }`} />
            <span className={`text-xs font-medium ${
              activeSection === item.id ? 'text-white' : ''
            }`}>{item.title}</span>
          </button>
        ))}
        
        <Sheet open={moreMenuOpen} onOpenChange={setMoreMenuOpen}>
          <SheetTrigger asChild>
            <button
              className={`flex flex-col items-center py-3 px-2 min-h-[70px] transition-all duration-200 rounded-lg mx-1 ${
                moreMenuItems.some(item => item.id === activeSection)
                  ? 'text-white bg-[#388E3C] shadow-lg scale-105'
                  : 'text-muted-foreground hover:text-[#388E3C] hover:bg-[#388E3C]/5'
              }`}
            >
              <MoreHorizontal className={`h-6 w-6 mb-1 ${
                moreMenuItems.some(item => item.id === activeSection) ? 'text-white' : ''
              }`} />
              <span className={`text-xs font-medium ${
                moreMenuItems.some(item => item.id === activeSection) ? 'text-white' : ''
              }`}>المزيد</span>
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-auto max-h-[80vh] rounded-t-2xl border-t-2 border-[#388E3C]/20 pb-6 flex flex-col">
            <SheetHeader className="text-center pb-4 px-4">
              <SheetTitle className="text-right text-xl font-bold text-[#388E3C] mb-2">المزيد من الخيارات</SheetTitle>
              <p className="text-sm text-muted-foreground text-right">اختر القسم الذي تريد الوصول إليه</p>
            </SheetHeader>
            <div className="px-4 flex-1 min-h-0">
              <ScrollArea className="h-full">
                <div className="grid grid-cols-1 gap-4 pb-6">
                  {moreMenuItems.map((item) => (
                    <Button
                      key={item.id}
                      variant={activeSection === item.id ? "default" : "outline"}
                      className={`h-auto p-5 flex items-center justify-between text-right transition-all duration-200 ${
                        activeSection === item.id 
                          ? 'bg-[#388E3C] hover:bg-[#2E7D32] text-white shadow-md' 
                          : 'hover:bg-[#388E3C]/10 hover:text-[#388E3C] hover:border-[#388E3C] text-foreground hover:shadow-sm'
                      }`}
                      onClick={() => handleMoreItemClick(item.id)}
                    >
                      <div className="flex items-center space-x-4 flex-1">
                        <item.icon className={`h-7 w-7 ${activeSection === item.id ? 'text-white' : 'text-[#388E3C]'}`} />
                        <div className="text-right">
                          <div className="font-semibold text-lg mb-1">{item.title}</div>
                          <div className={`text-sm ${activeSection === item.id ? 'text-white/80' : 'text-muted-foreground'}`}>
                            {item.description}
                          </div>
                        </div>
                      </div>
                      {activeSection === item.id && (
                        <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                      )}
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default BottomNavigation;
