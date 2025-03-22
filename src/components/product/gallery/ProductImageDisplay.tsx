
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/lib/types";

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
  // Get appropriate image source with fallbacks
  const getImageSource = (url: string) => {
    // Always check if there's an error with this URL first
    if (imageErrors[url]) {
      console.log(`Using fallback for image with error: ${url} -> ${fallbackImage}`);
      return fallbackImage;
    }
    
    return url;
  };

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
        src={getImageSource(activeImage)}
        alt={product.name}
        className="h-full w-full object-contain p-6 transition-opacity duration-300"
        style={{ 
          opacity: imagesLoaded[activeImage] && !imageErrors[activeImage] ? 1 : 0 
        }}
        loading="eager" // Load main product image immediately
        onError={() => {
          console.log("Main image error, falling back to sample image");
          handleImageError(activeImage);
        }}
      />
      
      <div className="absolute top-4 left-4">
        <Badge className="glass">{product.zone}</Badge>
      </div>
    </motion.div>
  );
};

export default ProductImageDisplay;
