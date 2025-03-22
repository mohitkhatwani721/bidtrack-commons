
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Product } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { getRelevantPlaceholder, generateAdditionalImages } from "@/utils/imageUtils";

interface ProductImageGalleryProps {
  product: Product;
}

const ProductImageGallery = ({ product }: ProductImageGalleryProps) => {
  // Generate additional relevant images for thumbnails based on product type
  const mainImage = product.imageUrl || getRelevantPlaceholder(product.name);
  const productImages = generateAdditionalImages(product.name, mainImage);
  
  const fallbackImage = getRelevantPlaceholder(product.name);
  const [activeImage, setActiveImage] = useState<string>(productImages[0]);
  const [imagesLoaded, setImagesLoaded] = useState<Record<string, boolean>>({});
  
  // Preload all images
  useEffect(() => {
    const preloadImages = async () => {
      const imagePromises = productImages.map(
        (src) =>
          new Promise((resolve) => {
            const img = new Image();
            img.src = optimizeImageUrl(src);
            img.onload = () => {
              setImagesLoaded((prev) => ({ ...prev, [src]: true }));
              resolve(true);
            };
            img.onerror = () => {
              setImagesLoaded((prev) => ({ ...prev, [src]: false }));
              resolve(false);
            };
          })
      );
      
      await Promise.all(imagePromises);
    };
    
    preloadImages();
  }, [productImages]);
  
  // Function to optimize image URLs for better performance
  const optimizeImageUrl = (url: string): string => {
    // If it's an Unsplash image, add size optimization parameters
    if (url.includes('images.unsplash.com')) {
      // Extract the original URL parameters
      const hasParams = url.includes('?');
      // For thumbnails, use a smaller width (300px)
      const isThumbnail = !url.includes('w=') || url !== activeImage;
      const optimizedWidth = isThumbnail ? 'w=300' : 'w=800';
      const qualityParam = 'q=80'; // Use 80% quality
      
      // Add or replace width parameter
      if (hasParams) {
        if (url.includes('w=')) {
          return url.replace(/w=\d+/, optimizedWidth);
        } else {
          return `${url}&${optimizedWidth}&${qualityParam}`;
        }
      } else {
        return `${url}?${optimizedWidth}&${qualityParam}`;
      }
    }
    
    // Return unmodified URL if it's not from Unsplash
    return url;
  };
  
  return (
    <div className="space-y-6">
      <motion.div 
        className="relative aspect-square rounded-lg overflow-hidden bg-white border"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Show loading skeleton if main image isn't loaded yet */}
        {!imagesLoaded[activeImage] && (
          <div className="absolute inset-0 bg-gray-100 animate-pulse" />
        )}
        
        <img
          src={optimizeImageUrl(activeImage)}
          alt={product.name}
          className="h-full w-full object-contain p-6"
          loading="eager" // Load main product image immediately
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = fallbackImage;
            setActiveImage(fallbackImage);
          }}
        />
        
        <div className="absolute top-4 left-4">
          <Badge className="glass">{product.zone}</Badge>
        </div>
      </motion.div>
      
      <div className="grid grid-cols-3 gap-3">
        {productImages.map((image, i) => (
          <motion.div 
            key={i}
            className={`aspect-square rounded-md overflow-hidden bg-white cursor-pointer ${
              activeImage === image ? "ring-2 ring-primary" : "border"
            }`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 * i }}
            onClick={() => setActiveImage(image)}
          >
            {/* Show loading skeleton if thumbnail isn't loaded yet */}
            {!imagesLoaded[image] && (
              <div className="absolute inset-0 bg-gray-100 animate-pulse" />
            )}
            
            <img 
              src={optimizeImageUrl(image)}
              alt={`${product.name} view ${i + 1}`}
              className="h-full w-full object-contain p-2"
              loading="lazy" // Lazy load thumbnails
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = fallbackImage;
              }}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ProductImageGallery;
