
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/lib/types";
import { toast } from "sonner";

interface ProductImageDisplayProps {
  activeImage: string;
  product: Product;
  placeholders: Record<string, string>;
  imagesLoaded: Record<string, boolean>;
  imageErrors: Record<string, boolean>;
  fallbackImage: string;
  handleImageError: (url: string) => void;
}

const ProductImageDisplay = ({
  activeImage,
  product,
  placeholders,
  imagesLoaded,
  imageErrors,
  fallbackImage,
  handleImageError
}: ProductImageDisplayProps) => {
  const [loadAttempt, setLoadAttempt] = useState(0);
  
  // Reset load attempt when active image changes
  useEffect(() => {
    setLoadAttempt(0);
    console.log("Active image in ProductImageDisplay:", activeImage);
  }, [activeImage]);
  
  // Get appropriate image source with fallbacks
  const getImageSource = (url: string) => {
    if (!url) {
      console.log("No URL provided to getImageSource, using fallback");
      return fallbackImage;
    }
    
    // Always check if there's an error with this URL first
    if (imageErrors[url]) {
      console.log(`Using fallback for image with error: ${url} -> ${fallbackImage}`);
      return fallbackImage;
    }
    
    // If this is a retry attempt, add a cache-busting parameter
    if (loadAttempt > 0) {
      console.log(`Adding cache buster to URL: ${url}, attempt: ${loadAttempt}`);
      return `${url}${url.includes('?') ? '&' : '?'}_attempt=${loadAttempt}`;
    }
    
    // For Cloudinary URLs, ensure we're using the proper URL format
    if (url.includes('cloudinary.com')) {
      console.log("Using Cloudinary URL:", url);
    }
    
    return url;
  };

  const handleManualRetry = () => {
    // Increment load attempt to trigger a cache-busting reload
    setLoadAttempt(prev => prev + 1);
    
    // Clear the error for this image
    if (imageErrors[activeImage]) {
      handleImageError(activeImage); // This will reset the error status
    }
    
    toast.info("Retrying image load...");
  };
  
  // Prepare the image source with potential cache busting
  const imageSource = getImageSource(activeImage);

  return (
    <motion.div 
      className="relative aspect-square rounded-lg overflow-hidden bg-white border"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Show low-quality placeholder first */}
      {placeholders[activeImage] && !imagesLoaded[activeImage] && !imageErrors[activeImage] && (
        <div className="absolute inset-0 flex items-center justify-center bg-white">
          <img 
            src={placeholders[activeImage]} 
            alt="Low quality placeholder"
            className="h-full w-full object-contain blur-sm transition-opacity duration-300"
            style={{ 
              filter: 'blur(10px)',
              transform: 'scale(1.1)' 
            }}
          />
        </div>
      )}
      
      {/* Show loading skeleton if no placeholder is available */}
      {!placeholders[activeImage] && !imagesLoaded[activeImage] && !imageErrors[activeImage] && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse" />
      )}
      
      <img
        src={imageSource}
        alt={product.name}
        className="h-full w-full object-contain p-6 transition-opacity duration-300"
        style={{ 
          opacity: imagesLoaded[activeImage] && !imageErrors[activeImage] ? 1 : 0 
        }}
        loading="eager" // Load main product image immediately
        onLoad={() => {
          console.log(`Image loaded successfully: ${imageSource}`);
          // Update the imagesLoaded status
          imagesLoaded[activeImage] = true;
        }}
        onError={(e) => {
          console.log(`Main image error (attempt ${loadAttempt}), URL: ${imageSource}`);
          handleImageError(activeImage);
          
          // Try a direct approach if it's a Cloudinary URL
          if (activeImage.includes('cloudinary.com') && !activeImage.includes('_attempt=')) {
            console.log("Attempting direct Cloudinary URL fix for:", activeImage);
            
            // Get the image element and try to fix the URL
            const imgElement = e.target as HTMLImageElement;
            if (activeImage.includes('/upload/')) {
              try {
                // For direct Cloudinary URLs, ensure we're using v1
                const parts = activeImage.split('/upload/');
                if (parts.length === 2) {
                  const fixedUrl = `${parts[0]}/upload/v1/${parts[1]}`;
                  console.log("Fixed Cloudinary URL:", fixedUrl);
                  imgElement.src = fixedUrl;
                  return; // Early return to give this a chance to load
                }
              } catch (err) {
                console.error("Error fixing Cloudinary URL:", err);
              }
            }
          }
        }}
      />
      
      <div className="absolute top-4 left-4">
        <Badge className="glass">{product.zone}</Badge>
      </div>
      
      {/* Add manual retry button for problematic images */}
      {imageErrors[activeImage] && (
        <div className="absolute bottom-4 right-4">
          <button 
            onClick={handleManualRetry}
            className="bg-blue-600 text-white px-2 py-1 rounded text-xs"
          >
            Retry Image
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default ProductImageDisplay;
