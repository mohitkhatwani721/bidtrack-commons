
import { Badge } from "@/components/ui/badge";
import { Product } from "@/lib/types";
import { getTotalBidsForProduct } from "@/lib/data";

interface ProductHeaderProps {
  product: Product;
}

const ProductHeader = ({ product }: ProductHeaderProps) => {
  const totalBids = getTotalBidsForProduct(product.id);
  
  return (
    <div>
      <div className="flex items-center space-x-2 mb-2">
        <Badge variant="outline">{product.modelCode}</Badge>
        <Badge variant={totalBids > 0 ? "default" : "secondary"}>
          {totalBids} {totalBids === 1 ? 'bid' : 'bids'}
        </Badge>
      </div>
      <h1 className="text-3xl font-bold">{product.name}</h1>
    </div>
  );
};

export default ProductHeader;
