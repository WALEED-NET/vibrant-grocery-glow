
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Toggle } from '@/components/ui/toggle';
import { useGroceryStore } from '@/stores/useGroceryStore';
import { Product } from '@/types';
import { Search, Package, Grid, List } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import VoiceSearch from './VoiceSearch';
import ProductCard from './ProductCard';
import ProductListView from './ProductListView';

interface ProductListProps {
  onEditProduct: (product: Product) => void;
}

type ViewMode = 'grid' | 'list';

const arabicToWestern = (s: string) => {
  return s.replace(/[\u0660-\u0669]/g, d => String.fromCharCode(d.charCodeAt(0) - 1632));
};

const ProductList = ({ onEditProduct }: ProductListProps) => {
  const { products } = useGroceryStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const isMobile = useIsMobile();

  // Load view preference from localStorage
  useEffect(() => {
    const savedViewMode = localStorage.getItem('productViewMode') as ViewMode;
    if (savedViewMode) {
      setViewMode(savedViewMode);
    }
  }, []);

  // Save view preference to localStorage
  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    localStorage.setItem('productViewMode', mode);
  };

  const filteredProducts = products.filter(product => {
    if (!searchTerm) return true;

    const trimmedSearch = searchTerm.trim();
    // support Arabic numerals
    const isNumber = /^[\d\u0660-\u0669]+$/.test(trimmedSearch);

    if (isNumber) {
        const westernSearchValue = arabicToWestern(trimmedSearch);
        const shortcutNum = parseInt(westernSearchValue, 10);
        return product.shortcutNumber === shortcutNum;
    } else {
        const lowerCaseSearch = trimmedSearch.toLowerCase();
        return product.name.toLowerCase().includes(lowerCaseSearch) ||
               (product.category && product.category.toLowerCase().includes(lowerCaseSearch));
    }
  });

  const handleVoiceSearchResult = (voiceSearchTerm: string) => {
    setSearchTerm(voiceSearchTerm);
  };

  return (
    <div className="w-full">
      <Card className="animate-fade-in-up border-border/40 desktop-shadow-lg">
        <CardHeader className={isMobile ? 'px-4 py-4 pb-2' : 'desktop-card'}>
          <div className="flex items-center justify-between">
            <CardTitle className={`text-right flex items-center space-x-4 ${isMobile ? 'text-lg' : 'desktop-title'}`}>
              <Package className={`${isMobile ? 'h-5 w-5' : 'h-8 w-8'} text-[#388E3C]`} />
              <span>قائمة المنتجات ({filteredProducts.length})</span>
            </CardTitle>
            
            {/* View Mode Toggle */}
            <div className="flex items-center gap-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-3 desktop-shadow-sm">
              <Toggle
                pressed={viewMode === 'grid'}
                onPressedChange={() => handleViewModeChange('grid')}
                size={isMobile ? "sm" : "lg"}
                className="data-[state=on]:bg-white data-[state=on]:shadow-md transition-all duration-200 hover:bg-white/70"
              >
                <Grid className={`${isMobile ? 'h-4 w-4' : 'h-6 w-6'}`} />
                {!isMobile && <span className="mr-2 font-medium">شبكة</span>}
              </Toggle>
              <Toggle
                pressed={viewMode === 'list'}
                onPressedChange={() => handleViewModeChange('list')}
                size={isMobile ? "sm" : "lg"}
                className="data-[state=on]:bg-white data-[state=on]:shadow-md transition-all duration-200 hover:bg-white/70"
              >
                <List className={`${isMobile ? 'h-4 w-4' : 'h-6 w-6'}`} />
                {!isMobile && <span className="mr-2 font-medium">قائمة</span>}
              </Toggle>
            </div>
          </div>
          
          <div className={`flex items-center space-x-4 ${isMobile ? 'mt-4' : 'mt-8'}`}>
            <div className="relative flex-1">
              <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground ${isMobile ? 'h-4 w-4' : 'h-6 w-6'}`} />
              <Input
                placeholder="البحث بالاسم، الفئة أو رقم الإختصار..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`${isMobile ? 'pl-10 h-10' : 'pl-14 h-16 text-xl'} text-right desktop-shadow-sm border-gray-200 focus:border-primary/50 focus:ring-2 focus:ring-primary/20`}
              />
            </div>
            <VoiceSearch 
              onSearchResult={handleVoiceSearchResult}
              disabled={false}
            />
          </div>
        </CardHeader>
        
        <CardContent className={isMobile ? 'px-4 py-4 pt-2' : 'desktop-card pt-4'}>
          {filteredProducts.length === 0 ? (
            <div className={`text-center ${isMobile ? 'py-12' : 'py-24'}`}>
              <Package className={`${isMobile ? 'h-12 w-12' : 'h-24 w-24'} text-muted-foreground mx-auto mb-8`} />
              <p className={`text-muted-foreground ${isMobile ? 'text-lg' : 'desktop-subtitle'} font-medium`}>
                {searchTerm ? 'لا توجد منتجات تطابق البحث' : 'لا توجد منتجات بعد'}
              </p>
              {searchTerm && (
                <p className={`text-muted-foreground mt-4 ${isMobile ? 'text-sm' : 'desktop-body'}`}>
                  جرب مصطلحاً آخر أو أضف منتجات جديدة
                </p>
              )}
            </div>
          ) : (
            <>
              {viewMode === 'list' ? (
                <ProductListView
                  products={filteredProducts}
                  onEdit={onEditProduct}
                />
              ) : (
                <>
                  {isMobile ? (
                    <div className="grid grid-cols-2 gap-3">
                      {filteredProducts.map((product) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          onEdit={onEditProduct}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="desktop-grid-3 2xl:grid-cols-4">
                      {filteredProducts.map((product) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          onEdit={onEditProduct}
                        />
                      ))}
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductList;
