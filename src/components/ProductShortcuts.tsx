
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGroceryStore } from '@/stores/useGroceryStore';
import { Hash, Save, X, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

const ProductShortcuts = () => {
  const { products, updateProduct } = useGroceryStore();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [shortcuts, setShortcuts] = useState<Record<string, number>>({});

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleShortcutChange = (productId: string, value: string) => {
    const num = parseInt(value);
    if (value === '' || (num >= 1 && num <= 999)) {
      setShortcuts(prev => ({
        ...prev,
        [productId]: num || 0
      }));
    }
  };

  const handleSaveShortcut = (productId: string) => {
    const shortcutNum = shortcuts[productId];
    if (!shortcutNum || shortcutNum < 1 || shortcutNum > 999) return;

    // Check if shortcut already exists
    const existingProduct = products.find(p => p.shortcutNumber === shortcutNum && p.id !== productId);
    if (existingProduct) {
      toast({
        title: "خطأ",
        description: `الرقم ${shortcutNum} مستخدم بالفعل للمنتج "${existingProduct.name}"`,
        variant: "destructive"
      });
      return;
    }

    updateProduct(productId, { shortcutNumber: shortcutNum });
    setShortcuts(prev => {
      const newShortcuts = { ...prev };
      delete newShortcuts[productId];
      return newShortcuts;
    });

    toast({
      title: "تم الحفظ",
      description: `تم حفظ الاختصار ${shortcutNum} للمنتج`,
    });
  };

  const handleRemoveShortcut = (productId: string) => {
    updateProduct(productId, { shortcutNumber: undefined });
    toast({
      title: "تم الحذف",
      description: "تم حذف الاختصار",
    });
  };

  const getUsedShortcuts = () => {
    return products.filter(p => p.shortcutNumber).map(p => p.shortcutNumber);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-right">إدارة اختصارات المنتجات</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-right flex items-center space-x-2">
            <Hash className="h-5 w-5 text-[#388E3C]" />
            <span>اختصارات البحث السريع</span>
          </CardTitle>
          <p className="text-sm text-muted-foreground text-right">
            قم بتعيين أرقام (1-999) للمنتجات للبحث السريع أثناء عمليات البيع والشراء
          </p>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="البحث في المنتجات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 text-right"
            />
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid gap-4">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/20 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-medium truncate">{product.name}</h3>
                    {product.category && (
                      <Badge variant="outline" className="text-xs">
                        {product.category}
                      </Badge>
                    )}
                    {product.shortcutNumber && (
                      <Badge className="bg-[#388E3C] text-white flex items-center space-x-1">
                        <Hash className="h-3 w-3" />
                        <span>{product.shortcutNumber}</span>
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    المخزون: {product.currentQuantity} {product.unit}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  {product.shortcutNumber ? (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">
                        الاختصار: {product.shortcutNumber}
                      </span>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleRemoveShortcut(product.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Input
                        type="number"
                        placeholder="رقم"
                        min="1"
                        max="999"
                        className="w-20 text-center"
                        value={shortcuts[product.id] || ''}
                        onChange={(e) => handleShortcutChange(product.id, e.target.value)}
                      />
                      <Button
                        size="sm"
                        onClick={() => handleSaveShortcut(product.id)}
                        disabled={!shortcuts[product.id] || shortcuts[product.id] < 1}
                        className="bg-[#388E3C] hover:bg-[#2E7D32]"
                      >
                        <Save className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {filteredProducts.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Hash className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <p>لا توجد منتجات تطابق البحث</p>
              </div>
            )}
          </div>

          {products.length > 0 && (
            <div className="mt-6 p-4 bg-muted/30 rounded-lg">
              <h4 className="font-medium mb-2 text-right">الاختصارات المستخدمة:</h4>
              <div className="flex flex-wrap gap-2">
                {getUsedShortcuts().map(shortcut => (
                  <Badge key={shortcut} variant="outline">
                    {shortcut}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductShortcuts;
