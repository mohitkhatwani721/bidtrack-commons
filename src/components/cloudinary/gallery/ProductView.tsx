
import ProductGroup from "./ProductGroup";

// Update the CloudinaryImage interface to match useImageGallery.ts
interface CloudinaryImage {
  publicId: string;
  url: string;
  uploadedAt: string;  // This replaces createdAt
  productId?: string;
  productName?: string;
}

interface ProductViewModel {
  productId: string;
  productName: string;
  images: CloudinaryImage[];
}

interface ProductViewProps {
  imagesByProduct: Record<string, ProductViewModel>;
  onImageClick: (url: string) => void;
  onProductClick: (productId: string) => void;
}

const ProductView = ({ 
  imagesByProduct, 
  onImageClick, 
  onProductClick 
}: ProductViewProps) => {
  return (
    <div className="space-y-10">
      {Object.values(imagesByProduct).map((group) => (
        <ProductGroup
          key={group.productId}
          productId={group.productId}
          productName={group.productName}
          images={group.images}
          onImageClick={onImageClick}
          onProductClick={onProductClick}
        />
      ))}
    </div>
  );
};

export default ProductView;
