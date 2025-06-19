import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGroceryStore } from '@/stores/useGroceryStore';
import { TrendingUp, DollarSign, Package, AlertTriangle, Wallet, CreditCard, FileText } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface DashboardProps {
  onSectionChange: (section: string) => void;
}

const Dashboard = ({ onSectionChange }: DashboardProps) => {
  const { products, currentExchangeRate, priceUpdateLogs, salesTransactions } = useGroceryStore();
  const isMobile = useIsMobile();

  const totalProducts = products.length;
  const totalValue = products.reduce((sum, product) => sum + (product.currentSellingPrice * product.currentQuantity), 0);
  const totalValueSAR = totalValue / currentExchangeRate;
  const lowStockProducts = products.filter(p => p.isLowStock);

  // Daily Profit Calculation
  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const todaysSales = salesTransactions?.filter(t => new Date(t.date) >= startOfToday) || [];

  let totalDailyProfit = 0;
  todaysSales.forEach(transaction => {
    transaction.items?.forEach(item => {
      const product = products.find(p => p.id === item.productId);
      if (product && typeof item.quantity === 'number') {
        let purchasePriceYER = product.purchasePrice ?? 0;
        if (product.purchaseCurrency === 'SAR') {
          purchasePriceYER = (product.purchasePrice ?? 0) * currentExchangeRate;
        }
        
        const profitPerUnit = product.currentSellingPrice - purchasePriceYER;
        totalDailyProfit += profitPerUnit * item.quantity;
      }
    });
  });

  const formattedDailyProfit = totalDailyProfit.toLocaleString('ar-YE', { maximumFractionDigits: 0 });
  const totalDailyProfitSAR = totalDailyProfit / currentExchangeRate;
  const formattedDailyProfitSAR = !isFinite(totalDailyProfitSAR) ? 0 : totalDailyProfitSAR.toLocaleString('ar-YE', { maximumFractionDigits: 0 });


  const recentUpdates = priceUpdateLogs.slice(-5).reverse();

  const valueYer = totalValue.toLocaleString('ar-YE', { maximumFractionDigits: 0 });
  const valueSar = totalValueSAR.toLocaleString('ar-YE', { maximumFractionDigits: 0 });

  const stats = [
    {
      title: 'إجمالي المنتجات',
      value: totalProducts.toString(),
      icon: Package,
      color: 'text-[#388E3C]',
      bgColor: 'bg-[#388E3C]/10',
      disabled: false,
    },
    {
      title: 'قيمة المخزون',
      value: (
        <div>
          <p className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-foreground flex items-baseline gap-1`}>
            <span>{valueYer}</span>
            <span className="text-sm font-normal text-muted-foreground">ر.ي</span>
          </p>
          <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground flex items-baseline gap-1`}>
            <span>≈ {valueSar}</span>
            <span className="text-xs">ر.س</span>
          </p>
        </div>
      ),
      icon: Wallet,
      color: 'text-[#388E3C]',
      bgColor: 'bg-[#388E3C]/10',
      disabled: false,
    },
    {
      title: 'المنتجات الناقصة',
      value: lowStockProducts.length.toString(),
      icon: AlertTriangle,
      color: lowStockProducts.length > 0 ? 'text-destructive' : 'text-[#388E3C]',
      bgColor: lowStockProducts.length > 0 ? 'bg-destructive/10' : 'bg-[#388E3C]/10',
      disabled: false,
    },
    {
      title: 'الربح اليومي',
      value: (
        <div>
          <p className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-foreground flex items-baseline gap-1`}>
            <span>{formattedDailyProfit}</span>
            <span className="text-sm font-normal text-muted-foreground">ر.ي</span>
          </p>
          <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground flex items-baseline gap-1`}>
            <span>≈ {formattedDailyProfitSAR}</span>
            <span className="text-xs">ر.س</span>
          </p>
        </div>
      ),
      icon: TrendingUp,
      color: 'text-[#388E3C]',
      bgColor: 'bg-[#388E3C]/10',
      disabled: false,
    },
  ];

  const comingSoonStats = [
    {
      title: 'إجمالي المبلغ دائن',
      value: (
        <div>
          <p className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-foreground/70 flex items-baseline gap-1`}>
            <span>0</span>
            <span className="text-sm font-normal text-muted-foreground">ر.ي</span>
          </p>
          <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground flex items-baseline gap-1`}>
            <span>≈ 0</span>
            <span className="text-xs">ر.س</span>
          </p>
        </div>
      ),
      icon: CreditCard,
      color: 'text-gray-400',
      bgColor: 'bg-gray-500/10',
      disabled: true,
    },
    {
      title: 'إجمالي المبلغ مدين',
      value: (
        <div>
          <p className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-foreground/70 flex items-baseline gap-1`}>
            <span>0</span>
            <span className="text-sm font-normal text-muted-foreground">ر.ي</span>
          </p>
          <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground flex items-baseline gap-1`}>
            <span>≈ 0</span>
            <span className="text-xs">ر.س</span>
          </p>
        </div>
      ),
      icon: CreditCard,
      color: 'text-gray-400',
      bgColor: 'bg-gray-500/10',
      disabled: true,
    },
    {
      title: 'الالتزامات',
      value: <p className="text-sm font-medium text-foreground/70 pt-2">رواتب، كهرباء، إيجارات</p>,
      icon: FileText,
      color: 'text-gray-400',
      bgColor: 'bg-gray-500/10',
      disabled: true,
    },
  ];

  const ComingSoonSection = () => (
    <Card className="border-border/30 bg-card/30 backdrop-blur-sm opacity-75 mt-6">
      <CardHeader>
        <CardTitle className="text-lg text-right text-muted-foreground">
          قريباً في الإصدار الثاني...
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {comingSoonStats.map((stat, index) => (
            <Card key={index} className="bg-muted/30 cursor-not-allowed border-dashed">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                    <stat.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${stat.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm sm:text-base text-muted-foreground truncate font-medium">{stat.title}</p>
                    <div className="mt-1">
                      {stat.value}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );


  if (isMobile) {
    return (
      <div className="animate-fade-in-up space-y-4 pb-20 w-full">
        {/* Stats Grid - Mobile */}
        <div className="grid grid-cols-2 gap-3 w-full">
          {stats.map((stat, index) => {
            const isShortageCard = stat.title === 'المنتجات الناقصة';
            return (
              <Card 
                key={index} 
                className={cn(
                  "transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm",
                  isShortageCard && "cursor-pointer hover:border-primary/50 hover:shadow-lg",
                  !isShortageCard && !stat.disabled && "hover:shadow-lg",
                  stat.disabled && "opacity-70 cursor-not-allowed hover:shadow-none"
                )}
                onClick={isShortageCard ? () => onSectionChange('shortage') : undefined}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-xl ${stat.bgColor} shadow-sm`}>
                      <stat.icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-muted-foreground truncate font-medium">{stat.title}</p>
                      <div className="mt-1">
                        {typeof stat.value === 'string' ? (
                          <p className="text-xl font-bold text-foreground">{stat.value}</p>
                        ) : (
                          stat.value
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Content - Mobile */}
        <div className="grid grid-cols-1 gap-4 w-full">
          {/* Exchange Rate Card - Mobile */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="p-4 pb-3">
              <CardTitle className="text-lg text-right flex items-center space-x-3">
                <DollarSign className="h-5 w-5 text-[#388E3C]" />
                <span>سعر الصرف الحالي</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="bg-gradient-to-br from-[#388E3C]/10 via-[#388E3C]/5 to-transparent p-6 rounded-xl border border-[#388E3C]/20">
                <div className="text-center">
                  <p className="text-3xl font-bold text-[#388E3C] mb-3">
                    {currentExchangeRate.toLocaleString('ar-YE')} ر.ي
                  </p>
                  <p className="text-muted-foreground text-sm mb-4">
                    سعر الريال السعودي الواحد بالريال اليمني
                  </p>
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                      <p className="text-muted-foreground text-xs font-medium">10 ر.س</p>
                      <p className="font-bold text-[#388E3C] mt-1">{(currentExchangeRate * 10).toLocaleString('ar-YE')}</p>
                    </div>
                    <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                      <p className="text-muted-foreground text-xs font-medium">50 ر.س</p>
                      <p className="font-bold text-[#388E3C] mt-1">{(currentExchangeRate * 50).toLocaleString('ar-YE')}</p>
                    </div>
                    <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                      <p className="text-muted-foreground text-xs font-medium">100 ر.س</p>
                      <p className="font-bold text-[#388E3C] mt-1">{(currentExchangeRate * 100).toLocaleString('ar-YE')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Updates - Mobile */}
          {recentUpdates.length > 0 && (
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader className="p-4 pb-3">
                <CardTitle className="text-lg text-right">آخر تحديثات الأسعار</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="space-y-3">
                  {recentUpdates.slice(0, 3).map((log) => {
                    const product = products.find(p => p.id === log.productId);
                    const priceChange = log.newPrice - log.oldPrice;
                    const isIncrease = priceChange > 0;
                    
                    return (
                      <div key={log.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border/30 hover:bg-muted/50 transition-colors">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold truncate text-sm">{product?.name || 'منتج محذوف'}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(log.date).toLocaleDateString('ar-YE')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-sm">
                            {log.newPrice.toLocaleString('ar-YE')} ر.ي
                          </p>
                          <p className={`text-xs font-medium ${isIncrease ? 'text-destructive' : 'text-[#388E3C]'}`}>
                            {isIncrease ? '+' : ''}{priceChange.toLocaleString('ar-YE')} ر.ي
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <ComingSoonSection />
      </div>
    );
  }

  // Desktop Layout
  return (
    <div className="animate-fade-in-up space-y-6 w-full">
      {/* Stats Grid - Desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 w-full">
        {stats.map((stat, index) => {
          const isShortageCard = stat.title === 'المنتجات الناقصة';
          return (
            <Card 
              key={index}
              className={cn(
                "transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm",
                isShortageCard && "cursor-pointer hover:border-primary/50 hover:shadow-lg",
                !isShortageCard && !stat.disabled && "hover:shadow-lg",
                stat.disabled && "opacity-70 cursor-not-allowed hover:shadow-none"
              )}
              onClick={isShortageCard ? () => onSectionChange('shortage') : undefined}
            >
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-xl ${stat.bgColor} shadow-sm`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-base text-muted-foreground truncate font-medium">{stat.title}</p>
                    <div className="mt-1">
                      {typeof stat.value === 'string' ? (
                        <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      ) : (
                        stat.value
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content Grid - Desktop */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 w-full">
        {/* Exchange Rate Card - Desktop */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="p-6 pb-4">
            <CardTitle className="text-xl text-right flex items-center space-x-3">
              <DollarSign className="h-6 w-6 text-[#388E3C]" />
              <span>سعر الصرف الحالي</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="bg-gradient-to-br from-[#388E3C]/10 via-[#388E3C]/5 to-transparent p-8 rounded-xl border border-[#388E3C]/20">
              <div className="text-center">
                <p className="text-5xl font-bold text-[#388E3C] mb-4">
                  {currentExchangeRate.toLocaleString('ar-YE')} ر.ي
                </p>
                <p className="text-muted-foreground text-lg mb-6">
                  سعر الريال السعودي الواحد بالريال اليمني
                </p>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                    <p className="text-muted-foreground text-sm font-medium">10 ر.س</p>
                    <p className="font-bold text-[#388E3C] mt-2 text-lg">{(currentExchangeRate * 10).toLocaleString('ar-YE')}</p>
                  </div>
                  <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                    <p className="text-muted-foreground text-sm font-medium">50 ر.س</p>
                    <p className="font-bold text-[#388E3C] mt-2 text-lg">{(currentExchangeRate * 50).toLocaleString('ar-YE')}</p>
                  </div>
                  <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                    <p className="text-muted-foreground text-sm font-medium">100 ر.س</p>
                    <p className="font-bold text-[#388E3C] mt-2 text-lg">{(currentExchangeRate * 100).toLocaleString('ar-YE')}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Updates - Desktop */}
        {recentUpdates.length > 0 && (
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="p-6 pb-4">
              <CardTitle className="text-xl text-right">آخر تحديثات الأسعار</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="space-y-4">
                {recentUpdates.slice(0, 5).map((log) => {
                  const product = products.find(p => p.id === log.productId);
                  const priceChange = log.newPrice - log.oldPrice;
                  const isIncrease = priceChange > 0;
                  
                  return (
                    <div key={log.id} className="flex items-center justify-between p-5 bg-muted/30 rounded-lg border border-border/30 hover:bg-muted/50 transition-colors">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-base">{product?.name || 'منتج محذوف'}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {new Date(log.date).toLocaleDateString('ar-YE')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-base">
                          {log.newPrice.toLocaleString('ar-YE')} ر.ي
                        </p>
                        <p className={`text-sm font-medium ${isIncrease ? 'text-destructive' : 'text-[#388E3C]'}`}>
                          {isIncrease ? '+' : ''}{priceChange.toLocaleString('ar-YE')} ر.ي
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <ComingSoonSection />
    </div>
  );
};

export default Dashboard;
