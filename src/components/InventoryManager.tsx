
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useGroceryStore } from '@/stores/useGroceryStore';
import { Package, AlertTriangle, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/lib/utils';

const InventoryManager = () => {
  const { products, updateProductQuantity, currentExchangeRate } = useGroceryStore();
  const [filter, setFilter] = useState<'all' | 'low-stock'>('all');
  const [quantities, setQuantities] = useState<{ [key: string]: string }>({});
  const { toast } = useToast();

  const filteredProducts = products.filter(product => 
    filter === 'all' ? true : product.isLowStock
  );

  const lowStockCount = products.filter(p => p.isLowStock).length;

  const handleQuantityChange = (productId: string, value: string) => {
    setQuantities(prev => ({ ...prev, [productId]: value }));
  };

  const handleUpdateQuantity = (productId: string, productName: string) => {
    const newQuantity = parseFloat(quantities[productId] || '0');
    
    if (isNaN(newQuantity) || newQuantity < 0) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال كمية صحيحة",
        variant: "destructive",
      });
      return;
    }

    updateProductQuantity(productId, newQuantity);
    setQuantities(prev => ({ ...prev, [productId]: '' }));
    
    toast({
      title: "تم التحديث",
      description: `تم تحديث كمية "${productName}" بنجاح`,
    });
  };

  return (
    <div className="space-y-6">
      <Card className="animate-fade-in-up">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-primary" />
              <span>إدارة المخزون</span>
            </div>
            <div className="flex items-center space-x-2">
              {lowStockCount > 0 && (
                <Badge variant="destructive" className="flex items-center space-x-1">
                  <AlertTriangle className="h-3 w-3" />
                  <span>{lowStockCount} منتج ناقص</span>
                </Badge>
              )}
              <div className="flex items-center space-x-2">
                <Button
                  variant={filter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('all')}
                >
                  جميع المنتجات
                </Button>
                <Button
                  variant={filter === 'low-stock' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('low-stock')}
                >
                  المنتجات الناقصة
                </Button>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {filter === 'all' ? 'لا توجد منتجات بعد' : 'لا توجد منتجات ناقصة'}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className={`border rounded-lg p-4 transition-all ${
                    product.isLowStock 
                      ? 'border-destructive bg-destructive/5' 
                      : 'border-border hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-lg">{product.name}</h3>
                        {product.isLowStock && (
                          <Badge variant="destructive" className="flex items-center space-x-1">
                            <AlertTriangle className="h-3 w-3" />
                            <span>ناقص</span>
                          </Badge>
                        )}
                        {product.category && (
                          <Badge variant="secondary">{product.category}</Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground block">الكمية الحالية:</span>
                          <span className={`font-medium text-lg ${
                            product.isLowStock ? 'text-destructive' : 'text-primary'
                          }`}>
                            {product.currentQuantity} {product.unit}
                          </span>
                        </div>
                        
                        <div>
                          <span className="text-muted-foreground block">الحد الأدنى:</span>
                          <span className="font-medium">
                            {product.minimumQuantity} {product.unit}
                          </span>
                        </div>
                        
                        <div>
                          <span className="text-muted-foreground block">سعر الشراء:</span>
                          <span className="font-medium">
                            {product.originalPurchasePriceSAR} ر.س
                          </span>
                          <span className="text-xs text-muted-foreground block">
                            ({formatCurrency(product.originalPurchasePriceSAR * currentExchangeRate)} ر.ي)
                          </span>
                        </div>
                        
                        <div>
                          <span className="text-muted-foreground block">سعر البيع:</span>
                          <span className="font-bold text-primary">
                            {formatCurrency(product.currentSellingPrice)} ر.ي
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="كمية جديدة"
                        value={quantities[product.id] || ''}
                        onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                        className="w-24 text-center"
                      />
                      <Button
                        size="sm"
                        onClick={() => handleUpdateQuantity(product.id, product.name)}
                        disabled={!quantities[product.id]}
                      >
                        تحديث
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryManager;
