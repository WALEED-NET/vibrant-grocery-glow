
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useGroceryStore } from '@/stores/useGroceryStore';
import { Product } from '@/types';
import { Hash, Search } from 'lucide-react';
import VoiceSearch from './VoiceSearch';

interface QuickSearchProps {
  onProductSelect: (product: Product) => void;
  placeholder?: string;
  productsToSearch?: Product[];
}

const QuickSearch = ({ onProductSelect, placeholder = "اكتب رقم الاختصار أو اسم المنتج...", productsToSearch }: QuickSearchProps) => {
  const { products: allProducts } = useGroceryStore();
  const products = productsToSearch || allProducts;
  const [searchValue, setSearchValue] = useState('');
  const [foundProduct, setFoundProduct] = useState<Product | null>(null);

  const arabicToWestern = (s: string) => {
    return s.replace(/[\u0660-\u0669]/g, d => String.fromCharCode(d.charCodeAt(0) - 1632));
  };

  useEffect(() => {
    if (!searchValue) {
      setFoundProduct(null);
      return;
    }

    // Check if it's a number (shortcut search), supporting Arabic numerals
    const isNumber = /^[\d\u0660-\u0669]+$/.test(searchValue.trim());
    if (isNumber) {
      const westernSearchValue = arabicToWestern(searchValue.trim());
      const shortcutNum = parseInt(westernSearchValue);
      const product = products.find(p => p.shortcutNumber === shortcutNum);
      setFoundProduct(product || null);
    } else {
      // Text search
      const product = products.find(p => 
        p.name.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFoundProduct(product || null);
    }
  }, [searchValue, products]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && foundProduct) {
      onProductSelect(foundProduct);
      setSearchValue('');
      setFoundProduct(null);
    }
  };

  const handleProductClick = () => {
    if (foundProduct) {
      onProductSelect(foundProduct);
      setSearchValue('');
      setFoundProduct(null);
    }
  };

  const handleVoiceSearchResult = (transcript: string) => {
    setSearchValue(transcript);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <div className="relative flex-grow">
          <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder={placeholder}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pl-10 text-right w-full"
          />
        </div>
        <VoiceSearch onSearchResult={handleVoiceSearchResult} />
      </div>

      {foundProduct && (
        <Card 
          className="border-[#388E3C] bg-[#388E3C]/5 cursor-pointer hover:bg-[#388E3C]/10 transition-colors"
          onClick={handleProductClick}
        >
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h4 className="font-medium">{foundProduct.name}</h4>
                  {foundProduct.shortcutNumber && (
                    <span className="bg-[#388E3C] text-white px-2 py-1 rounded text-xs">
                      #{foundProduct.shortcutNumber}
                    </span>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  المخزون: {foundProduct.currentQuantity} {foundProduct.unit} | 
                  السعر: {foundProduct.currentSellingPrice.toLocaleString('ar-YE')} ر.ي
                </div>
              </div>
              <div className="text-sm text-[#388E3C] font-medium">
                اضغط Enter أو انقر للإضافة
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {searchValue && !foundProduct && (
        <Card className="border-muted">
          <CardContent className="p-3 text-center text-muted-foreground">
            <Search className="h-6 w-6 mx-auto mb-2" />
            <p>لم يتم العثور على منتج مطابق</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QuickSearch;

