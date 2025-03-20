
import { Product } from "@/lib/types";

interface ProductStatsProps {
  product: Product;
}

const ProductStats = ({ product }: ProductStatsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4 py-4 border-y">
      <div>
        <p className="text-sm text-gray-500">Starting price</p>
        <p className="text-2xl font-bold">AED {product.pricePerUnit.toLocaleString()}</p>
      </div>
      
      <div>
        <p className="text-sm text-gray-500">Quantity available</p>
        <p className="text-2xl font-bold">{product.quantity}</p>
      </div>
    </div>
  );
};

export default ProductStats;
