
import { useState, useEffect } from "react";
import { Product } from "@/lib/types";
import ProductImageDisplay from "./gallery/ProductImageDisplay";
import ImageThumbnails from "./gallery/ImageThumbnails";
import ImageErrorAlert from "./gallery/ImageErrorAlert";
import { processProductImage, getImageSource } from "./gallery/ImageProcessor";
import { usePlaceholders } from "./gallery/usePlaceholders";
import { useImageLoading, useImageErrorHandling } from "./gallery/useImageLoading";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ImageUploader from "@/components/shared/ImageUploader";

interface ProductImageGalleryProps {
  product: Product;
}

const ProductImageGallery = ({ product }: ProductImageGalleryProps) => {
  // Process product images
  const { cloudinaryMainImage, productImages, fallbackImage } = processProductImage(product);
  
  // State management
  const [activeImage, setActiveImage] = useState<string>(cloudinaryMainImage);
  const { imageErrors, retryCount, handleImageError, handleRetryImages } = useImageErrorHandling(fallbackImage);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  
  // Load placeholders and preload images
  const placeholders = usePlaceholders(productImages);
  const imagesLoaded = useImageLoading(productImages, activeImage, retryCount, handleImageError);
  
  // Reset active image if product changes
  useEffect(() => {
    setActiveImage(cloudinaryMainImage);
    console.log("Product changed, reset active image to:", cloudinaryMainImage);
  }, [product.id, cloudinaryMainImage]);
  
  // Helper function to get appropriate image source
  const getProcessedImageSource = (url: string) => {
    return getImageSource(url, imageErrors, fallbackImage);
  };
  
  // Check if all images have errors
  const allImagesHaveErrors = productImages.every(img => imageErrors[img]);

  // Handle image upload
  const handleImageUploaded = (publicId: string, url: string) => {
    // Close the dialog
    setIsUploadDialogOpen(false);
    
    // Set the uploaded image as active
    setActiveImage(url);
  };
  
  return (
    <div className="space-y-6">
      {allImagesHaveErrors && (
        <ImageErrorAlert 
          onRetryClick={handleRetryImages} 
          onUploadClick={() => setIsUploadDialogOpen(true)}
        />
      )}
      
      <ProductImageDisplay
        activeImage={activeImage}
        product={product}
        placeholders={placeholders}
        imagesLoaded={imagesLoaded}
        imageErrors={imageErrors}
        fallbackImage={fallbackImage}
        handleImageError={handleImageError}
      />
      
      <ImageThumbnails
        images={productImages}
        activeImage={activeImage}
        placeholders={placeholders}
        imagesLoaded={imagesLoaded}
        imageErrors={imageErrors}
        onSelectImage={setActiveImage}
        getImageSource={getProcessedImageSource}
        handleImageError={handleImageError}
      />

      {/* Image Upload Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Upload Relevant Product Image</DialogTitle>
          </DialogHeader>
          <ImageUploader 
            productId={product.id} 
            onImageUploaded={handleImageUploaded}
            buttonText="Upload Relevant Image"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductImageGallery;
