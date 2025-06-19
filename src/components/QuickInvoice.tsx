
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { useInvoiceStore } from '@/stores/useInvoiceStore';
import { useGroceryStore } from '@/stores/useGroceryStore';
import { useInvoiceVoiceSearch } from '@/hooks/useInvoiceVoiceSearch';
import { useToast } from '@/hooks/use-toast';
import { 
  Receipt, 
  Mic, 
  MicOff, 
  Plus, 
  Minus, 
  Trash2, 
  ShoppingCart,
  User,
  Calculator
} from 'lucide-react';

const QuickInvoice = () => {
  const { 
    currentInvoice, 
    createInvoice, 
    addItemToInvoice, 
    removeItemFromInvoice,
    updateItemQuantity,
    applyDiscount,
    completeInvoice,
    cancelInvoice,
    calculateInvoiceTotal,
    findProductByName
  } = useInvoiceStore();
  
  const { products } = useGroceryStore();
  const { toast } = useToast();
  
  const [discount, setDiscount] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState('');
  
  const {
    isListening,
    transcript,
    parsedItems,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
    error,
  } = useInvoiceVoiceSearch();

  useEffect(() => {
    if (!currentInvoice) {
      createInvoice();
    }
  }, [currentInvoice, createInvoice]);

  useEffect(() => {
    if (parsedItems.length > 0) {
      parsedItems.forEach(item => {
        const product = findProductByName(item.productName, products);
        if (product) {
          addItemToInvoice(product, item.quantity);
          toast({
            title: "تم إضافة المنتج",
            description: `${item.quantity} ${product.name}`,
          });
        } else {
          toast({
            title: "لم يتم العثور على المنتج",
            description: `"${item.productName}" غير موجود في المخزون`,
            variant: "destructive",
          });
        }
      });
      resetTranscript();
    }
  }, [parsedItems, products, addItemToInvoice, findProductByName, toast, resetTranscript]);

  useEffect(() => {
    if (error) {
      toast({
        title: "خطأ في الإدخال الصوتي",
        description: error,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const handleVoiceInput = () => {
    if (isListening) {
      stopListening();
    } else {
      resetTranscript();
      startListening();
    }
  };

  const handleDiscountChange = (value: string) => {
    setDiscount(value);
    const discountAmount = parseFloat(value) || 0;
    applyDiscount(discountAmount);
  };

  const handleCompleteInvoice = () => {
    if (!currentInvoice || currentInvoice.items.length === 0) {
      toast({
        title: "فاتورة فارغة",
        description: "يرجى إضافة منتجات قبل إتمام الفاتورة",
        variant: "destructive",
      });
      return;
    }

    completeInvoice(selectedCustomer || undefined);
    setDiscount('');
    setSelectedCustomer('');
    
    toast({
      title: "تم إتمام الفاتورة",
      description: `المجموع: ${currentInvoice.total.toLocaleString('ar-SY')} ل.س`,
    });
  };

  const handleCancelInvoice = () => {
    cancelInvoice();
    setDiscount('');
    setSelectedCustomer('');
    toast({
      title: "تم إلغاء الفاتورة",
      description: "تم إنشاء فاتورة جديدة",
    });
  };

  if (!currentInvoice) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="text-muted-foreground">جاري إنشاء فاتورة جديدة...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Voice Input Section */}
      <Card className="animate-fade-in-up">
        <CardHeader>
          <CardTitle className="text-right flex items-center space-x-3">
            <Receipt className="h-6 w-6 text-primary" />
            <span>الفاتورة السريعة</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isSupported && (
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <Button
                  variant={isListening ? "destructive" : "default"}
                  onClick={handleVoiceInput}
                  className="flex items-center space-x-2"
                >
                  {isListening ? (
                    <>
                      <MicOff className="h-4 w-4" />
                      <span>إيقاف التسجيل</span>
                    </>
                  ) : (
                    <>
                      <Mic className="h-4 w-4" />
                      <span>إضافة بالصوت</span>
                    </>
                  )}
                </Button>
                
                {isListening && (
                  <Badge variant="destructive" className="animate-pulse">
                    جاري التسجيل...
                  </Badge>
                )}
              </div>
              
              {transcript && (
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium">النص المُدخل: </span>
                  {transcript}
                </div>
              )}
              
              <div className="text-xs text-muted-foreground mt-2">
                مثال: "3 علب حليب، 2 خبز، 5 علب تونة"
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Current Invoice Items */}
      <Card className="animate-fade-in-up">
        <CardHeader>
          <CardTitle className="text-right flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ShoppingCart className="h-5 w-5 text-primary" />
              <span>عناصر الفاتورة</span>
            </div>
            <Badge variant="outline">
              {currentInvoice.items.length} منتج
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currentInvoice.items.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              لا توجد منتجات في الفاتورة
              <div className="text-sm mt-2">استخدم الإدخال الصوتي أو أضف المنتجات يدوياً</div>
            </div>
          ) : (
            <div className="space-y-3">
              {currentInvoice.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-card border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="font-medium">{item.productName}</div>
                    <div className="text-sm text-muted-foreground">
                      {item.unitPrice.toLocaleString('ar-SY')} ل.س × {item.quantity}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    
                    <span className="font-medium px-2">{item.quantity}</span>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                    
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeItemFromInvoice(item.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  <div className="font-bold text-lg ml-4">
                    {item.totalPrice.toLocaleString('ar-SY')} ل.س
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Invoice Summary and Actions */}
      {currentInvoice.items.length > 0 && (
        <Card className="animate-fade-in-up">
          <CardHeader>
            <CardTitle className="text-right flex items-center space-x-3">
              <Calculator className="h-5 w-5 text-primary" />
              <span>ملخص الفاتورة</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between text-lg">
                <span>المجموع الفرعي:</span>
                <span className="font-medium">
                  {currentInvoice.subtotal.toLocaleString('ar-SY')} ل.س
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="discount">الخصم (ل.س):</Label>
                <Input
                  id="discount"
                  type="number"
                  placeholder="0"
                  value={discount}
                  onChange={(e) => handleDiscountChange(e.target.value)}
                  className="w-32 text-right"
                  min="0"
                />
              </div>
              
              {currentInvoice.discount > 0 && (
                <div className="flex justify-between text-destructive">
                  <span>الخصم:</span>
                  <span>-{currentInvoice.discount.toLocaleString('ar-SY')} ل.س</span>
                </div>
              )}
              
              <div className="flex justify-between text-xl font-bold border-t pt-3">
                <span>المجموع النهائي:</span>
                <span className="text-primary">
                  {currentInvoice.total.toLocaleString('ar-SY')} ل.س
                </span>
              </div>
            </div>
            
            <div className="flex space-x-3 pt-4">
              <Button
                onClick={handleCompleteInvoice}
                className="flex-1"
                size="lg"
              >
                <Receipt className="h-4 w-4 mr-2" />
                إتمام الفاتورة
              </Button>
              
              <Button
                variant="outline"
                onClick={handleCancelInvoice}
                size="lg"
              >
                إلغاء
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QuickInvoice;
