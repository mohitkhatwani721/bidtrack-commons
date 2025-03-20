
import { Product } from "@/lib/types";
import ProductFeatures from "./ProductFeatures";

interface ProductDetailsTabProps {
  product: Product;
}

const ProductDetailsTab = ({ product }: ProductDetailsTabProps) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-medium">Description</h3>
        <p className="text-gray-600 mt-2">
          {product.description || "No description available."}
        </p>
      </div>
      
      <ProductFeatures />
    </div>
  );
};

export default ProductDetailsTab;
