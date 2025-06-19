import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useGroceryStore } from '@/stores/useGroceryStore';
import { useToast } from '@/hooks/use-toast';
import { ShoppingBag, Package, Plus, Minus, Trash2, Search } from 'lucide-react';
import { PurchaseTransactionItem, Product } from '@/types';
import QuickSearch from './QuickSearch';

const PurchasePage = () => {
  const { processPurchase } = useGroceryStore();
  const { toast } = useToast();
  const [purchaseItems, setPurchaseItems] = useState<PurchaseTransactionItem[]>([]);
  const [supplier, setSupplier] = useState('');
  const [notes, setNotes] = useState('');

  const addToPurchase = (product: Product) => {
    const existingItem = purchaseItems.find(item => item.productId === product.id);
    
    if (existingItem) {
      setPurchaseItems(purchaseItems.map(item =>
        item.productId === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      const newItem: PurchaseTransactionItem = {
        productId: product.id,
        productName: product.name,
        quantity: 1,
        unit: product.unit,
      };
      setPurchaseItems([...purchaseItems, newItem]);
    }
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromPurchase(productId);
      return;
    }

    setPurchaseItems(purchaseItems.map(item =>
      item.productId === productId
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };

  const handleQuantityInputChange = (productId: string, value: string) => {
    const numValue = parseInt(value);
    if (isNaN(numValue) || numValue < 0) return;
    updateQuantity(productId, numValue);
  };

  const removeFromPurchase = (productId: string) => {
    setPurchaseItems(purchaseItems.filter(item => item.productId !== productId));
  };

  const handleCompletePurchase = () => {
    if (purchaseItems.length === 0) {
      toast({
        title: "خطأ",
        description: "يجب إضافة منتجات للشراء أولاً",
        variant: "destructive",
      });
      return;
    }

    processPurchase(purchaseItems, supplier, notes);
    setPurchaseItems([]);
    setSupplier('');
    setNotes('');
    
    toast({
      title: "تمت العملية بنجاح",
      description: `تم شراء ${purchaseItems.length} منتج بنجاح`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-right flex items-center space-x-2">
          <ShoppingBag className="h-6 w-6 text-[#388E3C]" />
          <span>عمليات الشراء</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* سلة الشراء - في الأعلى الآن */}
        <Card>
          <CardHeader>
            <CardTitle className="text-right flex items-center space-x-2">
              <Package className="h-5 w-5 text-[#388E3C]" />
              <span>سلة الشراء ({purchaseItems.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {purchaseItems.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p>لا توجد منتجات في سلة الشراء</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {purchaseItems.map((item) => (
                      <div
                        key={item.productId}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex-1 text-right">
                          <h4 className="font-medium">{item.productName}</h4>
                          <p className="text-sm text-muted-foreground">
                            الوحدة: {item.unit}
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleQuantityInputChange(item.productId, e.target.value)}
                            className="w-16 text-center text-sm"
                            min="1"
                            placeholder="الكمية"
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => removeFromPurchase(item.productId)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 space-y-4">
                    <div>
                      <Label htmlFor="notes" className="text-right">ملاحظات (اختياري)</Label>
                      <Textarea
                        id="notes"
                        placeholder="أضف ملاحظات على العملية..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="text-right"
                        rows={2}
                      />
                    </div>

                    <Button
                      onClick={handleCompletePurchase}
                      className="w-full bg-[#388E3C] hover:bg-[#2E7D32]"
                      size="lg"
                    >
                      إتمام الشراء
                    </Button>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* قائمة المنتجات - في الأسفل الآن */}
        <Card>
          <CardHeader>
            <CardTitle className="text-right flex items-center space-x-2">
              <Search className="h-5 w-5 text-[#388E3C]" />
              <span>اختيار المنتجات</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <QuickSearch 
              onProductSelect={addToPurchase}
              placeholder="ابحث بالاسم، الاختصار، أو استخدم البحث الصوتي"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PurchasePage;
