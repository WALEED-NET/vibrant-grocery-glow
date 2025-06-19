
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, TrendingUp, ShoppingBag } from 'lucide-react';
import ProductForm from './ProductForm';
import ProductList from './ProductList';
import { Product } from '@/types';
import { useIsMobile } from '@/hooks/use-mobile';

interface ProductsPageProps {
  onSectionChange?: (section: string) => void;
}

const ProductsPage = ({ onSectionChange }: ProductsPageProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const isMobile = useIsMobile();

  const handleSuccess = () => {
    setIsDialogOpen(false);
    setEditingProduct(null);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsDialogOpen(true);
  };

  const handleCancel = () => {
    setEditingProduct(null);
    setIsDialogOpen(false);
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setIsDialogOpen(true);
  };

  const handleSalesRedirect = () => {
    onSectionChange?.('sales');
  };

  const handlePurchaseRedirect = () => {
    onSectionChange?.('purchase');
  };

  return (
    <div className="w-full max-w-full overflow-hidden">
      <div className="w-full space-y-6 max-w-full">
        <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} justify-between items-start ${isMobile ? '' : 'items-center'} gap-4 max-w-full`}>
          <div className="min-w-0 flex-1">
            <h1 className={`font-bold text-right ${isMobile ? 'text-xl' : 'text-3xl'} text-gray-900 mb-1 truncate`}>إدارة المنتجات</h1>
            {!isMobile && (
              <p className="text-gray-600 text-right text-base truncate">إدارة شاملة لجميع منتجات متجرك</p>
            )}
          </div>
          
          <div className={`flex ${isMobile ? 'flex-wrap w-full' : 'flex-nowrap flex-shrink-0'} gap-2`}>
            <Button 
              onClick={handleSalesRedirect}
              className={`bg-green-600 hover:bg-green-700 flex items-center space-x-2 ${isMobile ? 'flex-1 min-w-0' : 'px-4 py-2 text-sm'} shadow-lg hover:shadow-xl transition-all duration-200`}
            >
              <TrendingUp className={`${isMobile ? 'h-4 w-4' : 'h-4 w-4'} flex-shrink-0`} />
              <span className="truncate">عملية بيع</span>
            </Button>
            
            <Button 
              onClick={handlePurchaseRedirect}
              className={`bg-blue-600 hover:bg-blue-700 flex items-center space-x-2 ${isMobile ? 'flex-1 min-w-0' : 'px-4 py-2 text-sm'} shadow-lg hover:shadow-xl transition-all duration-200`}
            >
              <ShoppingBag className={`${isMobile ? 'h-4 w-4' : 'h-4 w-4'} flex-shrink-0`} />
              <span className="truncate">عملية شراء</span>
            </Button>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  onClick={handleAddNew}
                  className={`bg-[#388E3C] hover:bg-[#2E7D32] flex items-center space-x-2 ${isMobile ? 'w-full' : 'px-4 py-2 text-sm'} shadow-lg hover:shadow-xl transition-all duration-200`}
                >
                  <Plus className={`${isMobile ? 'h-4 w-4' : 'h-4 w-4'} flex-shrink-0`} />
                  <span className="truncate">إضافة منتج جديد</span>
                </Button>
              </DialogTrigger>
              <DialogContent className={`${isMobile ? 'w-[95vw] h-[85vh] max-w-none max-h-none rounded-lg mb-20 z-[1000]' : 'max-w-4xl max-h-[90vh] z-[1000]'} overflow-hidden flex flex-col`}>
                <DialogHeader className={`${isMobile ? 'px-4 py-3 border-b bg-white' : 'p-6 pb-4'} flex-shrink-0`}>
                  <DialogTitle className={`text-right ${isMobile ? 'text-lg' : 'text-xl'}`}>
                    {editingProduct ? 'تعديل المنتج' : 'إضافة منتج جديد'}
                  </DialogTitle>
                </DialogHeader>
                <div className="flex-1 overflow-y-auto">
                  <ProductForm 
                    onSuccess={handleSuccess}
                    editingProduct={editingProduct}
                    onCancel={handleCancel}
                  />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <div className="w-full max-w-full overflow-hidden">
          <ProductList onEditProduct={handleEdit} />
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
