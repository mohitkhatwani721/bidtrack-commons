
import { Product } from "@/lib/types";
import ProductImageGallery from "../ProductImageGallery";
import ImageActions from "./ImageActions";
import ImageUrlDisplay from "./ImageUrlDisplay";
import { toast } from "sonner";

interface ImageSectionProps {
  product: Product;
  onRefresh: () => void;
  setProduct: (product: Product) => void;
}

const ImageSection = ({ product, onRefresh, setProduct }: ImageSectionProps) => {
  const handleImageUploaded = (publicId: string, url: string) => {
    // Update the product in local state to show the new image immediately
    setProduct({
      ...product,
      imageUrl: url
    });
    
    // Notify the user
    toast.success("Product image updated successfully");
  };

  return (
    <div>
      <ProductImageGallery product={product} />
      <ImageActions 
        productId={product.id} 
        onRefresh={onRefresh} 
        onImageUploaded={handleImageUploaded} 
      />
      <ImageUrlDisplay imageUrl={product.imageUrl} />
    </div>
  );
};

export default ImageSection;
