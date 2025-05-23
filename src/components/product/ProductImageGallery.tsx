
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
import { toast } from "sonner";

interface ProductImageGalleryProps {
  product: Product;
}

const ProductImageGallery = ({ product }: ProductImageGalleryProps) => {
  // Process product images
  const { cloudinaryMainImage, productImages, fallbackImage } = processProductImage(product);
  
  // State management
  const [activeImage, setActiveImage] = useState<string>(cloudinaryMainImage);
  const { imageErrors, retryCount, isRetrying, handleImageError, handleRetryImages } = useImageErrorHandling(fallbackImage);
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
  
  // Check if at least one image has errors
  const hasAnyImageError = productImages.some(img => imageErrors[img]);

  // Check if the error is specifically with a Samsung image
  const hasSamsungImageError = productImages.some(img => 
    imageErrors[img] && img.includes('samsung.com')
  );
  
  // Check if the error is with a Cloudinary image
  const hasCloudinaryImageError = productImages.some(img => 
    imageErrors[img] && img.includes('cloudinary.com') && !img.includes('samsung.com')
  );

  // Handle image upload
  const handleImageUploaded = (publicId: string, url: string) => {
    // Close the dialog
    setIsUploadDialogOpen(false);
    
    // Set the uploaded image as active
    setActiveImage(url);
    
    // Clear any existing errors for this image to force a reload
    if (imageErrors[url]) {
      handleRetryImages();
    }
    
    // Notify user
    toast.success("Image uploaded successfully! Displaying image...");
    
    console.log("Uploaded image set as active:", url);
  };
  
  return (
    <div className="space-y-6">
      {hasAnyImageError && (
        <ImageErrorAlert 
          onRetryClick={handleRetryImages}
          onUploadClick={() => setIsUploadDialogOpen(true)}
          retryCount={retryCount}
          isSamsungImage={hasSamsungImageError}
          isCloudinaryImage={hasCloudinaryImageError}
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
