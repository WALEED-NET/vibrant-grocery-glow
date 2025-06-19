
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGroceryStore } from '@/stores/useGroceryStore';
import { Trash2, Plus, Ruler, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const UnitsManagerPage = () => {
  const { units, addUnit, deleteUnit, updateUnit } = useGroceryStore();
  const [newUnitData, setNewUnitData] = useState({
    name: '',
    hasCustomQuantity: false,
    baseQuantity: '',
    baseUnit: '',
  });
  const [editingUnit, setEditingUnit] = useState<string | null>(null);
  const { toast } = useToast();

  const handleAddUnit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newUnitData.name.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال اسم الوحدة",
        variant: "destructive",
      });
      return;
    }

    if (units.some(unit => unit.name === newUnitData.name.trim())) {
      toast({
        title: "خطأ",
        description: "هذه الوحدة موجودة بالفعل",
        variant: "destructive",
      });
      return;
    }

    if (newUnitData.hasCustomQuantity && (!newUnitData.baseQuantity || !newUnitData.baseUnit)) {
      toast({
        title: "خطأ",
        description: "يرجى تحديد الكمية والوحدة الأساسية",
        variant: "destructive",
      });
      return;
    }

    addUnit(
      newUnitData.name.trim(),
      newUnitData.hasCustomQuantity,
      newUnitData.hasCustomQuantity ? parseInt(newUnitData.baseQuantity) : undefined,
      newUnitData.hasCustomQuantity ? newUnitData.baseUnit : undefined
    );
    
    setNewUnitData({
      name: '',
      hasCustomQuantity: false,
      baseQuantity: '',
      baseUnit: '',
    });
    
    toast({
      title: "تم بنجاح",
      description: `تم إضافة الوحدة "${newUnitData.name}" بنجاح`,
    });
  };

  const handleDeleteUnit = (id: string, name: string) => {
    const success = deleteUnit(id);
    
    if (success) {
      toast({
        title: "تم الحذف",
        description: `تم حذف الوحدة "${name}" بنجاح`,
      });
    } else {
      toast({
        title: "لا يمكن الحذف",
        description: `لا يمكن حذف الوحدة "${name}" لأنها مستخدمة في منتجات موجودة`,
        variant: "destructive",
      });
    }
  };

  const baseUnits = units.filter(unit => !unit.hasCustomQuantity);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-right">إدارة الوحدات القياسية</h1>
      
      {/* Add New Unit Form */}
      <Card className="animate-fade-in-up">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-right">
            <Ruler className="h-5 w-5 text-[#388E3C]" />
            <span>إضافة وحدة جديدة</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddUnit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="unitName" className="text-right">اسم الوحدة *</Label>
                <Input
                  id="unitName"
                  value={newUnitData.name}
                  onChange={(e) => setNewUnitData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="مثال: كرتون"
                  className="text-right"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-right">تخصيص حسب المنتج</Label>
                <div className="flex items-center space-x-2 justify-end">
                  <Switch
                    checked={newUnitData.hasCustomQuantity}
                    onCheckedChange={(checked) => setNewUnitData(prev => ({ 
                      ...prev, 
                      hasCustomQuantity: checked,
                      baseQuantity: checked ? prev.baseQuantity : '',
                      baseUnit: checked ? prev.baseUnit : '',
                    }))}
                  />
                  <span className="text-sm text-muted-foreground">
                    {newUnitData.hasCustomQuantity ? 'مفعل' : 'غير مفعل'}
                  </span>
                </div>
              </div>

              {newUnitData.hasCustomQuantity && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="baseQuantity" className="text-right">الكمية الأساسية *</Label>
                    <Input
                      id="baseQuantity"
                      type="number"
                      value={newUnitData.baseQuantity}
                      onChange={(e) => setNewUnitData(prev => ({ ...prev, baseQuantity: e.target.value }))}
                      placeholder="مثال: 24"
                      className="text-right"
                      required={newUnitData.hasCustomQuantity}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="baseUnit" className="text-right">الوحدة الأساسية *</Label>
                    <Select 
                      value={newUnitData.baseUnit} 
                      onValueChange={(value) => setNewUnitData(prev => ({ ...prev, baseUnit: value }))}
                    >
                      <SelectTrigger className="text-right">
                        <SelectValue placeholder="اختر الوحدة الأساسية" />
                      </SelectTrigger>
                      <SelectContent>
                        {baseUnits.map((unit) => (
                          <SelectItem key={unit.id} value={unit.name}>
                            {unit.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </div>

            <Button type="submit" className="w-full bg-[#388E3C] hover:bg-[#2E7D32]">
              <Plus className="h-4 w-4 mr-2" />
              إضافة الوحدة
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Units List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-right">الوحدات الحالية ({units.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {units.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              لا توجد وحدات قياسية بعد
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {units.map((unit) => (
                <div
                  key={unit.id}
                  className="border rounded-lg p-4 bg-card hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="secondary" className="text-base px-3 py-1">
                      {unit.name}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteUnit(unit.id, unit.name)}
                      className="text-destructive hover:text-destructive h-8 w-8 p-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {unit.hasCustomQuantity && (
                    <div className="text-sm text-muted-foreground bg-muted/30 rounded p-2">
                      <span className="font-medium">التخصيص:</span>
                      <br />
                      {unit.name} واحد = {unit.baseQuantity} {unit.baseUnit}
                    </div>
                  )}
                  
                  <div className="text-xs text-muted-foreground mt-2">
                    تم الإنشاء: {new Date(unit.createdAt).toLocaleDateString('ar-YE')}
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

export default UnitsManagerPage;
