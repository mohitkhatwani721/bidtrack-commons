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
  // Better sanitize function for Samsung URLs
  const sanitizeUrl = (url: string): string => {
    if (!url) return url;
    
    // Samsung URLs often break with query parameters
    if (url.includes('samsung.com') && url.includes('?')) {
      const cleanUrl = url.split('?')[0];
      console.log(`Sanitizing Samsung URL: ${url} -> ${cleanUrl}`);
      return cleanUrl;
    }
    
    return url;
  };

  // Process the main image URL first
  const mainImageRaw = product.imageUrl;
  console.log("Original main image:", mainImageRaw);
  
  const mainImage = mainImageRaw ? sanitizeUrl(mainImageRaw) : getRelevantPlaceholder(product.name);
  console.log("Processed main image:", mainImage);
  
  // Generate additional relevant images for thumbnails based on product type
  const productImages = generateAdditionalImages(product.name, mainImage);
  console.log("Generated product images:", productImages);
  
  const fallbackImage = getRelevantPlaceholder(product.name);
  const [activeImage, setActiveImage] = useState<string>(mainImage); // Use main image as initial active
  const [imagesLoaded, setImagesLoaded] = useState<Record<string, boolean>>({});
  const [placeholders, setPlaceholders] = useState<Record<string, string>>({});
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const isMounted = useRef(true);
  
  // Reset active image if product changes
  useEffect(() => {
    setActiveImage(mainImage);
    // Reset error state for new product
    setImageErrors({});
  }, [product.id, mainImage]);
  
  // Improved error handling for image loading
  const handleImageError = (url: string) => {
    console.log(`Error loading image: ${url}`);
    
    // Don't set error state for already sanitized URLs to prevent loops
    if (!url.includes('samsung.com') || !url.includes('?')) {
      setImageErrors(prev => ({ ...prev, [url]: true }));
      
      // If the main image failed to load, use fallback
      if (url === activeImage) {
        console.log(`Setting fallback for active image: ${url} -> ${fallbackImage}`);
        setActiveImage(fallbackImage);
        toast.error("Unable to load product image. Using placeholder instead.", {
          id: "image-error",
          duration: 3000
        });
      }
    }
  };
  
  // Get appropriate image source with fallbacks
  const getImageSource = (url: string) => {
    // Always check if there's an error with this URL first
    if (imageErrors[url]) {
      console.log(`Using fallback for image with error: ${url} -> ${fallbackImage}`);
      return fallbackImage;
    }
    
    // Sanitize URL first (especially important for Samsung)
    const sanitizedUrl = sanitizeUrl(url);
    
    // For Samsung URLs, use the sanitized URL without optimization 
    if (sanitizedUrl.includes('samsung.com')) {
      return sanitizedUrl;
    }
    
    // For other URLs, use optimization
    return optimizeImageUrl(sanitizedUrl, url === activeImage);
  };
  
  // Load low-quality placeholders first
  useEffect(() => {
    const loadPlaceholders = async () => {
      try {
        const placeholderPromises = productImages.map(async (image) => {
          try {
            // Sanitize URL before generating placeholder
            const sanitizedImage = sanitizeUrl(image);
            const placeholder = await generateLowQualityImagePlaceholder(sanitizedImage);
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
        // Sanitize all URLs before preloading
        const sanitizedImages = productImages.map(img => sanitizeUrl(img));
        
        const loadStatus = await preloadImages(sanitizedImages);
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
