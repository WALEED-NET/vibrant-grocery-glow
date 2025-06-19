
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useGroceryStore } from '@/stores/useGroceryStore';
import { Trash2, Plus, Package } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const UnitsManager = () => {
  const { units, addUnit, deleteUnit } = useGroceryStore();
  const [newUnitName, setNewUnitName] = useState('');
  const { toast } = useToast();

  const handleAddUnit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newUnitName.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال اسم الوحدة",
        variant: "destructive",
      });
      return;
    }

    if (units.some(unit => unit.name === newUnitName.trim())) {
      toast({
        title: "خطأ",
        description: "هذه الوحدة موجودة بالفعل",
        variant: "destructive",
      });
      return;
    }

    addUnit(newUnitName.trim());
    setNewUnitName('');
    
    toast({
      title: "تم بنجاح",
      description: `تم إضافة الوحدة "${newUnitName.trim()}" بنجاح`,
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

  return (
    <div className="space-y-6">
      <Card className="animate-fade-in-up">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-right">
            <Package className="h-5 w-5 text-primary" />
            <span>إدارة الوحدات القياسية</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddUnit} className="flex space-x-2 mb-6">
            <Button type="submit" className="flex items-center space-x-1">
              <Plus className="h-4 w-4" />
              <span>إضافة</span>
            </Button>
            <Input
              value={newUnitName}
              onChange={(e) => setNewUnitName(e.target.value)}
              placeholder="اسم الوحدة الجديدة (مثال: كرتون)"
              className="flex-1 text-right"
            />
          </form>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {units.map((unit) => (
              <div
                key={unit.id}
                className="flex items-center justify-between p-3 border rounded-lg bg-card hover:shadow-md transition-shadow"
              >
                <Badge variant="secondary" className="flex-1 text-center">
                  {unit.name}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteUnit(unit.id, unit.name)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          
          {units.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              لا توجد وحدات قياسية بعد
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UnitsManager;
