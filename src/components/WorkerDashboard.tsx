import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGroceryStore } from '@/stores/useGroceryStore';
import { TrendingUp, Package, AlertTriangle, ShoppingCart, Clock, CheckCircle } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface WorkerDashboardProps {
  onSectionChange: (section: string) => void;
}

const WorkerDashboard = ({ onSectionChange }: WorkerDashboardProps) => {
  const { products, currentExchangeRate, salesTransactions } = useGroceryStore();
  const isMobile = useIsMobile();

  const totalProducts = products.length;
  const lowStockProducts = products.filter(p => p.isLowStock);
  
  // Today's sales for worker
  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const todaysSales = salesTransactions?.filter(t => new Date(t.date) >= startOfToday) || [];
  
  const todaysSalesCount = todaysSales.length;
  const todaysSalesValue = todaysSales.reduce((sum, transaction) => {
    const total = transaction.items?.reduce((itemSum, item) => {
      const product = products.find(p => p.id === item.productId);
      return itemSum + (item.quantity * (product?.currentSellingPrice || 0));
    }, 0) || 0;
    return sum + total;
  }, 0);

  const formattedSalesValue = todaysSalesValue.toLocaleString('ar-YE', { maximumFractionDigits: 0 });

  const quickActions = [
    {
      title: 'مبيعة سريعة',
      description: 'إضافة مبيعة جديدة',
      icon: ShoppingCart,
      action: () => onSectionChange('sales'),
      color: 'bg-blue-500',
    },
    {
      title: 'عرض المنتجات',
      description: 'تصفح قائمة المنتجات',
      icon: Package,
      action: () => onSectionChange('products'),
      color: 'bg-green-500',
    },
    {
      title: 'النواقص',
      description: 'عرض المنتجات الناقصة',
      icon: AlertTriangle,
      action: () => onSectionChange('shortage'),
      color: 'bg-orange-500',
    },
  ];

  const stats = [
    {
      title: 'مبيعات اليوم',
      value: todaysSalesCount.toString(),
      subValue: `${formattedSalesValue} ر.ي`,
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'إجمالي المنتجات',
      value: totalProducts.toString(),
      subValue: 'منتج متاح',
      icon: Package,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'منتجات ناقصة',
      value: lowStockProducts.length.toString(),
      subValue: 'يحتاج تجديد',
      icon: AlertTriangle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  // Recent sales for worker view
  const recentSales = salesTransactions.slice(-5).reverse();

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg">
        <h1 className="text-2xl font-bold mb-2">مرحباً بك في لوحة العمل</h1>
        <p className="text-blue-100">ابدأ يومك بإدارة المبيعات والمنتجات بكفاءة</p>
      </div>

      {/* Stats Cards */}
      <div className={cn(
        "grid gap-4",
        isMobile ? "grid-cols-1" : "grid-cols-3"
      )}>
        {stats.map((stat, index) => (
          <Card key={index} className="relative overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.subValue}</p>
                </div>
                <div className={cn("p-3 rounded-full", stat.bgColor)}>
                  <stat.icon className={cn("h-6 w-6", stat.color)} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            إجراءات سريعة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={cn(
            "grid gap-4",
            isMobile ? "grid-cols-1" : "grid-cols-3"
          )}>
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-3 hover:bg-muted"
                onClick={action.action}
              >
                <div className={cn("p-3 rounded-full text-white", action.color)}>
                  <action.icon className="h-6 w-6" />
                </div>
                <div className="text-center">
                  <h3 className="font-medium">{action.title}</h3>
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Sales & Low Stock */}
      <div className={cn(
        "grid gap-6",
        isMobile ? "grid-cols-1" : "grid-cols-2"
      )}>
        {/* Recent Sales */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              المبيعات الأخيرة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentSales.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">لا توجد مبيعات اليوم</p>
              ) : (
                recentSales.map((sale, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">فاتورة #{sale.id?.slice(-6)}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(sale.date).toLocaleDateString('ar-YE')}
                      </p>
                    </div>
                    <div className="text-left">
                      <p className="font-medium">
                        {(sale.items?.reduce((sum, item) => {
                          const product = products.find(p => p.id === item.productId);
                          return sum + (item.quantity * (product?.currentSellingPrice || 0));
                        }, 0) || 0).toLocaleString('ar-YE', { maximumFractionDigits: 0 })} ر.ي
                      </p>
                      <Badge variant="secondary" className="text-xs">
                        {sale.items?.length || 0} منتج
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Alert */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              تنبيهات المخزون
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lowStockProducts.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">جميع المنتجات متوفرة</p>
              ) : (
                lowStockProducts.slice(0, 5).map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        الكمية: {product.currentQuantity} {product.unit}
                      </p>
                    </div>
                    <Badge variant="destructive">
                      ناقص
                    </Badge>
                  </div>
                ))
              )}
              {lowStockProducts.length > 5 && (
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => onSectionChange('shortage')}
                >
                  عرض المزيد ({lowStockProducts.length - 5})
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WorkerDashboard;