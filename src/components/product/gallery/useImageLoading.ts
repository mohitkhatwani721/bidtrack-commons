
import { useState, useEffect, useRef } from "react";
import { preloadImages } from "@/utils/imageUtils";
import { toast } from "sonner";

export const useImageLoading = (
  productImages: string[], 
  activeImage: string, 
  retryCount: number, 
  handleImageError: (url: string) => void
) => {
  const [imagesLoaded, setImagesLoaded] = useState<Record<string, boolean>>({});
  const isMounted = useRef(true);
  
  // Preload all images with full quality
  useEffect(() => {
    const loadImages = async () => {
      try {
        console.log("Preloading images:", productImages);
        const loadStatus = await preloadImages(productImages);
        if (isMounted.current) {
          setImagesLoaded(loadStatus);
          console.log("Images load status:", loadStatus);
          
          // Check if main image loaded, if not switch to fallback
          if (loadStatus[activeImage] === false) {
            handleImageError(activeImage);
          }
        }
      } catch (error) {
        console.error("Error preloading images:", error);
      }
    };
    
    loadImages();
    
    return () => {
      isMounted.current = false;
    };
  }, [productImages, activeImage, retryCount, handleImageError]);
  
  return imagesLoaded;
};

export const useImageErrorHandling = (fallbackImage: string) => {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [retryCount, setRetryCount] = useState(0);
  
  // Improved error handling for image loading
  const handleImageError = (url: string) => {
    console.log(`Error loading image: ${url}`);
    
    setImageErrors(prev => ({ ...prev, [url]: true }));
    
    // If the main image failed to load, use fallback
    toast.error("Unable to load product image. Using placeholder instead.", {
      id: "image-error",
      duration: 3000
    });
  };
  
  // Retry loading images with a different approach
  const handleRetryImages = () => {
    console.log("Manually retrying image load");
    
    // Clear error states and reset loaded states
    setImageErrors({});
    
    // Increment retry counter to trigger reloading
    setRetryCount(prev => prev + 1);
    
    toast.info("Retrying image load...", {
      id: "retry-images",
      duration: 2000
    });
  };
  
  return {
    imageErrors,
    retryCount,
    handleImageError,
    handleRetryImages
  };
};
