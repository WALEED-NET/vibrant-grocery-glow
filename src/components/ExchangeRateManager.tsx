
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { useGroceryStore } from '@/stores/useGroceryStore';
import { DollarSign, TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

const ExchangeRateManager = () => {
  const { currentExchangeRate, exchangeRates, updateExchangeRate } = useGroceryStore();
  const [newRate, setNewRate] = useState('');
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const handleUpdateRate = () => {
    const rate = parseFloat(newRate);
    if (isNaN(rate) || rate <= 0) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال سعر صرف صحيح",
        variant: "destructive",
      });
      return;
    }

    updateExchangeRate(rate);
    setNewRate('');
    
    toast({
      title: "تم التحديث",
      description: `تم تحديث سعر الصرف إلى ${formatCurrency(rate)} ر.ي`,
    });
  };

  const lastRate = exchangeRates[exchangeRates.length - 2];
  const trend = lastRate ? (currentExchangeRate > lastRate.rate ? 'up' : 'down') : null;

  return (
    <div className="space-y-8">
      <Card className="animate-fade-in-up shadow-lg border-border/40">
        <CardHeader className={isMobile ? 'px-4 py-4' : 'px-8 py-8'}>
          <CardTitle className={`text-right flex items-center space-x-3 ${isMobile ? 'text-lg' : 'text-2xl'}`}>
            <DollarSign className={`${isMobile ? 'h-6 w-6' : 'h-7 w-7'} text-primary`} />
            <span>إدارة سعر الصرف</span>
          </CardTitle>
        </CardHeader>
        <CardContent className={`space-y-6 ${isMobile ? 'px-4 py-4' : 'px-8 py-8 pt-0'}`}>
          <div className={`bg-gradient-to-r from-primary/10 to-secondary/10 ${isMobile ? 'p-6' : 'p-8'} rounded-xl shadow-inner`}>
            <div className="text-center">
              <div className="flex items-center justify-center space-x-3 mb-3">
                <span className={`${isMobile ? 'text-3xl' : 'text-5xl'} font-bold text-primary`}>
                  {formatCurrency(currentExchangeRate)}
                </span>
                <span className={`${isMobile ? 'text-lg' : 'text-2xl'} text-muted-foreground`}>ر.ي</span>
                {trend && (
                  <Badge variant={trend === 'up' ? 'destructive' : 'secondary'} className="ml-2">
                    {trend === 'up' ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                  </Badge>
                )}
              </div>
              <p className={`text-muted-foreground ${isMobile ? 'text-base' : 'text-lg'}`}>سعر الصرف الحالي (1 ر.س)</p>
            </div>
          </div>

          <div className="space-y-4">
            <Label htmlFor="exchange-rate" className={`text-right block ${isMobile ? 'text-base' : 'text-lg'}`}>
              سعر الصرف الجديد
            </Label>
            <div className="flex items-center space-x-3">
              <Input
                id="exchange-rate"
                type="number"
                placeholder="أدخل سعر الصرف الجديد..."
                value={newRate}
                onChange={(e) => setNewRate(e.target.value)}
                className={`text-right ${isMobile ? 'h-10' : 'h-12 text-lg'} shadow-sm`}
                min="0"
                step="0.01"
              />
              <Button 
                onClick={handleUpdateRate} 
                className={`whitespace-nowrap ${isMobile ? '' : 'px-6 py-3 text-lg'} shadow-lg hover:shadow-xl transition-all duration-200`}
              >
                تحديث السعر
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="animate-fade-in-up shadow-lg border-border/40">
        <CardHeader className={isMobile ? 'px-4 py-4' : 'px-8 py-8'}>
          <CardTitle className={`text-right flex items-center space-x-3 ${isMobile ? 'text-lg' : 'text-2xl'}`}>
            <Calendar className={`${isMobile ? 'h-5 w-5' : 'h-7 w-7'} text-primary`} />
            <span>سجل تغيرات سعر الصرف</span>
          </CardTitle>
        </CardHeader>
        <CardContent className={isMobile ? 'px-4 py-4 pt-0' : 'px-8 py-8 pt-0'}>
          {exchangeRates.length === 0 ? (
            <div className={`text-center ${isMobile ? 'py-8' : 'py-12'} text-muted-foreground`}>
              لا يوجد سجل لتغيرات سعر الصرف بعد
            </div>
          ) : (
            <div className="space-y-4">
              {exchangeRates
                .slice()
                .reverse()
                .map((rate, index) => (
                  <div
                    key={rate.id}
                    className={`flex items-center justify-between ${isMobile ? 'p-3' : 'p-4'} bg-card border rounded-xl hover:shadow-md transition-all duration-200 shadow-sm`}
                  >
                    <div>
                      <div className={`font-semibold ${isMobile ? 'text-lg' : 'text-xl'}`}>
                        {formatCurrency(rate.rate)} ر.ي
                      </div>
                      <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground`}>
                        {new Date(rate.date).toLocaleDateString('ar', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                    {index === 0 && (
                      <Badge variant="default">الحالي</Badge>
                    )}
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ExchangeRateManager;
