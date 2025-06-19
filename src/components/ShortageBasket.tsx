
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useGroceryStore } from '@/stores/useGroceryStore';
import { 
  ShoppingCart, 
  Package, 
  Trash2, 
  Check, 
  Plus, 
  FileText, 
  MessageCircle, 
  Copy,
  Send,
  Users,
  Filter,
  CheckCircle2,
  X
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import QuickSearch from './QuickSearch';
import ContactSelector from './ContactSelector';
import { Product, Contact } from '@/types';
import ShortageItemRow from './ShortageItemRow';

const ShortageBasket = () => {
  const { 
    shortageItems, 
    products, 
    markAsSupplied, 
    removeFromShortage, 
    addToShortage 
  } = useGroceryStore();
  
  const [suppliedQuantities, setSuppliedQuantities] = useState<{ [key: string]: string }>({});
  const [newShortageProduct, setNewShortageProduct] = useState('');
  const [newShortageQuantity, setNewShortageQuantity] = useState('');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [supplierName, setSupplierName] = useState('');
  const [supplierPhone, setSupplierPhone] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [orderNotes, setOrderNotes] = useState('');
  const [showOrderDialog, setShowOrderDialog] = useState(false);
  const { toast } = useToast();
  const [selectedProductName, setSelectedProductName] = useState('');

  const availableProducts = products.filter(
    product => !shortageItems.some(item => item.productId === product.id)
  );

  // Get unique categories from shortage items
  const categories = Array.from(new Set(
    shortageItems.map(item => {
      const product = products.find(p => p.id === item.productId);
      return product?.category || 'غير محدد';
    })
  ));

  // Filter items by category
  const filteredItems = categoryFilter === 'all' 
    ? shortageItems 
    : shortageItems.filter(item => {
        const product = products.find(p => p.id === item.productId);
        return product?.category === categoryFilter;
      });

  const handleQuantityChange = (shortageId: string, value: string) => {
    setSuppliedQuantities(prev => ({ ...prev, [shortageId]: value }));
  };

  const handleMarkAsSupplied = (shortageId: string, productName: string) => {
    const newQuantity = parseFloat(suppliedQuantities[shortageId] || '0');
    
    if (isNaN(newQuantity) || newQuantity < 0) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال كمية صحيحة",
        variant: "destructive",
      });
      return;
    }

    markAsSupplied(shortageId, newQuantity);
    setSuppliedQuantities(prev => ({ ...prev, [shortageId]: '' }));
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      newSet.delete(shortageId);
      return newSet;
    });
    
    toast({
      title: "تم التوريد",
      description: `تم تحديث كمية "${productName}" بنجاح`,
    });
  };

  const handleRemoveFromShortage = (shortageId: string, productName: string) => {
    removeFromShortage(shortageId);
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      newSet.delete(shortageId);
      return newSet;
    });
    toast({
      title: "تم الحذف",
      description: `تم حذف "${productName}" من سلة النواقص`,
    });
  };

  const handleAddManualShortage = () => {
    if (!newShortageProduct || !newShortageQuantity) {
      toast({
        title: "خطأ",
        description: "يرجى اختيار المنتج وإدخال الكمية المطلوبة",
        variant: "destructive",
      });
      return;
    }

    const quantity = parseFloat(newShortageQuantity);
    if (isNaN(quantity) || quantity <= 0) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال كمية صحيحة",
        variant: "destructive",
      });
      return;
    }

    addToShortage(newShortageProduct, quantity, true);
    setNewShortageProduct('');
    setNewShortageQuantity('');
    setSelectedProductName('');
    
    const product = products.find(p => p.id === newShortageProduct);
    toast({
      title: "تم الإضافة",
      description: `تم إضافة "${product?.name}" إلى سلة النواقص`,
    });
  };

  const handleProductSelection = (product: Product) => {
    setNewShortageProduct(product.id);
    setSelectedProductName(product.name);
  };
  
  const handleClearSelection = () => {
    setNewShortageProduct('');
    setSelectedProductName('');
  };

  const handleSelectItem = (itemId: string, checked: boolean) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(itemId);
      } else {
        newSet.delete(itemId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedItems.size === filteredItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(filteredItems.map(item => item.id)));
    }
  };

  const generateOrderText = () => {
    const selectedShortageItems = shortageItems.filter(item => selectedItems.has(item.id));
    
    if (selectedShortageItems.length === 0) {
      return '';
    }

    const storeName = "بقالة الذكية";
    const date = new Date().toLocaleDateString('ar-SA');
    
    let orderText = `🛒 *طلبية جديدة من ${storeName}*\n\n`;
    orderText += `📅 التاريخ: ${date}\n`;
    if (supplierName) {
      orderText += `👤 المورد: ${supplierName}\n`;
    }
    orderText += `\n📋 *قائمة المنتجات المطلوبة:*\n\n`;

    selectedShortageItems.forEach((item, index) => {
      orderText += `${index + 1}. *${item.productName}*\n`;
      orderText += `   📦 الكمية المطلوبة: ${item.requestedQuantity} ${item.unit}\n`;
      orderText += `   📊 الكمية الحالية: ${item.currentQuantity} ${item.unit}\n\n`;
    });

    if (orderNotes) {
      orderText += `📝 *ملاحظات إضافية:*\n${orderNotes}\n\n`;
    }

    orderText += `📞 للتواصل والاستفسار يرجى الرد على هذه الرسالة\n`;
    orderText += `شكراً لحسن تعاونكم 🙏`;

    return orderText;
  };

  const handleSendWhatsApp = () => {
    if (selectedItems.size === 0) {
      toast({
        title: "تنبيه",
        description: "يرجى تحديد منتجات للإرسال",
        variant: "destructive",
      });
      return;
    }

    const phoneNumber = selectedContact ? selectedContact.phone : supplierPhone;
    if (!phoneNumber) {
      toast({
        title: "تنبيه",
        description: "يرجى إدخال رقم المورد أو اختيار جهة اتصال",
        variant: "destructive",
      });
      return;
    }

    const orderText = generateOrderText();
    const encodedText = encodeURIComponent(orderText);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedText}`;
    
    window.open(whatsappUrl, '_blank');
    setShowOrderDialog(false);
    
    toast({
      title: "تم فتح الواتس اب",
      description: "تم إعداد الرسالة وفتح الواتس اب",
    });
  };

  const handleCopyText = () => {
    if (selectedItems.size === 0) {
      toast({
        title: "تنبيه",
        description: "يرجى تحديد منتجات للنسخ",
        variant: "destructive",
      });
      return;
    }

    const orderText = generateOrderText();
    navigator.clipboard.writeText(orderText).then(() => {
      setShowOrderDialog(false);
      toast({
        title: "تم النسخ",
        description: "تم نسخ نص الطلبية للحافظة",
      });
    }).catch(() => {
      toast({
        title: "خطأ",
        description: "لم يتم النسخ، يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    });
  };

  const generateShortageReport = () => {
    const reportText = shortageItems.map(item => 
      `${item.productName}: ${item.requestedQuantity} ${item.unit}`
    ).join('\n');
    
    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `قائمة-النواقص-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "تم التصدير",
      description: "تم تصدير قائمة النواقص بنجاح",
    });
  };

  return (
    <div className="space-y-6 max-w-full overflow-hidden">
      {/* Header Section */}
      <Card className="animate-fade-in-up border-border/40 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-3">
              <ShoppingCart className="h-6 w-6 text-[#388E3C]" />
              <span className="text-xl">سلة النواقص</span>
              {shortageItems.length > 0 && (
                <Badge variant="destructive" className="font-bold">
                  {shortageItems.length}
                </Badge>
              )}
            </div>
            
            <div className="flex items-center space-x-2 flex-wrap">
              {selectedItems.size > 0 && (
                <Badge variant="secondary" className="text-sm">
                  {selectedItems.size} محدد
                </Badge>
              )}
              
              {shortageItems.length > 0 && (
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={generateShortageReport}
                    className="flex items-center space-x-1"
                  >
                    <FileText className="h-4 w-4" />
                    <span>تصدير</span>
                  </Button>
                  
                  <Dialog open={showOrderDialog} onOpenChange={setShowOrderDialog}>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        disabled={selectedItems.size === 0}
                        className="flex items-center space-x-1 bg-[#388E3C] hover:bg-[#2E7D32]"
                      >
                        <Send className="h-4 w-4" />
                        <span>إرسال طلبية</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                      <DialogHeader>
                        <DialogTitle className="flex items-center space-x-2">
                          <MessageCircle className="h-5 w-5 text-[#388E3C]" />
                          <span>إرسال طلبية للمورد</span>
                        </DialogTitle>
                        <DialogDescription>
                          املأ بيانات المورد لإرسال الطلبية عبر الواتس اب أو نسخ النص
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">اسم المورد</label>
                          <Input
                            placeholder="اسم المورد"
                            value={supplierName}
                            onChange={(e) => setSupplierName(e.target.value)}
                          />
                        </div>
                        
                        <ContactSelector
                          selectedContact={selectedContact}
                          onContactSelect={setSelectedContact}
                          manualPhone={supplierPhone}
                          onManualPhoneChange={setSupplierPhone}
                        />
                        
                        <div>
                          <label className="text-sm font-medium mb-2 block">ملاحظات إضافية</label>
                          <Textarea
                            placeholder="ملاحظات أو تعليمات خاصة..."
                            value={orderNotes}
                            onChange={(e) => setOrderNotes(e.target.value)}
                            className="min-h-20"
                          />
                        </div>
                      </div>
                      
                      <DialogFooter className="flex space-x-2">
                        <Button
                          variant="outline"
                          onClick={handleCopyText}
                          className="flex items-center space-x-1"
                        >
                          <Copy className="h-4 w-4" />
                          <span>نسخ النص</span>
                        </Button>
                        <Button
                          onClick={handleSendWhatsApp}
                          className="flex items-center space-x-1 bg-green-600 hover:bg-green-700"
                        >
                          <MessageCircle className="h-4 w-4" />
                          <span>إرسال واتس اب</span>
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Add Manual Shortage */}
          <Card className="border-dashed border-2 border-[#388E3C]/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center space-x-2">
                <Plus className="h-4 w-4 text-[#388E3C]" />
                <span>إضافة منتج للنواقص</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* QuickSearch Field - Now First */}
                <div className="flex-1 min-w-0">
                  {!newShortageProduct ? (
                    <QuickSearch
                      onProductSelect={handleProductSelection}
                      productsToSearch={availableProducts}
                      placeholder="ابحث بالاسم، الاختصار، أو الصوت..."
                    />
                  ) : (
                    <div className="flex items-center justify-between p-2 border rounded-md bg-muted/50 h-10">
                      <span className="font-medium truncate">{selectedProductName}</span>
                      <Button variant="ghost" size="icon" className="h-6 w-6 flex-shrink-0" onClick={handleClearSelection}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
                
                {/* Quantity Field - Now Second */}
                <div className="flex items-end space-x-2 gap-2">
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="الكمية المطلوبة"
                    value={newShortageQuantity}
                    onChange={(e) => setNewShortageQuantity(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleAddManualShortage}
                    disabled={!newShortageProduct || !newShortageQuantity}
                    className="flex items-center space-x-1 bg-[#388E3C] hover:bg-[#2E7D32] px-6"
                  >
                    <Plus className="h-4 w-4" />
                    <span>إضافة</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Filters and Controls */}
          {shortageItems.length > 0 && (
            <div className="flex items-center justify-between flex-wrap gap-4 p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الفئات</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAll}
                  className="flex items-center space-x-1"
                >
                  {selectedItems.size === filteredItems.length && filteredItems.length > 0 ? (
                    <>
                      <X className="h-4 w-4" />
                      <span>إلغاء الكل</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      <span>تحديد الكل</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Shortage Items */}
          {filteredItems.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Package className="h-16 w-16 mx-auto mb-4 opacity-40" />
              <h3 className="text-lg font-medium mb-2">
                {categoryFilter === 'all' ? 'لا توجد منتجات في سلة النواقص' : 'لا توجد منتجات في هذه الفئة'}
              </h3>
              <p className="text-sm">
                {categoryFilter === 'all' 
                  ? 'سيتم إضافة المنتجات تلقائياً عند وصولها للحد الأدنى' 
                  : 'جرب فئة أخرى أو أضف منتجات يدوياً'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredItems.map((item) => {
                const product = products.find(p => p.id === item.productId);
                const isSelected = selectedItems.has(item.id);
                
                return (
                  <ShortageItemRow
                    key={item.id}
                    item={item}
                    product={product}
                    isSelected={isSelected}
                    suppliedQuantity={suppliedQuantities[item.id] || ''}
                    onSelectItem={handleSelectItem}
                    onQuantityChange={handleQuantityChange}
                    onMarkAsSupplied={handleMarkAsSupplied}
                    onRemoveFromShortage={handleRemoveFromShortage}
                  />
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ShortageBasket;
