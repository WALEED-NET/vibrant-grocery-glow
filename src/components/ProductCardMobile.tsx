
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Product } from '@/types';
import { Edit, Trash2, AlertTriangle, Calendar, Package, MoreVertical } from 'lucide-react';
import { useGroceryStore } from '@/stores/useGroceryStore';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency, formatPrice } from '@/lib/utils';

interface ProductCardMobileProps {
  product: Product;
  onEdit: (product: Product) => void;
}

const ProductCardMobile = ({ product, onEdit }: ProductCardMobileProps) => {
  const { deleteProduct, currentExchangeRate } = useGroceryStore();
  const { toast } = useToast();

  const handleDelete = () => {
    deleteProduct(product.id);
    toast({
      title: "تم الحذف",
      description: `تم حذف المنتج "${product.name}" بنجاح`,
    });
  };

  const isExpiringSoon = product.expiryDate && 
    new Date(product.expiryDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const getPurchasePriceYER = (product: Product) => {
    const purchasePriceSAR = product.originalPurchasePriceSAR || product.purchasePrice || 0;
    return purchasePriceSAR * currentExchangeRate;
  };

  const getSellingPriceSAR = (product: Product) => {
    return product.currentSellingPrice / currentExchangeRate;
  };

  return (
    <Card className={`transition-all duration-200 hover:shadow-md ${
      product.isLowStock 
        ? 'border-red-200 bg-red-50' 
        : isExpiringSoon
        ? 'border-orange-200 bg-orange-50'
        : 'border-gray-200 hover:border-gray-300'
    }`}>
      <CardContent className="p-3">
        {/* Header with product name and dropdown */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="font-medium text-gray-900 text-right text-sm">{product.name}</h3>
            <div className="flex items-center gap-1 flex-wrap mt-1">
              {product.category && (
                <Badge variant="secondary" className="text-xs px-1 py-0 bg-yellow-100 text-yellow-800 border-yellow-300">
                  {product.category}
                </Badge>
              )}
              {product.isLowStock && (
                <Badge variant="destructive" className="text-xs px-1 py-0 bg-red-100 text-red-800 border-red-300">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  ناقص
                </Badge>
              )}
              {isExpiringSoon && (
                <Badge variant="outline" className="text-xs px-1 py-0 border-orange-500 text-orange-600 bg-orange-100">
                  <Calendar className="h-3 w-3 mr-1" />
                  ينتهي قريباً
                </Badge>
              )}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <MoreVertical className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32 bg-white">
              <DropdownMenuItem onClick={() => onEdit(product)}>
                <Edit className="h-3 w-3 mr-2" />
                تعديل
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                <Trash2 className="h-3 w-3 mr-2" />
                حذف
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Main info */}
        <div className="space-y-2">
          {/* Quantity */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Package className="h-3 w-3 text-gray-500" />
              <span className="text-xs text-gray-500">الكمية</span>
            </div>
            <div className={`font-semibold text-sm ${product.isLowStock ? 'text-red-600' : 'text-gray-900'}`}>
              {product.currentQuantity} {product.unit}
            </div>
          </div>

          {/* Purchase Price */}
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500">سعر الشراء</div>
            <div className="text-right">
              <div className="font-semibold text-blue-600 text-xs">
                {formatPrice(product.originalPurchasePriceSAR || product.purchasePrice || 0)} ر.س
              </div>
              <div className="font-medium text-blue-500 text-xs">
                {formatCurrency(getPurchasePriceYER(product))} ر.ي
              </div>
            </div>
          </div>

          {/* Selling Price */}
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500">سعر البيع</div>
            <div className="text-right">
              <div className="font-semibold text-green-600 text-xs">
                {formatPrice(getSellingPriceSAR(product))} ر.س
              </div>
              <div className="font-medium text-green-500 text-xs">
                {formatCurrency(product.currentSellingPrice)} ر.ي
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCardMobile;
