import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useGroceryStore } from '@/stores/useGroceryStore';
import { Package, Plus, Calendar, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Product, Currency, ProfitType } from '@/types';
import { useIsMobile } from '@/hooks/use-mobile';

interface ProductFormProps {
  onSuccess?: () => void;
  editingProduct?: Product | null;
  onCancel?: () => void;
}

const ProductForm = ({ onSuccess, editingProduct, onCancel }: ProductFormProps) => {
  const { addProduct, updateProduct, units, currentExchangeRate } = useGroceryStore();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const [formData, setFormData] = useState({
    name: editingProduct?.name || '',
    purchasePrice: editingProduct?.purchasePrice?.toString() || editingProduct?.originalPurchasePriceSAR?.toString() || '',
    purchaseCurrency: (editingProduct?.purchaseCurrency || 'SAR') as Currency,
    profitType: (editingProduct?.profitType || 'percentage') as ProfitType,
    profitValue: editingProduct?.profitValue?.toString() || editingProduct?.profitMargin?.toString() || '',
    profitCurrency: (editingProduct?.profitCurrency || 'YER') as Currency,
    unit: editingProduct?.unit || '',
    currentQuantity: editingProduct?.currentQuantity?.toString() || '',
    minimumQuantity: editingProduct?.minimumQuantity?.toString() || '',
    category: editingProduct?.category || '',
    description: editingProduct?.description || '',
    expiryDate: editingProduct?.expiryDate ? editingProduct.expiryDate.toISOString().split('T')[0] : '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.name || !formData.purchasePrice || !formData.profitValue || !formData.unit) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    const purchasePrice = parseFloat(formData.purchasePrice);
    const profitValue = parseFloat(formData.profitValue);

    const productData = {
      name: formData.name,
      purchasePrice,
      purchaseCurrency: formData.purchaseCurrency,
      profitType: formData.profitType,
      profitValue,
      profitCurrency: formData.profitCurrency,
      unit: formData.unit,
      currentQuantity: parseInt(formData.currentQuantity) || 0,
      minimumQuantity: parseInt(formData.minimumQuantity) || 0,
      category: formData.category,
      description: formData.description,
      expiryDate: formData.expiryDate ? new Date(formData.expiryDate) : undefined,
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
      toast({
        title: "تم تحديث المنتج",
        description: `تم تحديث "${formData.name}" بنجاح`,
      });
    } else {
      addProduct(productData);
      toast({
        title: "تم إضافة المنتج",
        description: `تم إضافة "${formData.name}" بنجاح`,
      });
    }

    // Reset form if adding new product
    if (!editingProduct) {
      setFormData({
        name: '',
        purchasePrice: '',
        purchaseCurrency: 'SAR',
        profitType: 'percentage',
        profitValue: '',
        profitCurrency: 'YER',
        unit: '',
        currentQuantity: '',
        minimumQuantity: '',
        category: '',
        description: '',
        expiryDate: '',
      });
    }

    setIsSubmitting(false);
    onSuccess?.();
  };

  const calculateSellingPrice = () => {
    const purchasePrice = parseFloat(formData.purchasePrice) || 0;
    const profitValue = parseFloat(formData.profitValue) || 0;
    
    if (!purchasePrice || !profitValue) return 0;

    // تحويل سعر الشراء إلى ريال يمني
    let purchasePriceYER = purchasePrice;
    if (formData.purchaseCurrency === 'SAR') {
      purchasePriceYER = purchasePrice * currentExchangeRate;
    }

    // حساب هامش الربح
    let profitYER = profitValue;
    if (formData.profitType === 'percentage') {
      profitYER = (purchasePriceYER * profitValue) / 100;
    } else if (formData.profitCurrency === 'SAR') {
      profitYER = profitValue * currentExchangeRate;
    }

    return purchasePriceYER + profitYER;
  };

  const selectedUnit = units.find(u => u.name === formData.unit);
  const currentSellingPrice = calculateSellingPrice();

  return (
    <div className={`${isMobile ? 'h-full pb-6' : ''}`}>
      <Card className={`${isMobile ? 'border-0 shadow-none h-full' : 'animate-fade-in-up'}`}>
        <CardHeader className={`${isMobile ? 'px-4 py-2' : 'px-6 py-4'}`}>
          <CardTitle className={`flex items-center space-x-2 text-right ${isMobile ? 'text-base' : 'text-xl'}`}>
            <Package className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-[#388E3C]`} />
            <span>{editingProduct ? 'تعديل المنتج' : 'إضافة منتج جديد'}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className={`${isMobile ? 'px-4 py-2' : 'px-6 py-4'}`}>
          <form onSubmit={handleSubmit} className={`space-y-${isMobile ? '3' : '4'}`}>
            {/* معلومات أساسية */}
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="name" className={`text-right ${isMobile ? 'text-sm' : ''}`}>اسم المنتج *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="أدخل اسم المنتج"
                  className={`text-right ${isMobile ? 'h-10 text-sm' : ''}`}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="unit" className={`text-right ${isMobile ? 'text-sm' : ''}`}>الوحدة *</Label>
                  <Select value={formData.unit} onValueChange={(value) => setFormData(prev => ({ ...prev, unit: value }))}>
                    <SelectTrigger className={`text-right ${isMobile ? 'h-10 text-sm' : ''}`}>
                      <SelectValue placeholder="اختر الوحدة" />
                    </SelectTrigger>
                    <SelectContent>
                      {units.map((unit) => (
                        <SelectItem key={unit.id} value={unit.name}>
                          <div className="flex items-center justify-between w-full">
                            <span className={isMobile ? 'text-sm' : ''}>{unit.name}</span>
                            {unit.hasCustomQuantity && (
                              <span className={`text-xs text-muted-foreground ${isMobile ? 'text-xs' : ''}`}>
                                ({unit.baseQuantity} {unit.baseUnit})
                              </span>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category" className={`text-right ${isMobile ? 'text-sm' : ''}`}>الفئة</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    placeholder="مثال: مواد غذائية"
                    className={`text-right ${isMobile ? 'h-10 text-sm' : ''}`}
                  />
                </div>
              </div>
            </div>

            {/* معلومات التسعير */}
            <div className="border-t pt-3">
              <h3 className={`${isMobile ? 'text-sm' : 'text-lg'} font-semibold text-right mb-3 flex items-center space-x-2`}>
                <DollarSign className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-[#388E3C]`} />
                <span>معلومات التسعير</span>
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className={`text-right ${isMobile ? 'text-sm' : ''}`}>عملة الشراء *</Label>
                  <Select value={formData.purchaseCurrency} onValueChange={(value: Currency) => setFormData(prev => ({ ...prev, purchaseCurrency: value }))}>
                    <SelectTrigger className={`text-right ${isMobile ? 'h-10 text-sm' : ''}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SAR">ريال سعودي</SelectItem>
                      <SelectItem value="YER">ريال يمني</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="purchasePrice" className={`text-right ${isMobile ? 'text-sm' : ''}`}>سعر الشراء *</Label>
                  <Input
                    id="purchasePrice"
                    type="number"
                    step="0.01"
                    value={formData.purchasePrice}
                    onChange={(e) => setFormData(prev => ({ ...prev, purchasePrice: e.target.value }))}
                    placeholder="0.00"
                    className={`text-right ${isMobile ? 'h-10 text-sm' : ''}`}
                    required
                  />
                </div>

                {/* نوع هامش الربح */}
                <div className="col-span-2 space-y-2">
                  <Label className={`text-right ${isMobile ? 'text-sm' : ''}`}>نوع هامش الربح *</Label>
                  <RadioGroup 
                    value={formData.profitType} 
                    onValueChange={(value: ProfitType) => setFormData(prev => ({ ...prev, profitType: value }))}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="percentage" id="percentage" />
                      <Label htmlFor="percentage" className={`text-right ${isMobile ? 'text-sm' : ''}`}>نسبة مئوية (%)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="fixed" id="fixed" />
                      <Label htmlFor="fixed" className={`text-right ${isMobile ? 'text-sm' : ''}`}>مبلغ ثابت</Label>
                    </div>
                  </RadioGroup>
                </div>

                {formData.profitType === 'fixed' && (
                  <div className="space-y-2">
                    <Label className={`text-right ${isMobile ? 'text-sm' : ''}`}>عملة الربح</Label>
                    <Select value={formData.profitCurrency} onValueChange={(value: Currency) => setFormData(prev => ({ ...prev, profitCurrency: value }))}>
                      <SelectTrigger className={`text-right ${isMobile ? 'h-10 text-sm' : ''}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SAR">ريال سعودي</SelectItem>
                        <SelectItem value="YER">ريال يمني</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="profitValue" className={`text-right ${isMobile ? 'text-sm' : ''}`}>
                    {formData.profitType === 'percentage' ? 'نسبة الربح (%)' : 'مبلغ الربح'} *
                  </Label>
                  <Input
                    id="profitValue"
                    type="number"
                    step="0.01"
                    value={formData.profitValue}
                    onChange={(e) => setFormData(prev => ({ ...prev, profitValue: e.target.value }))}
                    placeholder={formData.profitType === 'percentage' ? '10' : '0.00'}
                    className={`text-right ${isMobile ? 'h-10 text-sm' : ''}`}
                    required
                  />
                </div>

                {/* سعر البيع المحسوب */}
                <div className="col-span-2 space-y-2">
                  <Label className={`text-right ${isMobile ? 'text-sm' : ''}`}>سعر البيع المحسوب (ريال يمني)</Label>
                  <div className={`p-2 bg-muted rounded-md ${isMobile ? 'p-2' : ''}`}>
                    <span className={`${isMobile ? 'text-sm' : 'text-lg'} font-semibold text-[#388E3C]`}>
                      {currentSellingPrice.toLocaleString('ar-YE')} ر.ي
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* معلومات المخزون */}
            <div className="border-t pt-3">
              <h3 className={`${isMobile ? 'text-sm' : 'text-lg'} font-semibold text-right mb-3`}>معلومات المخزون</h3>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="currentQuantity" className={`text-right ${isMobile ? 'text-sm' : ''}`}>الكمية الحالية</Label>
                  <Input
                    id="currentQuantity"
                    type="number"
                    value={formData.currentQuantity}
                    onChange={(e) => setFormData(prev => ({ ...prev, currentQuantity: e.target.value }))}
                    placeholder="0"
                    className={`text-right ${isMobile ? 'h-10 text-sm' : ''}`}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="minimumQuantity" className={`text-right ${isMobile ? 'text-sm' : ''}`}>الحد الأدنى</Label>
                  <Input
                    id="minimumQuantity"
                    type="number"
                    value={formData.minimumQuantity}
                    onChange={(e) => setFormData(prev => ({ ...prev, minimumQuantity: e.target.value }))}
                    placeholder="0"
                    className={`text-right ${isMobile ? 'h-10 text-sm' : ''}`}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expiryDate" className={`text-right flex items-center space-x-1 ${isMobile ? 'text-sm' : ''}`}>
                    <Calendar className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
                    <span>تاريخ انتهاء الصلاحية</span>
                  </Label>
                  <Input
                    id="expiryDate"
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
                    className={`text-right ${isMobile ? 'h-10 text-sm' : ''}`}
                  />
                </div>
              </div>
            </div>

            {/* الوصف */}
            <div className="space-y-2">
              <Label htmlFor="description" className={`text-right ${isMobile ? 'text-sm' : ''}`}>الوصف</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="وصف إضافي للمنتج"
                className={`text-right ${isMobile ? 'text-sm min-h-[60px]' : ''}`}
                rows={isMobile ? 2 : 3}
              />
            </div>

            {/* أزرار التحكم */}
            <div className={`pt-4 border-t ${isMobile ? 'pb-20' : ''}`}>
              <div className="flex gap-3">
                <Button 
                  type="submit"
                  className={`flex-1 bg-[#388E3C] hover:bg-[#2E7D32] ${isMobile ? 'h-12 text-base' : ''}`}
                  disabled={isSubmitting}
                >
                  <Plus className={`${isMobile ? 'h-4 w-4' : 'h-4 w-4'} ml-2`} />
                  {isSubmitting ? 'جاري الحفظ...' : (editingProduct ? 'تحديث المنتج' : 'إضافة المنتج')}
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={onCancel}
                  className={`flex-1 ${isMobile ? 'h-12 text-base' : ''}`}
                >
                  إلغاء
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductForm;
