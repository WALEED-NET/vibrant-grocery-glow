
import type { Product } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Check, Trash2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

// This mirrors the structure from useGroceryStore to ensure type safety
interface ShortageItem {
  id: string;
  productId: string;
  productName: string;
  requestedQuantity: number;
  currentQuantity: number;
  minimumQuantity: number;
  unit: string;
  addedManually: boolean;
}

interface ShortageItemRowProps {
  item: ShortageItem;
  product?: Product;
  isSelected: boolean;
  suppliedQuantity: string;
  onSelectItem: (itemId: string, checked: boolean) => void;
  onQuantityChange: (shortageId: string, value: string) => void;
  onMarkAsSupplied: (shortageId: string, productName: string) => void;
  onRemoveFromShortage: (shortageId: string, productName: string) => void;
}

const ShortageItemRow = ({
  item,
  product,
  isSelected,
  suppliedQuantity,
  onSelectItem,
  onQuantityChange,
  onMarkAsSupplied,
  onRemoveFromShortage
}: ShortageItemRowProps) => {
  const isMobile = useIsMobile();

  const handleSupplied = () => onMarkAsSupplied(item.id, item.productName);
  const handleRemove = () => onRemoveFromShortage(item.id, item.productName);
  const handleSelect = (checked: boolean) => onSelectItem(item.id, checked);
  const handleQtyChange = (e: React.ChangeEvent<HTMLInputElement>) => onQuantityChange(item.id, e.target.value);

  // Mobile View
  if (isMobile) {
    return (
      <Card className={`transition-all duration-200 ${isSelected ? 'bg-[#388E3C]/5 border-[#388E3C]/30' : 'bg-card'}`}>
        <CardContent className="p-3">
          <div className="flex items-start space-x-3 rtl:space-x-reverse">
            <Checkbox checked={isSelected} onCheckedChange={handleSelect} className="mt-1" />
            <div className="flex-1 space-y-3">
              <h3 className="font-semibold">{item.productName}</h3>
              <div className="flex flex-wrap gap-1">
                {item.addedManually && <Badge variant="secondary" className="text-xs">يدوي</Badge>}
                {product?.category && <Badge variant="outline" className="text-xs">{product.category}</Badge>}
              </div>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div>
                  <div className="text-muted-foreground text-xs">المتبقي</div>
                  <div className="font-medium text-destructive">{item.currentQuantity} {item.unit}</div>
                </div>
                <div>
                  <div className="text-muted-foreground text-xs">المطلوب</div>
                  <div className="font-bold text-[#388E3C]">{item.requestedQuantity} {item.unit}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse pt-2">
                <Input type="number" step="0.1" placeholder="الكمية" value={suppliedQuantity} onChange={handleQtyChange} className="w-24 text-center" />
                <Button size="sm" onClick={handleSupplied} disabled={!suppliedQuantity} className="bg-[#388E3C] hover:bg-[#2E7D32] flex-1">
                  <Check className="h-4 w-4 ml-1" />
                  <span>توريد</span>
                </Button>
                <Button variant="ghost" size="icon" onClick={handleRemove} className="text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Desktop View
  return (
    <Card className={`transition-all duration-200 hover:shadow-sm ${isSelected ? 'bg-[#388E3C]/5 border-[#388E3C]/30 shadow-md' : 'bg-card border-border/40'}`}>
      <CardContent className="p-2">
        <div className="grid grid-cols-12 gap-4 items-center">
          <div className="col-span-1 flex justify-center">
            <Checkbox checked={isSelected} onCheckedChange={handleSelect} />
          </div>
          <div className="col-span-3">
            <h3 className="font-medium text-gray-900">{item.productName}</h3>
            <div className="flex items-center gap-1 mt-1 flex-wrap">
              {item.addedManually && <Badge variant="secondary" className="text-xs">يدوي</Badge>}
              {product?.category && <Badge variant="outline" className="text-xs">{product.category}</Badge>}
            </div>
          </div>
          <div className="col-span-1 text-center">
            <div className="text-xs text-muted-foreground">المتبقي</div>
            <div className="font-semibold text-destructive">{item.currentQuantity} {item.unit}</div>
          </div>
          <div className="col-span-1 text-center">
            <div className="text-xs text-muted-foreground">الحد الأدنى</div>
            <div className="font-semibold">{item.minimumQuantity} {item.unit}</div>
          </div>
          <div className="col-span-2 text-center">
            <div className="text-xs text-muted-foreground">الكمية المطلوبة</div>
            <div className="font-bold text-lg text-[#388E3C]">{item.requestedQuantity} {item.unit}</div>
          </div>
          <div className="col-span-3 flex items-center space-x-2 rtl:space-x-reverse">
            <Input type="number" step="0.1" placeholder="الكمية الموردة" value={suppliedQuantity} onChange={handleQtyChange} className="w-32 text-center" />
            <Button size="sm" onClick={handleSupplied} disabled={!suppliedQuantity} className="bg-[#388E3C] hover:bg-[#2E7D32]">
              <Check className="h-4 w-4 mr-1 rtl:ml-1" />
              <span>تم التوريد</span>
            </Button>
          </div>
          <div className="col-span-1 flex justify-center">
            <Button variant="ghost" size="icon" onClick={handleRemove} className="text-destructive hover:bg-destructive/10">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShortageItemRow;
