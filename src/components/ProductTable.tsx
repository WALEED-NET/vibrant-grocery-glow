
import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types';
import { Edit, Trash2, AlertTriangle, Calendar, Hash, ArrowUpDown } from 'lucide-react';
import { useGroceryStore } from '@/stores/useGroceryStore';
import { useToast } from '@/hooks/use-toast';

interface ProductTableProps {
  products: Product[];
  onEditProduct: (product: Product) => void;
}

const ProductTable = ({ products, onEditProduct }: ProductTableProps) => {
  const { deleteProduct, currentExchangeRate } = useGroceryStore();
  const { toast } = useToast();
  const [sortField, setSortField] = useState<keyof Product>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleDelete = (product: Product) => {
    deleteProduct(product.id);
    toast({
      title: "تم الحذف",
      description: `تم حذف المنتج "${product.name}" بنجاح`,
    });
  };

  const handleSort = (field: keyof Product) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedProducts = [...products].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    return 0;
  });

  const calculateProfitPercentage = (product: Product) => {
    const costInYer = product.originalPurchasePriceSAR * currentExchangeRate;
    return ((product.profitMargin / costInYer) * 100).toFixed(1);
  };

  const isExpiringSoon = (product: Product) => {
    return product.expiryDate && 
      new Date(product.expiryDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  };

  return (
    <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="text-right font-semibold">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSort('shortcutNumber')}
                className="h-auto p-0 font-semibold justify-start"
              >
                رقم الاختصار
                <ArrowUpDown className="mr-2 h-3 w-3" />
              </Button>
            </TableHead>
            <TableHead className="text-right font-semibold">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSort('name')}
                className="h-auto p-0 font-semibold justify-start"
              >
                اسم المنتج
                <ArrowUpDown className="mr-2 h-3 w-3" />
              </Button>
            </TableHead>
            <TableHead className="text-right font-semibold">الفئة</TableHead>
            <TableHead className="text-center font-semibold">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSort('currentQuantity')}
                className="h-auto p-0 font-semibold"
              >
                الكمية
                <ArrowUpDown className="mr-2 h-3 w-3" />
              </Button>
            </TableHead>
            <TableHead className="text-center font-semibold">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSort('currentSellingPrice')}
                className="h-auto p-0 font-semibold"
              >
                سعر البيع (ر.ي)
                <ArrowUpDown className="mr-2 h-3 w-3" />
              </Button>
            </TableHead>
            <TableHead className="text-center font-semibold">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSort('originalPurchasePriceSAR')}
                className="h-auto p-0 font-semibold"
              >
                سعر الشراء (ر.س)
                <ArrowUpDown className="mr-2 h-3 w-3" />
              </Button>
            </TableHead>
            <TableHead className="text-center font-semibold">هامش الربح</TableHead>
            <TableHead className="text-center font-semibold">الحالة</TableHead>
            <TableHead className="text-center font-semibold">الإجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedProducts.map((product) => (
            <TableRow key={product.id} className="hover:bg-gray-50">
              <TableCell className="text-right">
                {product.shortcutNumber ? (
                  <Badge variant="outline" className="flex items-center space-x-1 w-fit bg-[#388E3C] text-white border-[#388E3C]">
                    <Hash className="h-3 w-3" />
                    <span>{product.shortcutNumber}</span>
                  </Badge>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </TableCell>
              
              <TableCell className="text-right">
                <div className="font-medium">{product.name}</div>
                {product.description && (
                  <div className="text-sm text-gray-500 truncate max-w-xs">
                    {product.description}
                  </div>
                )}
              </TableCell>
              
              <TableCell className="text-right">
                {product.category ? (
                  <Badge variant="secondary">{product.category}</Badge>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </TableCell>
              
              <TableCell className="text-center">
                <div className={`font-semibold ${product.isLowStock ? 'text-red-600' : 'text-[#388E3C]'}`}>
                  {product.currentQuantity} {product.unit}
                </div>
                <div className="text-xs text-gray-500">
                  الحد الأدنى: {product.minimumQuantity}
                </div>
              </TableCell>
              
              <TableCell className="text-center">
                <div className="font-bold text-[#388E3C]">
                  {product.currentSellingPrice.toLocaleString('ar-YE', { maximumFractionDigits: 0 })}
                </div>
              </TableCell>
              
              <TableCell className="text-center">
                <div className="font-medium text-blue-600">
                  {product.originalPurchasePriceSAR}
                </div>
              </TableCell>
              
              <TableCell className="text-center">
                <div className="font-medium text-yellow-600">
                  %{calculateProfitPercentage(product)}
                </div>
                <div className="text-xs text-gray-500">
                  {product.profitMargin.toLocaleString('ar-YE')} ر.ي
                </div>
              </TableCell>
              
              <TableCell className="text-center">
                <div className="flex flex-col space-y-1">
                  {product.isLowStock && (
                    <Badge variant="destructive" className="flex items-center space-x-1 text-xs">
                      <AlertTriangle className="h-3 w-3" />
                      <span>ناقص</span>
                    </Badge>
                  )}
                  {isExpiringSoon(product) && (
                    <Badge variant="outline" className="flex items-center space-x-1 text-xs border-orange-500 text-orange-600">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(product.expiryDate!).toLocaleDateString('ar-YE')}</span>
                    </Badge>
                  )}
                  {!product.isLowStock && !isExpiringSoon(product) && (
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      متوفر
                    </Badge>
                  )}
                </div>
              </TableCell>
              
              <TableCell className="text-center">
                <div className="flex space-x-2 justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEditProduct(product)}
                    className="hover:bg-blue-50 hover:border-blue-300"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(product)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {sortedProducts.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          لا توجد منتجات لعرضها
        </div>
      )}
    </div>
  );
};

export default ProductTable;
