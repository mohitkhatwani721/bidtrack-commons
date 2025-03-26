
import { Product } from "@/lib/types";
import ProductImageGallery from "../ProductImageGallery";
import ImageActions from "./ImageActions";
import ImageUrlDisplay from "./ImageUrlDisplay";
import { toast } from "sonner";
import { useEffect } from "react";

interface ImageSectionProps {
  product: Product;
  onRefresh: () => void;
  setProduct: (product: Product) => void;
}

const ImageSection = ({ product, onRefresh, setProduct }: ImageSectionProps) => {
  // Add effect to log image URL for debugging
  useEffect(() => {
    console.log("Product image URL in ImageSection:", product.imageUrl);
  }, [product.imageUrl]);

  const handleImageUploaded = (publicId: string, url: string) => {
    console.log("Image uploaded callback triggered with URL:", url);
    
    // Update the product in local state to show the new image immediately
    setProduct({
      ...product,
      imageUrl: url
    });
    
    // Notify the user
    toast.success("Product image updated successfully");
    
    // Force a refresh after a small delay to ensure everything is updated
    setTimeout(() => {
      onRefresh();
    }, 500);
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
