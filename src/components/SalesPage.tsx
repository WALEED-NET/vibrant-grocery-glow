
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useGroceryStore } from '@/stores/useGroceryStore';
import { useToast } from '@/hooks/use-toast';
import { TrendingUp, ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';
import { SaleTransactionItem } from '@/types';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import QuickSearch from './QuickSearch';

const SalesPage = () => {
  const { products, processSale } = useGroceryStore();
  const { toast } = useToast();
  const [saleItems, setSaleItems] = useState<SaleTransactionItem[]>([]);
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'credit'>('cash');

  const filteredProducts = products.filter(product => product.currentQuantity > 0);

  const addToSale = (product: any) => {
    const existingItem = saleItems.find(item => item.productId === product.id);
    
    if (existingItem) {
      if (existingItem.quantity < product.currentQuantity) {
        setSaleItems(saleItems.map(item =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ));
      } else {
        toast({
          title: "تحذير",
          description: "الكمية المطلوبة تتجاوز المخزون المتاح",
          variant: "destructive",
        });
      }
    } else {
      const newItem: SaleTransactionItem = {
        productId: product.id,
        productName: product.name,
        quantity: 1,
        unit: product.unit,
      };
      setSaleItems([...saleItems, newItem]);
    }
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    if (newQuantity <= 0) {
      removeFromSale(productId);
      return;
    }

    if (newQuantity > product.currentQuantity) {
      toast({
        title: "تحذير",
        description: "الكمية المطلوبة تتجاوز المخزون المتاح",
        variant: "destructive",
      });
      return;
    }

    setSaleItems(saleItems.map(item =>
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

  const removeFromSale = (productId: string) => {
    setSaleItems(saleItems.filter(item => item.productId !== productId));
  };

  const handleCompleteSale = () => {
    if (saleItems.length === 0) {
      toast({
        title: "خطأ",
        description: "يجب إضافة منتجات للبيع أولاً",
        variant: "destructive",
      });
      return;
    }

    const finalNotes = paymentMethod === 'credit' 
      ? `نوع الدفع: آجل.\n${notes}`
      : notes;
      
    processSale(saleItems, finalNotes);

    setSaleItems([]);
    setNotes('');
    setPaymentMethod('cash');
    
    toast({
      title: "تمت العملية بنجاح",
      description: `تم بيع ${saleItems.length} منتج بنجاح`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-right flex items-center space-x-2">
          <TrendingUp className="h-6 w-6 text-[#388E3C]" />
          <span>عمليات البيع</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* سلة البيع */}
        <Card>
          <CardHeader>
            <CardTitle className="text-right flex items-center space-x-2">
              <ShoppingCart className="h-5 w-5 text-[#388E3C]" />
              <span>سلة البيع ({saleItems.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {saleItems.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p>لا توجد منتجات في سلة البيع</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {saleItems.map((item) => (
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
                            max={products.find(p => p.id === item.productId)?.currentQuantity || 1}
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
                            onClick={() => removeFromSale(item.productId)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4">
                    <div className="space-y-4">
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
                      
                      <div>
                        <Label className="text-right mb-2 block">طريقة الدفع</Label>
                        <RadioGroup 
                          dir="rtl"
                          value={paymentMethod} 
                          onValueChange={(value) => setPaymentMethod(value as 'cash' | 'credit')} 
                          className="flex items-center space-x-4 space-x-reverse"
                        >
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <RadioGroupItem value="cash" id="r-cash" />
                            <Label htmlFor="r-cash">نقداً</Label>
                          </div>
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <RadioGroupItem value="credit" id="r-credit" />
                            <Label htmlFor="r-credit">آجل</Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <Button
                        onClick={handleCompleteSale}
                        className="w-full bg-[#388E3C] hover:bg-[#2E7D32]"
                        size="lg"
                      >
                        إتمام البيع
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* قائمة المنتجات مع البحث المتقدم */}
        <Card>
          <CardHeader>
            <CardTitle className="text-right">اختيار المنتجات</CardTitle>
            <div className="space-y-4">
              <QuickSearch
                onProductSelect={addToSale}
                productsToSearch={filteredProducts}
                placeholder="ابحث بالاسم، الاختصار، أو الصوت..."
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                >
                  <div className="flex-1 text-right">
                    <h4 className="font-medium">{product.name}</h4>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Badge variant="outline">{product.currentQuantity} {product.unit}</Badge>
                      {product.shortcutNumber && (
                        <Badge variant="secondary" className="bg-[#388E3C]/10 text-[#388E3C]">
                          #{product.shortcutNumber}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => addToSale(product)}
                    className="bg-[#388E3C] hover:bg-[#2E7D32]"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SalesPage;
