
import { useState, useEffect, useRef } from "react";
import { preloadImages, sanitizeSamsungUrl } from "@/utils/imageUtils";
import { toast } from "sonner";

export const useImageLoading = (
  productImages: string[], 
  activeImage: string, 
  retryCount: number, 
  handleImageError: (url: string) => void
) => {
  const [imagesLoaded, setImagesLoaded] = useState<Record<string, boolean>>({});
  const isMounted = useRef(true);
  const toastShown = useRef(false);
  
  // Preload all images with full quality
  useEffect(() => {
    const loadImages = async () => {
      try {
        console.log("Preloading images:", productImages);
        
        // First clean any Samsung URLs that might be causing issues
        const sanitizedImages = productImages.map(url => {
          if (url.includes('samsung.com')) {
            return sanitizeSamsungUrl(url);
          }
          return url;
        });
        
        const loadStatus = await preloadImages(sanitizedImages);
        
        if (isMounted.current) {
          setImagesLoaded(loadStatus);
          console.log("Images load status:", loadStatus);
          
          // Check if main image loaded, if not switch to fallback
          if (loadStatus[activeImage] === false) {
            handleImageError(activeImage);
          }
          
          // Only show toast once per session
          const hasFailedImages = Object.values(loadStatus).some(status => status === false);
          if (hasFailedImages && !toastShown.current) {
            toastShown.current = true;
            toast.info("Some images are using placeholders for better browsing experience", {
              id: "image-fallback-info",
              duration: 3000
            });
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
  const [isRetrying, setIsRetrying] = useState(false);
  const toastShown = useRef(false);
  
  // Improved error handling for image loading
  const handleImageError = (url: string) => {
    if (!url) return;
    
    console.log(`Error loading image: ${url}`);
    
    // Try to sanitize Samsung URLs automatically
    if (url.includes('samsung.com')) {
      const sanitizedUrl = sanitizeSamsungUrl(url);
      if (sanitizedUrl !== url) {
        console.log(`Auto-sanitized Samsung URL: ${url} -> ${sanitizedUrl}`);
        return; // Let the sanitized URL try to load
      }
    }
    
    setImageErrors(prev => ({ ...prev, [url]: true }));
    
    // Only show toast once per session to avoid spamming
    if (!toastShown.current) {
      toastShown.current = true;
      toast.info("Using placeholder images where needed", {
        id: "image-error",
        duration: 3000
      });
    }
  };
  
  // Retry loading images with a different approach
  const handleRetryImages = () => {
    console.log("Manually retrying image load");
    
    if (isRetrying) return;
    setIsRetrying(true);
    
    // Clear error states
    setImageErrors({});
    toastShown.current = false;
    
    // Increment retry counter to trigger reloading
    setRetryCount(prev => prev + 1);
    
    toast.info("Retrying image load...", {
      id: "retry-images",
      duration: 2000
    });
    
    // Reset retry flag after a delay
    setTimeout(() => {
      setIsRetrying(false);
    }, 2000);
  };
  
  return {
    imageErrors,
    retryCount,
    isRetrying,
    handleImageError,
    handleRetryImages
  };
};
