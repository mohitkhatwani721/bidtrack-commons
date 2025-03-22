
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Product } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { 
  getRelevantPlaceholder, 
  generateAdditionalImages, 
  optimizeImageUrl, 
  preloadImages,
  generateLowQualityImagePlaceholder
} from "@/utils/imageUtils";
import { toast } from "sonner";

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
  const [placeholders, setPlaceholders] = useState<Record<string, string>>({});
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const isMounted = useRef(true);
  
  // Improved error handling for image loading
  const handleImageError = (url: string) => {
    console.log(`Error loading image: ${url}`);
    setImageErrors(prev => ({ ...prev, [url]: true }));
    
    // If the main image failed to load, use fallback
    if (url === activeImage) {
      setActiveImage(fallbackImage);
      toast.error("Unable to load product image. Using placeholder instead.", {
        id: "image-error",
        duration: 3000
      });
    }
  };
  
  // Get appropriate image source with fallbacks
  const getImageSource = (url: string) => {
    if (imageErrors[url]) {
      return fallbackImage;
    }
    return optimizeImageUrl(url, url === activeImage);
  };
  
  // Load low-quality placeholders first
  useEffect(() => {
    const loadPlaceholders = async () => {
      try {
        const placeholderPromises = productImages.map(async (image) => {
          try {
            const placeholder = await generateLowQualityImagePlaceholder(image);
            if (placeholder && isMounted.current) {
              setPlaceholders((prev) => ({
                ...prev,
                [image]: placeholder
              }));
            }
          } catch (error) {
            console.error(`Error generating placeholder for ${image}:`, error);
          }
        });
        
        await Promise.all(placeholderPromises);
      } catch (error) {
        console.error("Error loading placeholders:", error);
      }
    };
    
    loadPlaceholders();
    
    return () => {
      isMounted.current = false;
    };
  }, [productImages]);
  
  // Preload all images with full quality
  useEffect(() => {
    const loadImages = async () => {
      try {
        const loadStatus = await preloadImages(productImages);
        if (isMounted.current) {
          setImagesLoaded(loadStatus);
          
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
  }, [productImages, activeImage]);
  
  return (
    <div className="space-y-6">
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
          onError={() => handleImageError(activeImage)}
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
            onClick={() => !imageErrors[image] && setActiveImage(image)}
          >
            {/* Show low-quality placeholder first */}
            {placeholders[image] && !imagesLoaded[image] && !imageErrors[image] && (
              <div className="absolute inset-0 flex items-center justify-center">
                <img 
                  src={placeholders[image]} 
                  alt="Low quality placeholder"
                  className="h-full w-full object-contain blur-sm"
                  style={{ 
                    filter: 'blur(5px)',
                    transform: 'scale(1.1)' 
                  }}
                />
              </div>
            )}
            
            {/* Show loading skeleton if no placeholder is available */}
            {!placeholders[image] && !imagesLoaded[image] && !imageErrors[image] && (
              <div className="absolute inset-0 bg-gray-100 animate-pulse" />
            )}
            
            <img 
              src={getImageSource(image)}
              alt={`${product.name} view ${i + 1}`}
              className="h-full w-full object-contain p-2 transition-opacity duration-300"
              style={{ 
                opacity: imagesLoaded[image] && !imageErrors[image] ? 1 : 0 
              }}
              loading="lazy" // Lazy load thumbnails
              onError={() => handleImageError(image)}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ProductImageGallery;
