
import { useIsMobile } from '@/hooks/use-mobile';
import ProductCardDesktop from './ProductCardDesktop';
import ProductCardMobile from './ProductCardMobile';
import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
}

const ProductCard = ({ product, onEdit }: ProductCardProps) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="w-full max-w-full overflow-hidden">
        <ProductCardMobile product={product} onEdit={onEdit} />
      </div>
    );
  }

  return (
    <div className="w-full max-w-full overflow-hidden">
      <ProductCardDesktop product={product} onEdit={onEdit} />
    </div>
  );
};

export default ProductCard;
