
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
import { useIsMobile } from '@/hooks/use-mobile';
import { formatCurrency, formatPrice } from '@/lib/utils';

interface ProductListViewProps {
  products: Product[];
  onEdit: (product: Product) => void;
}

const ProductListView = ({ products, onEdit }: ProductListViewProps) => {
  const { deleteProduct, currentExchangeRate } = useGroceryStore();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const handleDelete = (product: Product) => {
    deleteProduct(product.id);
    toast({
      title: "تم الحذف",
      description: `تم حذف المنتج "${product.name}" بنجاح`,
    });
  };

  const isExpiringSoon = (product: Product) => product.expiryDate && 
    new Date(product.expiryDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  // حساب سعر الشراء باليمني
  const getPurchasePriceYER = (product: Product) => {
    const purchasePriceSAR = product.originalPurchasePriceSAR || product.purchasePrice || 0;
    return purchasePriceSAR * currentExchangeRate;
  };

  // حساب سعر البيع بالسعودي
  const getSellingPriceSAR = (product: Product) => {
    return product.currentSellingPrice / currentExchangeRate;
  };

  // Mobile Layout
  if (isMobile) {
    return (
      <div className="space-y-2">
        {products.map((product) => (
          <Card key={product.id} className={`transition-all duration-200 ${
            product.isLowStock 
              ? 'bg-red-50 border-red-200' 
              : isExpiringSoon(product)
              ? 'bg-orange-50 border-orange-200'
              : 'bg-white border-gray-200'
          }`}>
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-sm text-gray-900 text-right">{product.name}</h3>
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
                        <DropdownMenuItem onClick={() => handleDelete(product)} className="text-red-600">
                          <Trash2 className="h-3 w-3 mr-2" />
                          حذف
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <div className="flex items-center gap-1 flex-wrap mb-2">
                    {product.category && (
                      <Badge variant="secondary" className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-800 border-yellow-300">
                        {product.category}
                      </Badge>
                    )}
                    {product.isLowStock && (
                      <Badge variant="destructive" className="text-xs px-2 py-0.5 bg-red-100 text-red-800 border-red-300">
                        كمية ناقصة
                      </Badge>
                    )}
                    {isExpiringSoon(product) && (
                      <Badge variant="outline" className="text-xs px-2 py-0.5 bg-orange-100 text-orange-800 border-orange-300">
                        ينتهي قريباً
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <div className="text-center">
                        <div className="text-gray-500">الكمية</div>
                        <div className={`font-medium ${product.isLowStock ? 'text-red-600' : 'text-gray-900'}`}>
                          {product.currentQuantity} {product.unit}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-gray-500">سعر الشراء</div>
                        <div className="font-medium text-blue-600 text-xs">
                          <div>{formatPrice(product.originalPurchasePriceSAR || product.purchasePrice || 0)} ر.س</div>
                          <div className="text-blue-500">{formatCurrency(getPurchasePriceYER(product))} ر.ي</div>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-gray-500">سعر البيع</div>
                        <div className="font-medium text-green-600 text-xs">
                          <div>{formatPrice(getSellingPriceSAR(product))} ر.س</div>
                          <div className="text-green-500">{formatCurrency(product.currentSellingPrice)} ر.ي</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Desktop Layout - Updated with English number formatting
  return (
    <div className="space-y-1">
      {products.map((product) => (
        <Card key={product.id} className={`transition-all duration-200 hover:shadow-sm ${
          product.isLowStock 
            ? 'bg-red-50 border-red-200' 
            : isExpiringSoon(product)
            ? 'bg-orange-50 border-orange-200'
            : 'bg-white border-gray-200'
        }`}>
          <CardContent className="p-4">
            <div className="grid grid-cols-12 gap-4 items-center min-h-[60px]">
              
              {/* Product Name and Badges - 25% */}
              <div className="col-span-3 flex flex-col justify-center">
                <h3 className="font-medium text-base text-gray-900 text-right mb-1">{product.name}</h3>
                <div className="flex items-center gap-1 flex-wrap">
                  {product.category && (
                    <Badge variant="secondary" className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-800 border-yellow-300 rounded-full">
                      {product.category}
                    </Badge>
                  )}
                  {product.isLowStock && (
                    <Badge variant="destructive" className="text-xs px-2 py-0.5 bg-red-100 text-red-800 border-red-300 rounded-full">
                      كمية ناقصة
                    </Badge>
                  )}
                  {isExpiringSoon(product) && (
                    <Badge variant="outline" className="text-xs px-2 py-0.5 bg-orange-100 text-orange-800 border-orange-300 rounded-full">
                      ينتهي قريباً
                    </Badge>
                  )}
                </div>
              </div>

              {/* Quantity - 15% */}
              <div className="col-span-2 text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Package className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-500">الكمية</span>
                </div>
                <div className={`text-lg font-semibold ${product.isLowStock ? 'text-red-600' : 'text-gray-900'}`}>
                  {product.currentQuantity}
                </div>
                <div className="text-xs text-gray-500">{product.unit}</div>
              </div>

              {/* Purchase Price (SAR + YER) - 25% */}
              <div className="col-span-3 text-center">
                <div className="text-sm text-gray-500 mb-1">سعر الشراء</div>
                <div className="space-y-1">
                  <div className="text-base font-semibold text-blue-600">
                    {formatPrice(product.originalPurchasePriceSAR || product.purchasePrice || 0)} ر.س
                  </div>
                  <div className="text-sm font-medium text-blue-500">
                    {formatCurrency(getPurchasePriceYER(product))} ر.ي
                  </div>
                </div>
              </div>

              {/* Selling Price (SAR + YER) - 25% */}
              <div className="col-span-3 text-center">
                <div className="text-sm text-gray-500 mb-1">سعر البيع</div>
                <div className="space-y-1">
                  <div className="text-base font-semibold text-green-600">
                    {formatPrice(getSellingPriceSAR(product))} ر.س
                  </div>
                  <div className="text-sm font-medium text-green-500">
                    {formatCurrency(product.currentSellingPrice)} ر.ي
                  </div>
                </div>
              </div>

              {/* Actions - 10% */}
              <div className="col-span-1 flex justify-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-36 bg-white border shadow-lg z-50">
                    <DropdownMenuItem onClick={() => onEdit(product)} className="hover:bg-gray-50">
                      <Edit className="h-4 w-4 mr-2" />
                      تعديل
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDelete(product)} className="text-red-600 hover:bg-red-50">
                      <Trash2 className="h-4 w-4 mr-2" />
                      حذف
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ProductListView;
