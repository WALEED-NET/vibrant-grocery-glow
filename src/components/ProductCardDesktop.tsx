
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
import { Edit, Trash2, AlertTriangle, Calendar, Package, MoreVertical, TrendingUp, TrendingDown } from 'lucide-react';
import { useGroceryStore } from '@/stores/useGroceryStore';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency, formatPrice } from '@/lib/utils';

interface ProductCardDesktopProps {
  product: Product;
  onEdit: (product: Product) => void;
}

const ProductCardDesktop = ({ product, onEdit }: ProductCardDesktopProps) => {
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

  const getProfitMargin = () => {
    const purchasePrice = product.originalPurchasePriceSAR || product.purchasePrice || 0;
    const sellingPrice = getSellingPriceSAR(product);
    if (purchasePrice === 0) return 0;
    return ((sellingPrice - purchasePrice) / purchasePrice) * 100;
  };

  const profitMargin = getProfitMargin();

  return (
    <Card className={`desktop-card-compact group hover:scale-[1.02] transition-all duration-300 ${
      product.isLowStock 
        ? 'border-red-300 bg-gradient-to-br from-red-50 to-red-100' 
        : isExpiringSoon
        ? 'border-orange-300 bg-gradient-to-br from-orange-50 to-orange-100'
        : 'border-gray-200 bg-gradient-to-br from-white to-gray-50 hover:border-primary/30'
    }`}>
      <CardContent className="p-0">
        {/* Header Section */}
        <div className="p-6 pb-4 border-b border-gray-100">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="desktop-subtitle font-bold text-gray-900 text-right mb-3 group-hover:text-primary transition-colors">
                {product.name}
              </h3>
              <div className="flex items-center gap-2 flex-wrap">
                {product.category && (
                  <Badge variant="secondary" className="desktop-caption px-3 py-1 bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border-yellow-300 font-medium">
                    {product.category}
                  </Badge>
                )}
                {product.isLowStock && (
                  <Badge variant="destructive" className="desktop-caption px-3 py-1 bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-red-300 font-medium animate-pulse">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    كمية ناقصة
                  </Badge>
                )}
                {isExpiringSoon && (
                  <Badge variant="outline" className="desktop-caption px-3 py-1 bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 border-orange-300 font-medium">
                    <Calendar className="h-4 w-4 mr-2" />
                    ينتهي قريباً
                  </Badge>
                )}
              </div>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="lg" className="h-10 w-10 p-0 hover:bg-gray-100 transition-colors">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44 bg-white shadow-xl border-0 desktop-shadow-lg">
                <DropdownMenuItem onClick={() => onEdit(product)} className="desktop-body py-3 hover:bg-primary/5">
                  <Edit className="h-5 w-5 mr-3" />
                  تعديل المنتج
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete} className="desktop-body py-3 text-red-600 hover:bg-red-50">
                  <Trash2 className="h-5 w-5 mr-3" />
                  حذف المنتج
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Main Info Grid */}
        <div className="p-6 pt-4">
          <div className="grid grid-cols-4 gap-6">
            {/* Quantity */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 text-center hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Package className="h-6 w-6 text-gray-600" />
                <span className="desktop-body font-semibold text-gray-700">الكمية</span>
              </div>
              <div className={`text-2xl font-bold mb-2 ${product.isLowStock ? 'text-red-600' : 'text-gray-900'}`}>
                {product.currentQuantity}
              </div>
              <div className="desktop-caption text-gray-600 font-medium">{product.unit}</div>
              <div className="desktop-caption text-gray-400 mt-2">
                الحد الأدنى: {product.minimumQuantity}
              </div>
            </div>

            {/* Purchase Price */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 text-center hover:shadow-md transition-all duration-200">
              <div className="desktop-body font-semibold text-blue-700 mb-3">سعر الشراء</div>
              <div className="space-y-2">
                <div className="text-xl font-bold text-blue-700">
                  {formatPrice(product.originalPurchasePriceSAR || product.purchasePrice || 0)} ر.س
                </div>
                <div className="desktop-body font-semibold text-blue-600">
                  {formatCurrency(getPurchasePriceYER(product))} ر.ي
                </div>
              </div>
            </div>

            {/* Selling Price */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 text-center hover:shadow-md transition-all duration-200">
              <div className="desktop-body font-semibold text-green-700 mb-3">سعر البيع</div>
              <div className="space-y-2">
                <div className="text-xl font-bold text-green-700">
                  {formatPrice(getSellingPriceSAR(product))} ر.س
                </div>
                <div className="desktop-body font-semibold text-green-600">
                  {formatCurrency(product.currentSellingPrice)} ر.ي
                </div>
              </div>
            </div>

            {/* Profit Margin */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-5 text-center hover:shadow-md transition-all duration-200">
              <div className="desktop-body font-semibold text-purple-700 mb-3">هامش الربح</div>
              <div className="flex items-center justify-center gap-2">
                {profitMargin > 0 ? (
                  <TrendingUp className="h-5 w-5 text-green-600" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-red-600" />
                )}
                <div className={`text-xl font-bold ${profitMargin > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatPrice(profitMargin)}%
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <div className="mt-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4">
              <p className="desktop-body text-gray-700 text-right leading-relaxed">{product.description}</p>
            </div>
          )}

          {/* Expiry Date */}
          {product.expiryDate && (
            <div className="mt-4 text-center">
              <span className="desktop-caption text-gray-500">
                تاريخ الانتهاء: {new Date(product.expiryDate).toLocaleDateString('ar')}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCardDesktop;
